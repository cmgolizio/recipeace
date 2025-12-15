import crypto from "crypto";

const ingredientCache = new Map();
const recipeCache = new Map();

export function hashIngredients(ingredients = []) {
  const normalized = ingredients
    .map((ing) =>
      typeof ing === "string"
        ? ing.trim().toLowerCase()
        : String(ing.canonicalId || ing.name || "")
            .trim()
            .toLowerCase()
    )
    .filter(Boolean)
    .sort();

  const hash = crypto
    .createHash("sha256")
    .update(normalized.join("|"), "utf8")
    .digest("hex");

  return hash;
}

export function getIngredientCache(hash) {
  return ingredientCache.get(hash);
}

export function setIngredientCache(hash, value) {
  ingredientCache.set(hash, value);
}

export function getRecipeCache(hash) {
  return recipeCache.get(hash);
}

export function setRecipeCache(hash, value) {
  recipeCache.set(hash, value);
}
