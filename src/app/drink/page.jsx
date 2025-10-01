"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import IngredientInput from "@/components/IngredientInput";
import IngredientList from "@/components/IngredientList";
import { db, auth } from "@/lib/firebase";
import RecipeList from "@/components/RecipeList";
// import LoadingSkeleton from "@/components/LoadingSkeleton";
import { addIngredient } from "@/services/drink-ingredients/addIngredient";

export default function DrinkPage() {
  const [user] = useAuthState(auth);
  const [drinkIngredients, setDrinkIngredients] = useState([]);

  // Ensure user doc exists before adding anything
  const ensureUserDoc = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) await setDoc(userDocRef, {});
  };

  async function handleAddIngredient(e) {
    e.preventDefault();
    setError("");

    try {
      await ensureUserDoc(user.uid);

      const ingredient = await addIngredient(user.uid, input);
      // setDrinkIngredients((prev) => [...prev, ingredient]);

      console.log("Added:", ingredient);
      setInput(""); // clear input
    } catch (err) {
      setError(err.message);
    }
  }

  // Remove an ingredient
  const removeIngredient = async (id) => {
    if (!user || !id) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "drinkIngredients", id));
      console.log("Removed drink ingredient:", id);
    } catch (err) {
      console.error("Error removing drink ingredient:", err);
    }
  };

  // Live sync ingredients
  useEffect(() => {
    if (!user) return;

    const ingRef = collection(db, "users", user.uid, "drinkIngredients");

    const unsubscribe = onSnapshot(ingRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setDrinkIngredients(items);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className='min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]'>
      <main className='p-4 max-w-3xl mx-auto'>
        <h2 className='text-lg font-semibold mb-2'>Your Bar Well</h2>

        <IngredientInput onAdd={handleAddIngredient} type='drink' />
        <IngredientList
          ingredientList={drinkIngredients}
          removeIngredient={removeIngredient}
        />

        {drinkIngredients.length === 0 && (
          <p className='mt-2 text-gray-500 dark:text-gray-400 text-sm'>
            Your bar is empty. Add some mixers and spirits above!
          </p>
        )}
        <RecipeList
          ingredientList={drinkIngredients.map((i) => i.name)}
          type='drink'
        />
      </main>
    </div>
  );
}
