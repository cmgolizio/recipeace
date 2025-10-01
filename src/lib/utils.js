import { doc, setDoc, deleteDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { supabase } from "@/lib/supabaseClient";

/**
 * Check if a recipe is favorited.
 * favorites: array of objects from Firestore snapshot mapping.
 * id: recipe id (string or number)
 */
export function isFavorited(favorites = [], id) {
  if (!favorites || !favorites.length) return false;
  return favorites.some(
    (f) =>
      String(f.favoriteId) === String(id) ||
      String(f.id) === String(id) ||
      String(f.recipeId) === String(id)
  );
}

/**
 * Toggle favorite for a recipe.
 * - Saves the recipe object to collection: users/{uid}/{type}Favorites/{recipeId}
 * - Removes it if already favorited.
 *
 * user: firebase user object
 * favorites: current favorites array from state
 * recipe: recipe object (should include .id)
 * type: 'food' | 'drink'
 */
export async function toggleFavorite(user, favorites = [], recipe = {}, type) {
  if (!user || !user.uid) {
    console.warn("toggleFavorite: no user");
    return;
  }
  if (!recipe || recipe.id === undefined || recipe.id === null) {
    console.warn("toggleFavorite: invalid recipe id", recipe);
    return;
  }

  const recipeId = String(recipe.id);
  const favDocRef = doc(db, "users", user.uid, `${type}Favorites`, recipeId);

  const already = isFavorited(favorites, recipeId);

  try {
    if (already) {
      await deleteDoc(favDocRef);
      console.log(`Removed favorite ${type}:${recipeId}`);
    } else {
      // Save a minimal payload to avoid storing huge objects; include id, title, image, sourceUrl
      const payload = {
        id: recipe.id,
        title: recipe.title || recipe.name || "",
        image: recipe.image || recipe.image_url || "",
        sourceUrl: recipe.sourceUrl || "",
        addedAt: Date.now(),
      };
      await setDoc(favDocRef, payload);
      console.log(`Added favorite ${type}:${recipeId}`);
    }
  } catch (err) {
    console.error("toggleFavorite error:", err);
  }
}

export async function addFavoriteCocktail(userId, cocktailId) {
  // First get cocktail info from Supabase
  const { data: cocktail, error } = await supabase
    .from("cocktails")
    .select("id, name, image_url")
    .eq("id", cocktailId)
    .single();

  if (error) throw error;

  // Save in Firestore
  const favRef = doc(
    db,
    "users",
    userId,
    "drinkFavorites",
    cocktail.id.toString()
  );
  await setDoc(favRef, {
    id: cocktail.id,
    cocktailId: cocktail.id,
    name: cocktail.name,
    image_url: cocktail.image_url,
    createdAt: new Date(),
  });

  return cocktail;
}
