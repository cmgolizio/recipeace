// import { NextResponse } from "next/server";
// import axios from "axios";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get("query");

//   if (!query) {
//     return NextResponse.json(
//       { error: "Missing query parameter" },
//       { status: 400 }
//     );
//   }

//   const options = {
//     method: "GET",
//     url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete",
//     params: {
//       query: query,
//       number: "3",
//     },
//     headers: {
//       "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
//       "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
//     },
//   };

//   try {
//     const res = await axios.request(options);

//     // Check response structure
//     console.log("Spoonacular autocomplete response:", res.data);

//     return NextResponse.json(res.data, { status: 200 });
//   } catch (err) {
//     console.error(
//       "Spoonacular Autocomplete API error:",
//       err.response?.data || err.message
//     );
//     return NextResponse.json(
//       { error: "Failed to fetch ingredient suggestions" },
//       { status: 500 }
//     );
//   }
// }
