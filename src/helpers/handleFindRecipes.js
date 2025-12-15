import axios from "axios";

export async function handleFindRecipes(ingredients, strict) {
  const res = await axios.post("/api/recipes/search", {
    ingredients,
    strict,
  });

  if (!res?.data) {
    console.error("Error fetching recipes:", res.error);
    return null;
  }

  return res.data;
}
