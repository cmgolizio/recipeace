import { NextResponse } from "next/server";
import { getRecipeById, ingredientNameForId } from "@/lib/recipeStore";

export async function GET(_req, { params }) {
  const recipe = getRecipeById(params.id);
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const ingredients = recipe.ingredients.map((id) => ({
    id,
    name: ingredientNameForId(id),
  }));

  return NextResponse.json({ ...recipe, ingredients });
}
