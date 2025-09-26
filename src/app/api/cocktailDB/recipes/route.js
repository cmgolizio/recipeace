import axios from "axios";
import { NextResponse } from "next/server";

import { parseIngredients } from "@/lib/cocktailDb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ingredients = searchParams.get("ingredients");
  const parsedIngredientsList = parseIngredients(ingredients);

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
      i: parsedIngredientsList,
    },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      "x-rapidapi-host": "the-cocktail-db.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    const data = response.data;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching cocktails:", err);
    return NextResponse.json(
      { error: "Failed to fetch cocktails" },
      { status: 500 }
    );
  }
}
