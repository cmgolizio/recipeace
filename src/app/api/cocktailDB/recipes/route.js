import axios from "axios";
import { NextResponse } from "next/server";

// const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ingredients = searchParams.get("ingredients");

  if (!ingredients) {
    return NextResponse.json(
      { error: "Ingredients parameter is required" },
      { status: 400 }
    );
  }
  const options = {
    method: "GET",
    url: "https://the-cocktail-db.p.rapidapi.com/filter.php",
    params: {
      i: ingredients,
    },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      "x-rapidapi-host": "the-cocktail-db.p.rapidapi.com",
    },
  };

  try {
    // Build CocktailDB query (comma-separated ingredients)
    // const url = `${BASE_URL}/filter.php?i=${ingredients}`;
    const res = await axios.request(options);

    if (!res.ok) {
      throw new Error(`CocktailDB request failed: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching cocktails:", err);
    return NextResponse.json(
      { error: "Failed to fetch cocktails" },
      { status: 500 }
    );
  }
}
