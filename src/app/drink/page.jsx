"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
// import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TfiLayoutGrid3 } from "react-icons/tfi";
import { PiListBold } from "react-icons/pi";

import IngredientInput from "@/components/IngredientInput";
import IngredientGrid from "@/components/IngredientGrid";
import IngredientList from "@/components/IngredientList";
import { db, auth } from "@/lib/firebase";
import RecipeList from "@/components/RecipeList";

export default function DrinkPage() {
  const [user, loading] = useAuthState(auth);
  const [drinkIngredients, setDrinkIngredients] = useState([]);
  const [ingredientViewType, setIngredientViewType] = useState("list");
  // const router = useRouter();

  // // Redirect if not logged in
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/login");
  //   }
  // }, [user, loading, router]);

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
      image_url: ingredient.image_url || null,
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

  // useEffect(() => {
  //   console.log(
  //     "Current drink ingredients (from '/drink/page.jsx'):",
  //     drinkIngredients
  //   );
  // }, [drinkIngredients]);

  // const handleToggleIngredientDisplay = (e) => {
  //   e.preventDefault();

  //   setIngredientViewType((prev) => (prev === "list" ? "grid" : "list"));
  // };

  /** On mount, check for stored ingredient view */
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

  return (
    <div className='min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]'>
      <main className='p-4 max-w-3xl mx-auto'>
        <h2 className='text-lg font-semibold mb-2'>Your Bar Well</h2>

        <div className='flex flex-row justify-start gap-4 items-center'>
          <IngredientInput onAdd={addIngredient} type='drink' />

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
            ingredientList={drinkIngredients}
            removeIngredient={removeIngredient}
          />
        ) : (
          <IngredientGrid
            ingredientList={drinkIngredients}
            removeIngredient={removeIngredient}
          />
        )}

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
