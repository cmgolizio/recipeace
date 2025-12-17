import { NextResponse } from "next/server";
import { normalizedIngredientResponseSchema } from "../../../../lib/ingredientSchema";
import { normalizeIngredients } from "../../../../lib/llm";

function slugifyId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "")
    .trim();
}

export async function POST(req) {
  try {
    console.log("NORMALIZE HIT");

    const body = await req.json();
    const { input } = body ?? {};

    if (!input || !String(input).trim()) {
      return NextResponse.json(
        { error: "Missing ingredient input" },
        { status: 400 }
      );
    }

    const rawInput = String(input).trim();

    let normalized = [];

    try {
      const llmResult = await normalizeIngredients(rawInput);
      const parsed = normalizedIngredientResponseSchema.safeParse(llmResult);

      if (parsed.success) {
        normalized = parsed.data.normalizedIngredients;
      }
    } catch (err) {
      console.warn("LLM normalization failed, falling back:", err);
    }

    if (!normalized.length) {
      normalized = [
        {
          canonicalId: slugifyId(rawInput),
          canonicalName: rawInput,
          category: "other",
          rawInput,
        },
      ];
    }

    return NextResponse.json({
      normalizedIngredients: normalized,
    });
  } catch (err) {
    console.error("normalize ingredients error", err);

    // NEVER 500 the UX for normalization
    return NextResponse.json(
      {
        normalizedIngredients: [],
        error: "Normalization failed",
      },
      { status: 200 }
    );
  }
}
