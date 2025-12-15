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
import { ingredientNameForId } from "./recipeStore";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildIngredientPrompt() {
  const catalog = canonicalIngredients
    .map(
      (ing) =>
        `- id: ${ing.id}, name: ${ing.name}, aliases: ${ing.aliases.join(", ")}`
    )
    .join("\n");
  return `Normalize the free-text ingredients into canonical ids.\nYou must choose from this catalog and drop anything else.\nReturn only strict JSON that matches the schema with field names: canonicalId, canonicalName, rawInput.\nNever invent nutrition, allergens, or measurements.\nCatalog:\n${catalog}`;
}

export async function normalizeIngredients(rawInput) {
  const trimmed = String(rawInput || "").trim();
  if (!trimmed) {
    return { normalizedIngredients: [] };
  }

  const hash = hashIngredients([trimmed]);
  const cached = getIngredientCache(hash);
  if (cached) return cached;

  const system = buildIngredientPrompt();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content:
          "Raw user ingredient text. Normalize against catalog and omit unknown items.\n" +
          trimmed,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM did not return content");

  const parsed = JSON.parse(content);
  const validated = normalizedIngredientResponseSchema.parse(parsed);

  const sanitized = {
    normalizedIngredients: validated.normalizedIngredients
      .map((item) => {
        const canonical = canonicalIngredientMap.get(item.canonicalId);
        if (!canonical) return null;
        return {
          canonicalId: canonical.id,
          canonicalName: canonical.name,
          rawInput: item.rawInput,
        };
      })
      .filter(Boolean),
  };

  setIngredientCache(hash, sanitized);
  return sanitized;
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

export function attachSubstitutions(recipes, rankings) {
  if (!rankings) return recipes;
  const rankingMap = new Map(rankings.map((r) => [r.id, r]));
  return recipes.map((recipe) => {
    const ranking = rankingMap.get(recipe.id);
    const substitutions = ranking?.substitutions?.map((sub) => ({
      missingId: sub.missingId,
      missingName: ingredientNameForId(sub.missingId),
      suggestedId: sub.suggestedCanonicalId,
      suggestedName: ingredientNameForId(sub.suggestedCanonicalId),
      note: sub.note,
    }));
    return { ...recipe, substitutions };
  });
}
