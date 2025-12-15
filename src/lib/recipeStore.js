import recipes from "@/data/recipes.json";
import { canonicalIngredientMap } from "./ingredientSchema";
import { getRecipeCache, setRecipeCache, hashIngredients } from "./cache";

const recipeList = recipes.map((recipe) => ({
  ...recipe,
  ingredients: recipe.ingredients || [],
}));

export function getRecipeById(id) {
  return recipeList.find((recipe) => recipe.id === id) || null;
}

export function computeRecipeMatches(canonicalIds = []) {
  const ingredientSet = new Set(canonicalIds);

  return recipeList.map((recipe) => {
    const matchedIngredients = recipe.ingredients.filter((id) =>
      ingredientSet.has(id)
    );
    const missingIngredientIds = recipe.ingredients.filter(
      (id) => !ingredientSet.has(id)
    );

    return {
      ...recipe,
      matchedIngredients,
      missingIngredientIds,
      matchedIngredientCount: matchedIngredients.length,
      missingIngredientCount: missingIngredientIds.length,
      matchRatio:
        recipe.ingredients.length > 0
          ? matchedIngredients.length / recipe.ingredients.length
          : 0,
    };
  });
}

export function findRecipesForIngredientSet(
  canonicalIds = [],
  { strict } = {}
) {
  const hash = hashIngredients(canonicalIds);
  const cached = getRecipeCache(hash);
  if (cached) return cached;

  const scored = computeRecipeMatches(canonicalIds);
  const exactMatches = scored
    .filter((recipe) => (strict ? recipe.missingIngredientCount === 0 : true))
    .sort((a, b) => b.matchRatio - a.matchRatio);

  const nearMatches = scored
    .filter((recipe) => recipe.missingIngredientCount > 0)
    .sort((a, b) => a.missingIngredientCount - b.missingIngredientCount);

  const result = { exactMatches, nearMatches };
  setRecipeCache(hash, result);
  return result;
}

export function ingredientNameForId(id) {
  return canonicalIngredientMap.get(id)?.name || id;
}
