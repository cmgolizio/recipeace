import { NextResponse } from "next/server";
import {
  normalizeIngredients,
  rankRecipesWithLLM,
  mergeRanking,
  attachSubstitutions,
} from "@/lib/llm";
import {
  findRecipesForIngredientSet,
  ingredientNameForId,
} from "@/lib/recipeStore";
import { normalizedIngredientResponseSchema } from "@/lib/ingredientSchema";

export async function POST(req) {
  try {
    const { ingredients, strict = false, rank = true } = await req.json();
    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Provide at least one ingredient" },
        { status: 400 }
      );
    }

    const flattenedInput = Array.isArray(ingredients)
      ? ingredients.map((item) =>
          typeof item === "string"
            ? item
            : item.rawInput || item.name || item.canonicalName || ""
        )
      : [];

    const normalized = await normalizeIngredients(flattenedInput.join(", "));
    const validatedNormalized =
      normalizedIngredientResponseSchema.parse(normalized);

    if (validatedNormalized.normalizedIngredients.length === 0) {
      return NextResponse.json(
        { error: "No recognizable ingredients" },
        { status: 400 }
      );
    }

    const canonicalIds = validatedNormalized.normalizedIngredients.map(
      (ing) => ing.canonicalId
    );

    const { exactMatches, nearMatches } = findRecipesForIngredientSet(
      canonicalIds,
      {
        strict,
      }
    );

    const mapMissing = (recipeList) =>
      recipeList.map((recipe) => ({
        ...recipe,
        missingIngredients: recipe.missingIngredientIds.map((id) =>
          ingredientNameForId(id)
        ),
        matchedIngredientNames: recipe.matchedIngredients.map((id) =>
          ingredientNameForId(id)
        ),
      }));

    const shapedExact = mapMissing(exactMatches);
    const shapedNear = mapMissing(nearMatches);

    const ranked = rank
      ? await rankRecipesWithLLM({
          recipes: shapedExact,
          normalizedIngredients: validatedNormalized.normalizedIngredients,
        })
      : null;

    const mergedExact = mergeRanking(shapedExact, ranked);
    const enrichedExact = attachSubstitutions(mergedExact, ranked);

    return NextResponse.json(
      {
        normalizedIngredients: validatedNormalized.normalizedIngredients,
        recipes: enrichedExact,
        nearMatches: shapedNear,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("recipe search error", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
