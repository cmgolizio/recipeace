import { doc, collection, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "./firebase";

export async function addDrinkIngredient(userId, ingredient) {
  if (!userId || !ingredient?.name) return;

  const docRef = doc(collection(db, "users", userId, "drinkIngredients"));
  await setDoc(docRef, {
    supabaseId: ingredient.id,
    name: ingredient.name,
    type: ingredient.type,
    subcategory: ingredient.subcategory,
    abv: ingredient.abv,
    notes: ingredient.notes,
    addedAt: serverTimestamp(),
  });
}
