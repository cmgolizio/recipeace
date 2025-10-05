import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { adminAuth } from "@/lib/firebaseAdmin";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { ingredientName, idToken } = await req.json();

    if (!ingredientName || !idToken)
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
      });

    // Verify Firebase ID token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const userId = decoded.uid;

    // Query Supabase "ingredients"
    const { data: ingredient, error } = await supabase
      .from("ingredients")
      .select("*")
      .ilike("name", ingredientName)
      .maybeSingle();

    if (error || !ingredient) {
      return NextResponse.json(
        { error: "Ingredient not found in Supabase" },
        { status: 404 }
      );
    }

    // Send back valid ingredient data
    return NextResponse.json({ ingredient });
  } catch (err) {
    console.error("Error in /api/drank/ingredients:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
// import admin from "firebase-admin";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// // Initialize Supabase client with service role key
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// export async function POST(req) {
//   try {
//     const { ingredientName, idToken } = await req.json();

//     // Verify Firebase ID token
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const userId = decodedToken.uid;

//     if (!ingredientName) {
//       return NextResponse.json(
//         { error: "No ingredient provided" },
//         { status: 400 }
//       );
//     }

//     // Check ingredient in Supabase
//     const { data, error } = await supabase
//       .from("ingredients")
//       .select("*")
//       .ilike("name", ingredientName.trim());

//     if (error) {
//       console.error("Supabase error:", error);
//       return NextResponse.json(
//         { error: "Failed to query database" },
//         { status: 500 }
//       );
//     }

//     if (!data || data.length === 0) {
//       return NextResponse.json(
//         { error: "Ingredient not found in Drank database" },
//         { status: 404 }
//       );
//     }

//     // Found ingredient
//     return NextResponse.json({ ingredient: data[0], userId });
//   } catch (err) {
//     console.error(err);
// return NextResponse.json(
//   { error: "Unauthorized or server error" },
//   { status: 403 }
// );
//   }
// }
