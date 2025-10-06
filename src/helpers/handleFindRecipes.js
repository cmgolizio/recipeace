import axios from "axios";

export async function handleFindRecipes(foodIngredients, strict) {
  let res = await axios.get("/api/spoonacular/recipes", {
    params: { ingredients: foodIngredients.join(","), strict },
  });

  if (!res?.data || res.data.length === 0) {
    console.error("Error fetching recipes:", res.error);
    return null;
  }

  return res.data;
}
