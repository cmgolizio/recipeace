"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import RecipeCard from "./RecipeCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { handleFindCocktails } from "@/helpers/handleFindCocktails";
import { handleFindRecipes } from "@/helpers/handleFindRecipes";

export default function RecipeList({ ingredientList, type }) {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nearMatches, setNearMatches] = useState([]);
  const [normalizedIngredients, setNormalizedIngredients] = useState([]);
  const [strict, setStrict] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch recipes
  const fetchRecipes = async () => {
    if (!ingredientList || ingredientList.length === 0) {
      setError(`Your ${type} ingredients are empty. Add some items first!`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (type === "food") {
        const response = await handleFindRecipes(ingredientList, strict);
        if (response !== null) {
          setRecipes(response.recipes || []);
          setNearMatches(response.nearMatches || []);
          setNormalizedIngredients(response.normalizedIngredients || []);
        } else {
          setRecipes([]);
        }
      } else if (type === "drink") {
        const cocktails = await handleFindCocktails(ingredientList);
        cocktails !== null ? setRecipes(cocktails) : setRecipes([]);
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while fetching recipes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites from Firestore (flattened collection: {type}Favorites)
  useEffect(() => {
    if (!user?.uid) return;

    const favoritesRef = collection(db, "users", user.uid, `${type}Favorites`);
    const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
      const favs = snapshot.docs.map((d) => ({
        favId: d.id, // doc id is recipe id
        ...d.data(),
      }));
      setFavorites(favs);
    });

    return () => unsubscribe();
  }, [user, type]);

  return (
    <div className='w-full h-full mt-6'>
      <div className='flex items-center gap-3'>
        <button
          onClick={fetchRecipes}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50'
          disabled={loading || !ingredientList || ingredientList.length === 0}
        >
          {loading
            ? "Loading..."
            : `Find ${type === "food" ? "Recipes" : "Cocktails"}`}
        </button>

        {type === "food" && (
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={strict}
              onChange={(e) => setStrict(e.target.checked)}
            />
            Strict mode (only pantry items)
          </label>
        )}
      </div>

      {error && (
        <p className='mt-4 text-red-500 text-sm font-medium'>{error}</p>
      )}

      {!loading && normalizedIngredients.length > 0 && type === "food" && (
        <div className='mt-4 text-sm text-gray-600 dark:text-gray-300'>
          <p className='font-semibold'>Normalized pantry</p>
          <div className='flex flex-wrap gap-2 mt-1'>
            {normalizedIngredients.map((ing) => (
              <span
                key={ing.canonicalId}
                className='px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full'
              >
                {ing.canonicalName}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading && <LoadingSkeleton type={"recipe"} />}

      {!loading && recipes && recipes.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
          {recipes.map((recipe) => (
            <RecipeCard
              key={`${type}-${recipe.id}`}
              recipe={recipe}
              user={user}
              favorites={favorites}
              ingredientList={ingredientList}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
}
