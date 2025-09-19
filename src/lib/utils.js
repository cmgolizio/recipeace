import axios from "axios";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";

import { db } from "./firebase";

export async function fetchRecipeSourceUrl(recipeId) {
  try {
    const res = await axios.get("/api/spoonacular/recipe-source", {
      params: { "recipe-id": recipeId },
    });
    if (res.data && res.data.sourceUrl) {
      window.open(res.data.sourceUrl, "_blank");
      console.log("Recipe source URL:", res.data.sourceUrl);
    } else {
      console.error("No source URL found in response:", res.data);
      return null;
    }
  } catch (err) {
    console.error("Error fetching recipe source URL:", err);
    return null;
  }
}

export function isFavorited(favorites, recipeId) {
  if (!Array.isArray(favorites)) return false;

  return favorites.some((fav) => fav.recipeId === recipeId);
}

export async function toggleFavorite(user, favorites, recipe) {
  if (!user) return;

  const favoritesRef = collection(db, "users", user.uid, "favorites");

  if (isFavorited(favorites, recipe.id)) {
    // Remove favorite
    const favDoc = favorites.find((fav) => fav.recipeId === recipe.id);
    await deleteDoc(doc(db, "users", user.uid, "favorites", favDoc.id));
  } else {
    // Add favorite
    await addDoc(favoritesRef, {
      recipeId: recipe.id,
      title: recipe.title,
      image: recipe.image,
    });
  }
}

export async function removeFavorite(user, recipeId) {
  if (!user || !recipeId) return;
  await deleteDoc(doc(db, "users", user.uid, "favorites", recipeId));
}
