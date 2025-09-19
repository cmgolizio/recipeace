"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

import { db, auth } from "@/lib/firebase";
import { fetchRecipeSourceUrl, removeFavorite } from "@/lib/utils";

export default function FavoritesPage() {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState([]);

  // Fetch favorites from Firestore
  useEffect(() => {
    if (!user) return;

    const favRef = collection(db, "users", user.uid, "favorites");
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favs);
    });

    return () => unsubscribe();
  }, [user]);

  // Remove a favorite
  // const removeFavorite = async (id) => {
  //   if (!user || !id) return;
  //   await deleteDoc(doc(db, "users", user.uid, "favorites", id));
  // };

  return (
    <div className='min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]'>
      <main className='p-4 max-w-4xl mx-auto'>
        {favorites.length === 0 ? (
          <p className='text-gray-500 dark:text-gray-400'>
            You don’t have any favorite recipes yet.
          </p>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {favorites.map((recipe) => (
              <div
                key={recipe.id}
                className='bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow'
              >
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className='w-full h-40 object-cover rounded'
                  />
                )}
                <h2 className='mt-2 text-lg font-semibold'>{recipe.title}</h2>
                <div className='flex justify-between items-center mt-2'>
                  <button
                    className='text-blue-600 hover:underline mt-2 block hover:cursor-pointer'
                    onClick={() => fetchRecipeSourceUrl(recipe.id)}
                  >
                    View Recipe
                  </button>
                  <button
                    onClick={() => removeFavorite(user, recipe.id)}
                    className='text-red-500 text-sm hover:underline'
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
