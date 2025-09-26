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

export default function FoodPage() {
  const [user] = useAuthState(auth);
  const [ingredientList, setIngredientList] = useState([]);

  // Ensure user doc exists before adding ingredient
  const ensureUserDoc = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, {});
    }
  };

  // Add an ingredient (flattened path: users/{uid}/foodIngredients)
  const addIngredient = async (itemName) => {
    if (!user || !itemName) return;

    try {
      await ensureUserDoc(user.uid);

      const ingredientsRef = collection(
        db,
        "users",
        user.uid,
        "foodIngredients"
      );
      await addDoc(ingredientsRef, { name: itemName });
      console.log("Added ingredient:", itemName);
    } catch (err) {
      console.error("Error adding ingredient:", err);
    }
  };

  // Remove a pantry item by Firestore doc id
  const removeIngredient = async (id) => {
    if (!user || !id) return;

    try {
      const docRef = doc(db, "users", user.uid, "foodIngredients", id);
      await deleteDoc(docRef);
      console.log("Removed ingredient:", id);
    } catch (err) {
      console.error("Error removing ingredient:", err);
    }
  };

  // Listen to ingredient changes
  useEffect(() => {
    if (!user?.uid) return;

    const ingredientsRef = collection(db, "users", user.uid, "foodIngredients");
    const unsubscribe = onSnapshot(ingredientsRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setIngredientList(items);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className='min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]'>
      <main className='p-4 max-w-3xl mx-auto'>
        <h2 className='text-lg font-semibold mb-2'>Your Pantry</h2>

        <IngredientInput onAdd={addIngredient} type='food' />
        <IngredientList
          ingredientList={ingredientList}
          removeIngredient={removeIngredient}
        />

        {ingredientList.length === 0 && (
          <p className='mt-2 text-gray-500 dark:text-gray-400 text-sm'>
            Your pantry is empty. Add some ingredients above!
          </p>
        )}

        <RecipeList
          ingredientList={ingredientList.map((item) => item.name)}
          type='food'
        />
      </main>
    </div>
  );
}
