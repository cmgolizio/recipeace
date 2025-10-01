"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { supabase } from "@/lib/supabaseClient";
import RecipeCard from "./RecipeCard";
import LoadingSkeleton from "./LoadingSkeleton";

export default function RecipeList({ ingredientList, type }) {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [strict, setStrict] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch cocktails containing *at least one* ingredient
  const searchCocktailsByIngredient = async () => {
    if (ingredientList.length === 0) return [];

    if (type !== "drink") return;

    // First: resolve ingredient IDs
    const { data: ingredients, error: ingErr } = await supabase
      .from("ingredients")
      .select("id, name")
      .in("name", ingredientList);

    if (ingErr) throw ingErr;
    if (!ingredients.length) return [];

    const ingredientIds = ingredients.map((i) => i.id);

    // Find cocktails that use any of these ingredients
    const { data: cocktails, error: cocktailErr } = await supabase
      .from("cocktail_ingredients")
      .select("cocktail_id, cocktails(name, image_url, category)")
      .in("ingredient_id", ingredientIds);

    if (cocktailErr) throw cocktailErr;

    // Deduplicate cocktail results
    const unique = {};
    cocktails.forEach((c) => {
      unique[c.cocktails.id] = c.cocktails;
    });

    return Object.values(unique);
  };

  const fetchFoodRecipes = async () => {
    if (!ingredientList || ingredientList.length === 0) {
      setError(`Your ${type} ingredients are empty. Add some items first!`);
      return;
    }

    if (type !== "food") return;

    setLoading(true);
    setError(null);

    try {
      let res;
      res = await axios.get("/api/spoonacular/recipes", {
        params: { ingredients: ingredientList.join(","), strict },
      });

      if (!res?.data || res.data.length === 0) {
        setRecipes([]);
        setError(`No ${type} recipes found with these ingredients.`);
      } else {
        setRecipes(res.data);
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

  const handleRecipeSearch = async (e) => {
    e.preventDefault();

    if (type === "food") {
      const getRecipes = await fetchFoodRecipes();
      return getRecipes;
    } else if (type === "drink") {
      const getRecipes = await searchCocktailsByIngredient();
      return getRecipes;
    } else {
      return;
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
          onClick={(e) => handleRecipeSearch(e)}
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

      {loading && <LoadingSkeleton type={"recipe"} />}

      {!loading && recipes && recipes.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
          {recipes.map((recipe) => (
            <RecipeCard
              key={`${type}-${recipe.id}`}
              recipe={recipe}
              user={user}
              favorites={favorites}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
}
