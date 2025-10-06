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
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import IngredientInput from "@/components/IngredientInput";
import IngredientList from "@/components/IngredientList";
import { db, auth } from "@/lib/firebase";
import RecipeList from "@/components/RecipeList";

export default function DrinkPage() {
  // const [user] = useAuthState(auth);
  // const auth = getAuth();
  // const user = auth.currentUser;
  const [user, loading, error] = useAuthState(auth);
  const [drinkIngredients, setDrinkIngredients] = useState([]);

  // Ensure user doc exists before adding anything
  const ensureUserDoc = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) await setDoc(userDocRef, {});
  };

  // Add a drink ingredient (path: users/{uid}/drinkIngredients)
  const addIngredient = async (ingredient) => {
    if (!user) {
      console.error("User not logged in yet");
      return;
    }

    if (!ingredient?.name) {
      console.error("Invalid ingredient:", ingredient);
      return;
    }

    await ensureUserDoc(user.uid);

    const docRef = doc(collection(db, "users", user.uid, "drinkIngredients"));
    await setDoc(docRef, {
      supabaseId: ingredient.id,
      name: ingredient.name,
      type: ingredient.type,
      subcategory: ingredient.subcategory,
      abv: ingredient.abv,
      notes: ingredient.notes,
      addedAt: serverTimestamp(),
    });

    console.log("✅ Added ingredient:", ingredient.name);
  };

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
        ...doc.data(),
      }));
      setDrinkIngredients(items);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    console.log(
      "Current drink ingredients (from '/drink/page.jsx'):",
      drinkIngredients
    );
  }, [drinkIngredients]);

  return (
    <div className='min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]'>
      <main className='p-4 max-w-3xl mx-auto'>
        <h2 className='text-lg font-semibold mb-2'>Your Bar Well</h2>

        <IngredientInput onAdd={addIngredient} type='drink' />
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
          // ingredientList={drinkIngredients.map((i) => i.name)}
          ingredientList={drinkIngredients}
          type='drink'
        />
      </main>
    </div>
  );
}
