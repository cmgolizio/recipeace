import axios from "axios";

export async function handleFindCocktails(drinkIngredients) {
  // const ingredientIds = drinkIngredients.map((i) => i.supabaseId);
  console.log("drinkIngredients before mapping:", drinkIngredients);
  const ingredientIds = drinkIngredients
    .map((i) => i.supabaseId)
    .filter(Boolean);
  console.log("ingredientIds sent to API:", ingredientIds);

  let res = await axios.post("/api/drank/cocktails", { ingredientIds });

  if (!res?.data || res.data.length === 0) {
    console.error("Error fetching cocktails:", res.error);
    return null;
  }

  return res.data;

  // const res = await fetch("/api/drank/cocktails", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ ingredientIds }),
  // });

  // const data = await res.json();
  // if (!res.ok) {
  //   console.error("Error fetching recipes:", data.error);
  //   return null;
  // }

  // console.log("Found recipes:", data.recipes);
  // // setRecipes(data.recipes); // <-- update your UI state here
  // return data.recipes;
}
