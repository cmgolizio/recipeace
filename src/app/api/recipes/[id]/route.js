import { NextResponse } from "next/server";

import { canonicalIngredientMap } from "@/lib/ingredientSchema";
import { getRecipeById } from "@/lib/recipeService";
import supabase from "@/lib/supabase";

async function resolveIngredientNames(ids = []) {
  const lookup = new Map();

  if (ids.length) {
    try {
      const { data, error } = await supabase
        .from("ingredients")
        .select("id, name")
        .in("id", ids);

      if (!error && data?.length) {
        for (const row of data) {
          lookup.set(row.id, row.name);
        }
      }
    } catch (err) {
      console.warn("Supabase ingredient resolution failed", err);
    }
  }

  return ids.map((id) => ({
    id,
    name: lookup.get(id) || canonicalIngredientMap.get(id)?.name || id,
  }));
}

export async function GET(_req, { params }) {
  const recipe = await getRecipeById(params.id);
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const ingredients = await resolveIngredientNames(recipe.ingredients || []);

  return NextResponse.json({ ...recipe, ingredients });
}
