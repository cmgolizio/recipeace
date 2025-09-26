import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Please enter an ingredient" },
      { status: 400 }
    );
  }
  const options = {
    method: "GET",
    url: "https://the-cocktail-db.p.rapidapi.com/search.php",
    params: { i: query },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      "x-rapidapi-host": "the-cocktail-db.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    const data = response.data;

    if (!data) {
      return NextResponse.json(
        { isValid: false, message: "Ingredient not found" },
        { status: 404 }
      );
    }

    const mutatedData = {
      isValid: true,
      name: data.ingredients[0].strIngredient,
      message: "Ingredient found!",
    };

    return NextResponse.json(mutatedData);
  } catch (err) {
    console.error("Error fetching cocktails:", err.message || err);
    return NextResponse.json(
      { error: "Failed to validate ingredient" },
      { status: 500 }
    );
  }
}
