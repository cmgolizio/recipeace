import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });
  }

  const options = {
    method: "GET",
    url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  try {
    const res = await axios.request(options);
    return NextResponse.json(res.data);
  } catch (err) {
    console.error("Error fetching recipe detail:", err.response?.data || err);
    return NextResponse.json(
      { error: "Failed to fetch recipe detail" },
      { status: 500 }
    );
  }
}
