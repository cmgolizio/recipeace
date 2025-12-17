import crypto from "crypto";
import OpenAI from "openai";
import {
  canonicalIngredients,
  canonicalIngredientMap,
  normalizedIngredientResponseSchema,
  rankedRecipeResponseSchema,
} from "./ingredientSchema";
import {
  getIngredientCache,
  setIngredientCache,
  hashIngredients,
} from "./cache";
import supabase from "./supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STATIC_INGREDIENT_SYSTEM_PROMPT =
  `You are an ingredient normalizer.\n` +
  `For each user supplied ingredient, produce a canonical record with: canonicalId (lowercase slug), canonicalName (human friendly), category, and rawInput.\n` +
  `Categories should be simple groupings like produce, dairy, protein, spice, pantry, beverage, or other.\n` +
  `Never add nutrition or measurements. Always return strict JSON matching { normalizedIngredients: [{ canonicalId, canonicalName, category, rawInput }] }.\n` +
  `If you recognize a common pantry item, reuse the same canonicalId (slug format). Do not invent allergens or quantity details.`;

function slugifyId(value) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
  if (cleaned) return cleaned;
  return `ingredient_${crypto.randomUUID()}`;
}

function parseIngredientInputs(rawInput) {
  return String(rawInput || "")
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function mapSupabaseIngredient(row, rawInput) {
  return {
    canonicalId: row.id || slugifyId(row.name || rawInput),
    canonicalName: row.name || rawInput,
    category: row.category || row.label || "other",
    rawInput,
  };
}

function lookupLocalIngredient(name) {
  const normalized = name.toLowerCase();
  for (const ing of canonicalIngredients) {
    if (ing.name.toLowerCase() === normalized) {
      return {
        canonicalId: ing.id,
        canonicalName: ing.name,
        category: ing.category,
        rawInput: name,
      };
    }
    if (ing.aliases.some((alias) => alias.toLowerCase() === normalized)) {
      return {
        canonicalId: ing.id,
        canonicalName: ing.name,
        category: ing.category,
        rawInput: name,
      };
    }
  }
  return null;
}

async function fetchIngredientsFromSupabase(inputs = []) {
  const results = [];
  for (const input of inputs) {
    try {
      const { data, error } = await supabase
        .from("ingredients")
        .select("id, name, category, label, aliases")
        .or(`name.ilike.${input},aliases.cs.{${input.toLowerCase()}}`)
        .maybeSingle();

      if (!error && data) {
        results.push(mapSupabaseIngredient(data, input));
      }
    } catch (err) {
      console.warn("Supabase ingredient lookup failed", err);
    }
  }
  return results;
}

async function upsertIngredientsInSupabase(records = []) {
  if (!records.length) return;
  try {
    await supabase.from("ingredients").upsert(
      records.map((record) => ({
        id: record.canonicalId,
        name: record.canonicalName,
        category: record.category || null,
        aliases: [record.rawInput],
        source: "openai",
      }))
    );
  } catch (err) {
    console.warn("Supabase ingredient upsert failed", err);
  }
}

function dedupeNormalizedIngredients(list = []) {
  const seen = new Map();
  for (const entry of list) {
    if (!entry?.canonicalId) continue;
    if (!seen.has(entry.canonicalId)) {
      seen.set(entry.canonicalId, entry);
    }
  }
  return Array.from(seen.values());
}

async function requestIngredientNormalization(inputs) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: STATIC_INGREDIENT_SYSTEM_PROMPT },
      {
        role: "user",
        content:
          "Normalize the following ingredient list. Preserve the raw spelling in rawInput.\n" +
          inputs.join("\n"),
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM did not return content");

  const parsed = JSON.parse(content);
  const validated = normalizedIngredientResponseSchema.parse(parsed);

  return validated.normalizedIngredients.map((ing, index) => ({
    canonicalId: slugifyId(ing.canonicalId),
    canonicalName: ing.canonicalName,
    category: ing.category || "other",
    rawInput: ing.rawInput || inputs[index] || ing.canonicalName,
  }));
}

const STATIC_RECIPE_SYSTEM_PROMPT =
  `You are a recipe planner for a pantry assistant.\n` +
  `Always return strict JSON with a recipes array of objects: { id, title, summary, image, ingredients, steps, source }.\n` +
  `The id must be a short lowercase slug with underscores. Ingredients should list canonical ids supplied by the user whenever possible.\n` +
  `Do not include nutrition, allergens, or measurements. Use clear, concise steps (3-6). Keep summaries brief.`;

