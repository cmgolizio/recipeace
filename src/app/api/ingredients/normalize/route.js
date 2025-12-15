import { NextResponse } from "next/server";
import { normalizeIngredients } from "@/lib/llm";
import { normalizedIngredientResponseSchema } from "@/lib/ingredientSchema";

export async function POST(req) {
  try {
    const { input } = await req.json();

    if (!input || !String(input).trim()) {
      return NextResponse.json(
        { error: "Missing ingredient input" },
        { status: 400 }
      );
    }

    const normalized = await normalizeIngredients(input);
    const validated = normalizedIngredientResponseSchema.parse(normalized);

    return NextResponse.json(validated, { status: 200 });
  } catch (error) {
    console.error("normalize ingredients error", error);
    return NextResponse.json(
      { error: "Failed to normalize ingredients" },
      { status: 500 }
    );
  }
}
