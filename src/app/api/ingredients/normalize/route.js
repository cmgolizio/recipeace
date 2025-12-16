import { NextResponse } from "next/server";
import {
  normalizedIngredientResponseSchema,
  resolveCanonicalId,
  ensureCanonicalIngredient,
} from "../../../../lib/ingredientSchema";

import { normalizeIngredients } from "../../../../lib/llm";

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

    // ----------------------------------
    // 1. BEST-EFFORT NORMALIZATION (LLM)
    // ----------------------------------
    let normalizedNames = [];

    try {
      const llmResult = await normalizeIngredients(rawInput);

      const parsed = normalizedIngredientResponseSchema.safeParse(llmResult);

      if (parsed.success && parsed.data.normalizedIngredients.length) {
        normalizedNames = parsed.data.normalizedIngredients;
      } else {
        console.warn(
          "LLM returned invalid or empty normalization, falling back"
        );
      }
    } catch (err) {
      console.warn("LLM normalization failed, falling back:", err);
    }

    // Fallback: use raw input
    if (!normalizedNames.length) {
      normalizedNames = [rawInput];
    }

    // ----------------------------------
    // 2. CANONICAL RESOLUTION (LOCAL)
    // ----------------------------------
    const resolved = normalizedNames
      .map((name) => {
        const canonicalId = resolveCanonicalId(name);
        if (!canonicalId) return null;

        const canonical = ensureCanonicalIngredient(canonicalId);
        if (!canonical) return null;

        return {
          canonicalId: canonical.id,
          canonicalName: canonical.name,
          rawInput: name,
        };
      })
      .filter(Boolean);

    // Final fallback if nothing resolved
    if (!resolved.length) {
      const fallbackId = resolveCanonicalId(rawInput);
      if (fallbackId) {
        const canonical = ensureCanonicalIngredient(fallbackId);
        if (canonical) {
          resolved.push({
            canonicalId: canonical.id,
            canonicalName: canonical.name,
            rawInput,
          });
        }
      }
    }

    // ----------------------------------
    // 3. GUARANTEED SAFE RESPONSE
    // ----------------------------------
    return NextResponse.json({
      normalizedIngredients: resolved,
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
