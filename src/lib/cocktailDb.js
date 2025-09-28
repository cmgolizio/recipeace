import axios from "axios";

export async function validateCocktailIngredient(query) {
  if (!query || typeof query !== "string") {
    return { isValid: false, message: "Invalid ingredient input" };
  }

  try {
    const res = await axios.get(
      "/api/cocktailDB/validate-cocktail-ingredient",
      { params: { query: query } }
    );

    const data = res.data;

    return {
      isValid: data.isValid,
      name: data.name || null,
      message: data.message || null,
    };
  } catch (err) {
    console.error("Validation error:", err);
    return { isValid: false, message: "Validation request failed" };
  }
}

export function parseIngredients(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) return;

  const parsedQuery = ingredients
    .map((ingName) => {
      return ingName.replace(" ", "_");
    })
    .join(",");

  console.log("INGREDIENTS: ", ingredients, "RES: ", parsedQuery);
  return parsedQuery;
}
