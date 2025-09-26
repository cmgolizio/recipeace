"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot } from "firebase/firestore";

import { db, auth } from "@/lib/firebase";
import RecipeCard from "@/components/RecipeCard";

export default function FavoritesPage() {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;

    const favRef = collection(db, "users", user.uid, "drinkFavorites");
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        favoriteId: doc.id,
        ...doc.data(),
      }));
      setFavorites(favs);
    });

    return () => unsubscribe();
  }, [user]);

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
              <RecipeCard
                key={String(recipe.favoriteId || recipe.id)}
                recipe={recipe}
                user={user}
                favorites={favorites}
                type='drink'
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
