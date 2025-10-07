// /app/api/drank/recipe/[id]/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req, { params }) {
  try {
    const { id } = await params; // cocktail ID from the URL

    if (!id) {
      return NextResponse.json(
        { error: "No cocktail ID provided" },
        { status: 400 }
      );
    }

    // Fetch cocktail info
    const { data: cocktail, error: cocktailError } = await supabase
      .from("cocktails")
      .select("id, name, category, instructions, glass_type, tags")
      .eq("id", id)
      .maybeSingle();

    if (cocktailError) {
      console.error("Supabase error fetching cocktail:", cocktailError);
      return NextResponse.json(
        { error: cocktailError.message },
        { status: 500 }
      );
    }

    if (!cocktail) {
      return NextResponse.json(
        { error: "Cocktail not found" },
        { status: 404 }
      );
    }

    // Fetch ingredients for this cocktail
    const { data: ingredients, error: ingredientsError } = await supabase
      .from("cocktail_ingredients")
      .select(
        `
        ingredient_id,
        ingredients!inner(name, type, subcategory, abv, notes)
      `
      )
      .eq("cocktail_id", id);

    if (ingredientsError) {
      console.error("Supabase error fetching ingredients:", ingredientsError);
      return NextResponse.json(
        { error: ingredientsError.message },
        { status: 500 }
      );
    }

    // Format response
    const formattedIngredients = ingredients.map((row) => row.ingredients);

    return NextResponse.json({
      ...cocktail,
      ingredients: formattedIngredients,
    });
  } catch (err) {
    console.error("Error in /api/drank/recipe/[id]:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
