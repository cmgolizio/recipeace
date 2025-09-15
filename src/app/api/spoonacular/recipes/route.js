import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ingredients = searchParams.get("ingredients");

  if (!ingredients) {
    return NextResponse.json({ error: "Missing ingredients" }, { status: 400 });
  }

  try {
    const res = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          ingredients, // comma-separated list
          number: 12, // limit results
          ranking: 1, // prioritize recipes that use more of the given ingredients
          apiKey: process.env.NEXT_PUBLIC_RAPID_API_KEY,
        },
      }
    );

    return NextResponse.json(res.data, { status: 200 });
  } catch (err) {
    console.error("Spoonacular API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
