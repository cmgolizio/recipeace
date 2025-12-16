import { z } from "zod";
import ingredients from "@/data/ingredients.json";

export const canonicalIngredientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  aliases: z.array(z.string()).default([]),
});

export const normalizedIngredientSchema = z.object({
  canonicalId: z.string().min(1),
  canonicalName: z.string().min(1),
  rawInput: z.string().min(1),
});

// export const normalizedIngredientResponseSchema = z.object({
//   normalizedIngredients: z.array(normalizedIngredientSchema),
// });
export const normalizedIngredientResponseSchema = z.object({
  normalizedIngredients: z.array(z.string()).default([]),
});

export const rankedRecipeSchema = z.object({
  id: z.string().min(1),
  score: z.number().min(0),
  reason: z.string().optional(),
  substitutions: z
    .array(
      z.object({
        missingId: z.string(),
        suggestedCanonicalId: z.string(),
        note: z.string().optional(),
      })
    )
    .optional(),
});

export const rankedRecipeResponseSchema = z.object({
  ranked: z.array(rankedRecipeSchema),
});

export const canonicalIngredients = canonicalIngredientSchema
  .array()
  .parse(ingredients);
export const canonicalIngredientMap = new Map(
  canonicalIngredients.map((ing) => [ing.id, ing])
);

export function ensureCanonicalIngredient(id) {
  return canonicalIngredientMap.get(id);
}

export function resolveCanonicalId(nameOrId) {
  const normalized = String(nameOrId || "")
    .trim()
    .toLowerCase();
  if (!normalized) return null;
  if (canonicalIngredientMap.has(normalized)) return normalized;
  for (const ing of canonicalIngredients) {
    if (ing.name.toLowerCase() === normalized) return ing.id;
    if (ing.aliases.some((alias) => alias.toLowerCase() === normalized)) {
      return ing.id;
    }
  }
  return null;
}
