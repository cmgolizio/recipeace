"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, onSnapshot } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import RecipeCard from "./RecipeCard";

export default function RecipeList({ ingredientList, type = "food" }) {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [strict, setStrict] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch recipes
  const fetchRecipes = async () => {
    if (ingredientList.length === 0) {
      setError(`Your ${type} ingredients are empty. Add some items first!`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let res;
      if (type === "food") {
        res = await axios.get("/api/spoonacular/recipes", {
          params: { ingredients: ingredientList.join(","), strict },
        });
      } else if (type === "drink") {
        res = await axios.get("/api/cocktailsDB/recipes", {
          params: { ingredients: ingredientList.join(",") },
        });
      }

      if (!res.data || res.data.length === 0) {
        setError(`No ${type} recipes found with these ingredients.`);
      }
      setRecipes(res.data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(
        "Something went wrong while fetching recipes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites from Firestore
  useEffect(() => {
    if (!user?.uid) return;

    const favoritesRef = collection(
      db,
      "users",
      user.uid,
      type,
      "favorites",
      "list"
    );

    const q = query(favoritesRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        favoriteId: doc.id, // Firestore doc ID
        ...doc.data(),
      }));
      // setFavorites(favs);
      setFavorites(
        favs.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i)
      );
    });

    return () => unsubscribe();
  }, [user, type]);

  return (
    <div className='w-full h-full mt-6'>
      <div className='flex items-center gap-3'>
        <button
          onClick={fetchRecipes}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50'
          disabled={loading || ingredientList.length === 0}
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

      {loading && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 animate-pulse'>
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className='p-4 border rounded-lg shadow bg-gray-100 h-56'
            >
              <div className='w-full h-32 bg-gray-300 rounded-md'></div>
              <div className='h-4 bg-gray-300 rounded mt-3 w-3/4'></div>
              <div className='h-3 bg-gray-300 rounded mt-2 w-1/2'></div>
            </div>
          ))}
        </div>
      )}

      {!loading && recipes.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
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