export async function generateRecipesWithLLM(normalizedIngredients = []) {
  const ingredientSummary = normalizedIngredients
    .map((ing) => `${ing.canonicalName} (${ing.canonicalId})`)
    .join(", ");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: STATIC_RECIPE_SYSTEM_PROMPT },
      {
        role: "user",
        content:
          "Generate 3 to 6 recipe options that rely on these user ingredients.\n" +
          `User ingredients: ${ingredientSummary}.\n` +
          "Use pantry staples sparingly (salt, pepper, oil) without listing measurements.\n" +
          "Return only JSON with a recipes array.",
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) return [];

  const parsed = JSON.parse(content);
  const recipes = Array.isArray(parsed.recipes) ? parsed.recipes : [];

  return recipes
    .map((recipe, index) => ({
      id: slugifyId(recipe.id || recipe.title || `recipe_${index}`),
      title: recipe.title || recipe.name || `Recipe ${index + 1}`,
      summary: recipe.summary || recipe.description || "",
      image: recipe.image || recipe.image_url || null,
      ingredients: (recipe.ingredients || [])
        .map((ing) => {
          if (typeof ing === "string") return slugifyId(ing);
          if (ing?.canonicalId) return slugifyId(ing.canonicalId);
          return null;
        })
        .filter(Boolean),
      steps: recipe.steps?.length
        ? recipe.steps
        : recipe.instructions
        ? Array.isArray(recipe.instructions)
          ? recipe.instructions
          : [recipe.instructions]
        : [],
      source: recipe.source || "openai",
    }))
    .filter((recipe) => recipe.ingredients.length);
}

export async function normalizeIngredients(rawInput) {
  const trimmed = String(rawInput || "").trim();
  if (!trimmed) {
    return { normalizedIngredients: [] };
  }

  const parsedInputs = parseIngredientInputs(trimmed);
  const hash = hashIngredients(parsedInputs);
  const cached = getIngredientCache(hash);
  if (cached) return cached;

  const supabaseResults = await fetchIngredientsFromSupabase(parsedInputs);
  const alreadySatisfied = new Set(
    supabaseResults.map((entry) => entry.rawInput.toLowerCase())
  );

  const localResults = parsedInputs
    .filter((item) => !alreadySatisfied.has(item.toLowerCase()))
    .map((item) => lookupLocalIngredient(item))
    .filter(Boolean);

  const remainingInputs = parsedInputs.filter(
    (item) =>
      !alreadySatisfied.has(item.toLowerCase()) &&
      !localResults.some(
        (res) => res.rawInput.toLowerCase() === item.toLowerCase()
      )
  );

  let llmResults = [];
  if (remainingInputs.length) {
    llmResults = await requestIngredientNormalization(remainingInputs);
    await upsertIngredientsInSupabase(llmResults);
  }

  const combined = dedupeNormalizedIngredients([
    ...supabaseResults,
    ...localResults,
    ...llmResults,
  ]);

  const payload = { normalizedIngredients: combined };
  setIngredientCache(hash, payload);
  return payload;
}

export async function rankRecipesWithLLM({ recipes, normalizedIngredients }) {
  if (!recipes?.length) return null;

  const allowedIds = recipes.map((r) => r.id);
  const ingredientSummary = normalizedIngredients
    .map((ing) => `${ing.canonicalName} (${ing.canonicalId})`)
    .join(", ");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Rank existing recipes without inventing new ones.\n" +
          "Only reorder the provided ids and optionally suggest substitutions using canonical ingredient ids.\n" +
          "Do not add nutrition, allergens, or measurements.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              `Available ingredients: ${ingredientSummary}.\n` +
              `Recipe candidates (ids only): ${allowedIds.join(", ")}.\n` +
              "Return ranked array with fields id, score (0-1), reason, and optional substitutions listing missingId and suggestedCanonicalId.",
          },
        ],
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content);
  const validated = rankedRecipeResponseSchema.parse(parsed);

  const filteredRankings = validated.ranked.filter((entry) =>
    allowedIds.includes(entry.id)
  );

  return filteredRankings;
}

export function mergeRanking(recipes, rankings) {
  if (!rankings || !rankings.length) return recipes;
  const rankingMap = new Map(rankings.map((r) => [r.id, r]));
  return [...recipes].sort((a, b) => {
    const scoreA = rankingMap.get(a.id)?.score ?? a.matchRatio;
    const scoreB = rankingMap.get(b.id)?.score ?? b.matchRatio;
    return scoreB - scoreA;
  });
}

export function attachSubstitutions(
  recipes,
  rankings,
  ingredientNameResolver = (id) =>
    canonicalIngredientMap.get(id)?.name || String(id)
) {
  if (!rankings) return recipes;
  const rankingMap = new Map(rankings.map((r) => [r.id, r]));
  return recipes.map((recipe) => {
    const ranking = rankingMap.get(recipe.id);
    const substitutions = ranking?.substitutions?.map((sub) => ({
      missingId: sub.missingId,
      missingName: ingredientNameResolver(sub.missingId),
      suggestedId: sub.suggestedCanonicalId,
      suggestedName: ingredientNameResolver(sub.suggestedCanonicalId),
      note: sub.note,
    }));
    return { ...recipe, substitutions };
  });
}
