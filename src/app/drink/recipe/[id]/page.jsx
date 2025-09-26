"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ImHeart } from "react-icons/im";
import { SlHeart } from "react-icons/sl";

import { db, auth } from "@/lib/firebase";

export default function DrinkRecipeDetailPage() {
  const { id } = useParams();
  const [user] = useAuthState(auth);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favDocId, setFavDocId] = useState(null);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`/api/cocktailDB/recipe/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Check if this recipe is already a favorite
  useEffect(() => {
    if (!user || !id) return;

    const checkFavorite = async () => {
      const favRef = collection(db, "users", user.uid, "drinkFavorites");
      const q = query(favRef, where("recipeId", "==", id));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setIsFavorite(true);
        setFavDocId(snapshot.docs[0].id);
      } else {
        setIsFavorite(false);
        setFavDocId(null);
      }
    };

    checkFavorite();
  }, [user, id]);

  const addFavorite = async () => {
    if (!user) return alert("Sign in to save favorites.");
    try {
      const favRef = collection(db, "users", user.uid, "drinkFavorites");
      const docRef = await addDoc(favRef, {
        recipeId: id,
        title: recipe.title,
        image: recipe.image,
      });
      setIsFavorite(true);
      setFavDocId(docRef.id);
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  const removeFavorite = async () => {
    if (!user || !favDocId) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "drinkFavorites", favDocId));
      setIsFavorite(false);
      setFavDocId(null);
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  if (loading) {
    return <p className='p-4'>Loading recipe...</p>;
  }

  if (!recipe) {
    return <p className='p-4'>Recipe not found.</p>;
  }

  return (
    <div className='min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]'>
      <main className='p-4 max-w-3xl mx-auto space-y-6'>
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className='w-full h-64 object-cover rounded-lg'
          />
        )}
        <h1 className='text-3xl font-bold'>{recipe.title}</h1>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>Ingredients</h2>
          {isFavorite ? (
            <button
              onClick={removeFavorite}
              className='text-red-500 hover:underline text-sm'
            >
              <ImHeart />
            </button>
          ) : (
            <button
              onClick={addFavorite}
              className='text-blue-500 hover:underline text-sm'
            >
              <SlHeart />
            </button>
          )}
        </div>

        <ul className='list-disc pl-6 space-y-1'>
          {recipe.extendedIngredients?.map((ing, i) => (
            <li key={i}>{ing.original}</li>
          ))}
        </ul>

        <div>
          <h2 className='text-lg font-semibold mb-2'>Instructions</h2>
          {recipe.instructions ? (
            <div
              className='prose dark:prose-invert max-w-none'
              dangerouslySetInnerHTML={{ __html: recipe.instructions }}
            />
          ) : (
            <p>No instructions available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
