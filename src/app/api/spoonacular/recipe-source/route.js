// import { NextResponse } from "next/server";
// import axios from "axios";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const recipeId = searchParams.get("recipe-id");

//   if (!recipeId) {
//     return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });
//   }

//   const options = {
//     method: "GET",
//     url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`,
//     headers: {
//       "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
//       "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     console.log(response.data);
//     return NextResponse.json({ sourceUrl: response.data.sourceUrl });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to fetch recipe source URL" },
//       { status: 500 }
//     );
//   }
// }
