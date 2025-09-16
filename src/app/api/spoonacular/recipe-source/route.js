import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recipeId = searchParams.get("recipe-id"); // comma-separated

  if (!recipeId) {
    return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });
  }

  const options = {
    method: "GET",
    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`,
    headers: {
      "x-rapidapi-key": "44f52865abmsh32125aabc042ff8p1673f1jsne72bd855049f",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return NextResponse.json({ sourceUrl: response.data.sourceUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch recipe source URL" },
      { status: 500 }
    );
  }
}
