import { doc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { validateIngredient } from "./validateIngredient";

export async function addIngredient(userId, ingredientName) {
  // Step 1: validate against Supabase
  const ingredient = await validateIngredient(ingredientName);
  if (!ingredient) {
    throw new Error(`Ingredient "${ingredientName}" not found in database`);
  }

  // Step 2: save in Firestore
  const ref = doc(
    db,
    "users",
    userId,
    "drinkIngredients",
    ingredient.id.toString()
  );

  await setDoc(ref, {
    id: ingredient.id,
    name: ingredient.name,
    type: ingredient.type,
    subcategory: ingredient.subcategory,
    abv: ingredient.abv,
    addedAt: new Date(),
  });

  return ingredient;
}
