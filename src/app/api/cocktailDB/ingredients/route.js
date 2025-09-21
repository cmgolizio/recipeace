import axios from "axios";
import { NextResponse } from "next/server";

// const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

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
