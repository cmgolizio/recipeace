import recipes from "@/data/recipes.json";

import { getRecipeCache, hashIngredients, setRecipeCache } from "./cache";
import { generateRecipesWithLLM } from "./llm";
import supabase from "./supabase";

const baseRecipes = recipes.map((recipe) => ({
  ...recipe,
  ingredients: recipe.ingredients || [],
  steps: recipe.steps || [],
  source: recipe.source || "static",
}));

const baseRecipeMap = new Map(baseRecipes.map((recipe) => [recipe.id, recipe]));

function mapRecipeRecord(record, source = "supabase") {
  if (!record) return null;
  return {
    id: record.id,
    title: record.title,
    summary: record.summary || record.description || "",
    image: record.image || record.image_url || null,
    ingredients: record.ingredients || record.ingredient_ids || [],
    steps: record.steps || record.instructions || [],
    source: record.source || source,
  };
}

function dedupeRecipes(list = []) {
  const map = new Map();
  for (const recipe of list) {
    if (!recipe?.id) continue;
    if (!map.has(recipe.id)) {
      map.set(recipe.id, recipe);
    }
  }
  return Array.from(map.values());
}

async function fetchSupabaseRecipes(canonicalIds = []) {
  if (!canonicalIds.length) return [];
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        "id, title, summary, image, ingredients, steps, source, ingredient_ids"
      )
      .overlaps("ingredients", canonicalIds);

    if (error) {
      console.warn("Supabase recipe fetch failed", error);
      return [];
    }

    return (data || [])
      .map((record) => mapRecipeRecord(record))
      .filter(Boolean);
  } catch (err) {
    console.warn("Supabase recipe lookup error", err);
    return [];
  }
}

async function upsertSupabaseRecipes(recipesToPersist = []) {
  if (!recipesToPersist.length) return;
  try {
    await supabase.from("recipes").upsert(
      recipesToPersist.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        summary: recipe.summary || null,
        image: recipe.image || null,
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || [],
        source: recipe.source || "openai",
      }))
    );
  } catch (err) {
    console.warn("Supabase recipe upsert failed", err);
  }
}

function scoreRecipes(recipesList, canonicalIds, { strict } = {}) {
  const ingredientSet = new Set(canonicalIds);

  const scored = recipesList.map((recipe) => {
    const ingredients = recipe.ingredients || [];
    const matchedIngredients = ingredients.filter((id) =>
      ingredientSet.has(id)
    );
    const missingIngredientIds = ingredients.filter(
      (id) => !ingredientSet.has(id)
    );

    return {
      ...recipe,
      matchedIngredients,
      missingIngredientIds,
      matchedIngredientCount: matchedIngredients.length,
      missingIngredientCount: missingIngredientIds.length,
      matchRatio: ingredients.length
        ? matchedIngredients.length / ingredients.length
        : 0,
    };
  });

  const exactMatches = scored
    .filter((recipe) => (strict ? recipe.missingIngredientCount === 0 : true))
    .sort((a, b) => b.matchRatio - a.matchRatio);

  const nearMatches = scored
    .filter((recipe) => recipe.missingIngredientCount > 0)
    .sort((a, b) => a.missingIngredientCount - b.missingIngredientCount);

  return { exactMatches, nearMatches };
}

export async function findRecipesForIngredients(
  normalizedIngredients,
  { strict } = {}
) {
  const canonicalIds = normalizedIngredients.map((ing) => ing.canonicalId);
  const hash = hashIngredients(canonicalIds);
  const cached = getRecipeCache(hash);
  if (cached) return cached;

  const supabaseRecipes = await fetchSupabaseRecipes(canonicalIds);
  let recipePool = dedupeRecipes([...baseRecipes, ...supabaseRecipes]);

  if (!recipePool.length) {
    const generated = await generateRecipesWithLLM(normalizedIngredients);
    if (generated.length) {
      recipePool = dedupeRecipes([...recipePool, ...generated]);
      await upsertSupabaseRecipes(generated);
    }
  }

  const scored = scoreRecipes(recipePool, canonicalIds, { strict });
  const result = {
    recipes: scored.exactMatches,
    nearMatches: scored.nearMatches,
  };
  setRecipeCache(hash, result);
  return result;
}

export async function getRecipeById(id) {
  if (!id) return null;
  if (baseRecipeMap.has(id)) return baseRecipeMap.get(id);

  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("id, title, summary, image, ingredients, steps, source")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return mapRecipeRecord(data);
  } catch (err) {
    console.warn("Supabase recipe by id failed", err);
    return null;
  }
}
