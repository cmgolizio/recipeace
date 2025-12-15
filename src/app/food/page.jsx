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
import { motion, AnimatePresence } from "framer-motion";
import { TfiLayoutGrid3 } from "react-icons/tfi";
import { PiListBold } from "react-icons/pi";

import IngredientInput from "@/components/IngredientInput";
import IngredientGrid from "@/components/IngredientGrid";
import IngredientList from "@/components/IngredientList";
import { db, auth } from "@/lib/firebase";
import RecipeList from "@/components/RecipeList";
// import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function FoodPage() {
  const [user] = useAuthState(auth);
  const [ingredientList, setIngredientList] = useState([]);
  const [ingredientViewType, setIngredientViewType] = useState("list");

  // Ensure user doc exists before adding ingredient
  const ensureUserDoc = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, {});
    }
  };

  // // Add an ingredient (flattened path: users/{uid}/foodIngredients)
  const addIngredient = async (normalizedIngredient) => {
    if (!user || !normalizedIngredient) return;

    try {
      await ensureUserDoc(user.uid);

      const ingredientsRef = collection(
        db,
        "users",
        user.uid,
        "foodIngredients"
      );
      await addDoc(ingredientsRef, {
        canonicalId: normalizedIngredient.canonicalId,
        canonicalName: normalizedIngredient.canonicalName,
        rawInput: normalizedIngredient.rawInput,
      });
      console.log("Added ingredient:", normalizedIngredient.canonicalName);
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

  useEffect(() => {
    const storedIngredientView = localStorage.getItem("ingredientView");
    if (storedIngredientView) {
      setIngredientViewType(storedIngredientView);
      document.documentElement.setAttribute(
        "data-ing-view",
        storedIngredientView
      );
    } else {
      setIngredientViewType("list");
      document.documentElement.setAttribute("data-ing-view", "list");
    }
  }, []);

  const toggleIngredientView = (e) => {
    e.preventDefault();

    const newView = ingredientViewType === "list" ? "grid" : "list";
    setIngredientViewType(newView);
    document.documentElement.setAttribute("data-ing-view", newView);
    localStorage.setItem("ingredientView", newView);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-ing-view", ingredientViewType);
    localStorage.setItem("ingredientView", ingredientViewType);
  }, [ingredientViewType]);

  // Listen to ingredient changes
  useEffect(() => {
    if (!user?.uid) return;

    const ingredientsRef = collection(db, "users", user.uid, "foodIngredients");
    const unsubscribe = onSnapshot(ingredientsRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().canonicalName || doc.data().name,
        canonicalId: doc.data().canonicalId,
        rawInput: doc.data().rawInput,
      }));
      setIngredientList(items);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className='min-h-screen'>
      <main className='p-4 max-w-3xl mx-auto'>
        <h2 className='text-lg font-semibold mb-2'>Your Pantry</h2>
        <div className='flex flex-row justify-start gap-4 items-center'>
          <IngredientInput onAdd={addIngredient} type='food' />
          <button
            className='p-2 rounded-full transition'
            onClick={(e) => toggleIngredientView(e)}
            aria-label='Toggle Ingredient Display'
          >
            <AnimatePresence mode='wait' initial={false}>
              {ingredientViewType === "list" ? (
                <motion.div
                  key='grid'
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TfiLayoutGrid3 className='w-6 h-6' />
                </motion.div>
              ) : (
                <motion.div
                  key='list'
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PiListBold className='w-6 h-6' />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
        {ingredientViewType === "list" ? (
          <IngredientList
            ingredientList={ingredientList}
            removeIngredient={removeIngredient}
          />
        ) : (
          <IngredientGrid
            ingredientList={ingredientList}
            removeIngredient={removeIngredient}
          />
        )}

        {ingredientList.length === 0 && (
          <p className='mt-2 text-gray-500 dark:text-gray-400 text-sm'>
            Your pantry is empty. Add some ingredients above!
          </p>
        )}

        <RecipeList ingredientList={ingredientList} type='food' />
      </main>
    </div>
  );
}
