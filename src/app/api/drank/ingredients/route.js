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
