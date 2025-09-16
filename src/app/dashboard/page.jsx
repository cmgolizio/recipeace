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

import PantryInput from "@/components/PantryInput";
import { db, auth } from "@/lib/firebase";
import RecipeList from "@/components/RecipeList";
import PantryList from "@/components/PantryList";

export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const [pantry, setPantry] = useState([]);

  // Ensure user doc exists before adding pantry items
  const ensureUserDoc = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, {});
    }
  };

  // Add a pantry item
  const addPantryItem = async (itemName) => {
    if (!user || !itemName) return;

    try {
      await ensureUserDoc(user.uid);

      const pantryRef = collection(db, "users", user.uid, "pantry");
      await addDoc(pantryRef, { name: itemName });
      console.log("Added pantry item:", itemName);
    } catch (err) {
      console.error("Error adding pantry item:", err);
    }
  };

  // Remove a pantry item by Firestore doc id
  const removePantryItem = async (id) => {
    if (!user || !id) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "pantry", id));
      console.log("Removed pantry item:", id);
    } catch (err) {
      console.error("Error removing pantry item:", err);
    }
  };

  // Listen to pantry changes
  useEffect(() => {
    if (!user) return;

    const pantryRef = collection(db, "users", user.uid, "pantry");
    const unsubscribe = onSnapshot(pantryRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setPantry(items);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className='min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]'>
      <main className='p-4 max-w-3xl mx-auto'>
        <h2 className='text-lg font-semibold mb-2'>Your Pantry</h2>

        <PantryInput onAdd={addPantryItem} />
        <PantryList pantry={pantry} removePantryItem={removePantryItem} />

        {pantry.length === 0 && (
          <p className='mt-2 text-gray-500 dark:text-gray-400 text-sm'>
            Your pantry is empty. Add some ingredients above!
          </p>
        )}

        <RecipeList pantry={pantry.map((item) => item.name)} />
      </main>
    </div>
  );
}
