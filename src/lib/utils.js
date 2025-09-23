import { doc, collection, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export const isFavorited = (favorites, recipeId) => {
  return favorites.some((fav) => fav.id === String(recipeId));
};

export const toggleFavorite = async (
  user,
  favorites,
  recipe,
  type = "food"
) => {
  if (!user?.uid || !recipe?.id) return;

  const recipeId = String(recipe.id);
  const exists = isFavorited(favorites, recipeId);

  try {
    const favsCollectionRef = collection(
      db,
      "users",
      user.uid,
      type,
      "favorites",
      "list"
    );

    if (exists) {
      const docToDelete = favorites.find((f) => f.id === recipeId);
      if (docToDelete) {
        await deleteDoc(
          doc(
            db,
            "users",
            user.uid,
            type,
            "favorites",
            "list",
            docToDelete.favoriteId
          )
        );
        console.log(`Removed ${type} recipe ${recipe.title} from favorites`);
      }
    } else {
      // Add new favorite
      const newDocRef = await addDoc(favsCollectionRef, {
        id: recipeId,
        title: recipe.title,
        image: recipe.image,
        usedIngredientCount: recipe.usedIngredientCount ?? 0,
        missedIngredientCount: recipe.missedIngredientCount ?? 0,
        missedIngredients:
          recipe.missedIngredients.map((ing) => ing.name) ?? [],
        sourceUrl: recipe.sourceUrl,
      });
      console.log(`Added ${type} recipe ${recipe.title} to favorites`);
    }
  } catch (err) {
    console.error(`Error toggling favorite for ${type} recipe:`, err);
  }
};

// /**
//  * (Optional) Open a recipe source URL — keeps old functionality
//  * @param {string|number} recipeId
//  */
export async function fetchRecipeSourceUrl(id) {
  try {
    const res = await axios.get("/api/spoonacular/recipe-source", {
      params: { id: id },
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
