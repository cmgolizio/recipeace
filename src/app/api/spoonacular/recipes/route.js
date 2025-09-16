import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ingredients = searchParams.get("ingredients"); // comma-separated
  const strict = searchParams.get("strict") === "true"; // filter-only mode

  if (!ingredients) {
    return NextResponse.json({ error: "Missing ingredients" }, { status: 400 });
  }

  const options = {
    method: "GET",
    url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients",
    params: {
      ingredients: ingredients,
      number: "6",
      // ignorePantry: "true",
      ranking: strict ? 2 : 1,
    },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  try {
    const res = await axios.request(options);

    return NextResponse.json(res.data);
  } catch (err) {
    console.error("Error fetching recipes:", err.response?.data || err.message);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
