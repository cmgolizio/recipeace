import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Check if a recipe is favorited.
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
        image: recipe.image || recipe.thumbnail || "",
        sourceUrl: recipe.sourceUrl || recipe.url || "",
        addedAt: Date.now(),
      };
      await setDoc(favDocRef, payload);
      console.log(`Added favorite ${type}:${recipeId}`);
    }
  } catch (err) {
    console.error("toggleFavorite error:", err);
  }
}
