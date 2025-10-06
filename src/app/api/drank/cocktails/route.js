// import { createClient } from "@supabase/supabase-js";
// import { NextResponse } from "next/server";

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// export async function POST(req) {
//   try {
//     const { ingredientIds } = await req.json();
//     console.log("ingredientIds:", ingredientIds);

//     if (!ingredientIds || ingredientIds.length === 0) {
//       return NextResponse.json(
//         { error: "No ingredient IDs provided" },
//         { status: 400 }
//       );
//     }

//     // Query the cocktail_ingredients table
//     const { data: cocktails, error } = await supabase
//       .from("cocktail_ingredients")
//       .select(
//         `
//         cocktail_id,
//         cocktails (
//           id,
//           name,
//           category,
//           glass_type,
//           instructions,
//           tags,
//           image_url
//         )
//       `
//       )
//       .in("ingredient_id", ingredientIds);

//     if (error) {
//       console.error("Supabase error:", error);
//       return NextResponse.json(
//         { error: "Database query failed" },
//         { status: 500 }
//       );
//     }

//     if (!cocktails || cocktails.length === 0) {
//       return NextResponse.json(
//         { error: "No cocktails found" },
//         { status: 404 }
//       );
//     }

//     // Deduplicate cocktails (a cocktail can appear multiple times)
//     const uniqueCocktails = Object.values(
//       cocktails.reduce((acc, entry) => {
//         const cocktail = entry.cocktails;
//         if (cocktail && !acc[cocktail.id]) acc[cocktail.id] = cocktail;
//         return acc;
//       }, {})
//     );

//     return NextResponse.json(uniqueCocktails.slice(0, 6));
//   } catch (err) {
//     console.error("Error in /api/drank/cocktails:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { ingredientIds } = await req.json();
    if (!ingredientIds || ingredientIds.length === 0) {
      return NextResponse.json(
        { error: "No ingredient IDs provided" },
        { status: 400 }
      );
    }

    // Query cocktails that use at least one of the given ingredients
    const { data: cocktails, error } = await supabase
      .from("cocktail_ingredients")
      .select(
        "cocktail_id, cocktails!inner(id, name, category, instructions, image_url)"
      )
      .in("ingredient_id", ingredientIds);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!cocktails || cocktails.length === 0) {
      return NextResponse.json(
        { error: "No cocktails found" },
        { status: 404 }
      );
    }

    // Deduplicate cocktail results
    const uniqueCocktails = Object.values(
      cocktails.reduce((acc, row) => {
        const c = row.cocktails;
        acc[c.id] = c;
        return acc;
      }, {})
    );

    // Limit to 6 recipes
    return NextResponse.json(uniqueCocktails.slice(0, 6));
  } catch (err) {
    console.error("Error in /api/drank/cocktails:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
