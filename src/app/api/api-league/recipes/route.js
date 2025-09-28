import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ingredients = searchParams.get("ingredients");
  const baseUrl = `https://api.apileague.com/search-drink`;

  if (!ingredients) {
    return NextResponse.json(
      { error: "Ingredients parameter is required" },
      { status: 400 }
    );
  }
  const options = {
    method: "GET",
    url: baseUrl,
    params: {
      ["include-ingredients"]: ingredients,
      number: 1,
    },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_API_LEAGUE_API_KEY,
    },
  };

  try {
    const response = await axios.request(options);

    const data = response.data;

    // const drinks = data.drinks?.map((drink) => ({
    //   id: drink.id,
    //   name: drink.title,
    //   image: drink.images[0],
    // })) || [];

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching cocktails:", err);
    return NextResponse.json(
      { error: "Failed to fetch cocktails" },
      { status: 500 }
    );
  }
}
