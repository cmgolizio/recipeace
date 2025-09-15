// // "use client";

// // import { useState, useEffect } from "react";
// // import { auth, db } from "@/lib/firebase";
// // import {
// //   collection,
// //   addDoc,
// //   onSnapshot,
// //   deleteDoc,
// //   doc,
// // } from "firebase/firestore";
// // import PantryInput from "@/components/PantryInput";
// // import RecipeCard from "@/components/RecipeCard";
// // import axios from "axios";

// // export default function DashboardPage() {
// //   const [user, setUser] = useState(null);
// //   const [pantry, setPantry] = useState([]);
// //   const [recipes, setRecipes] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [onlyThese, setOnlyThese] = useState(false);

// //   // Track current user
// //   useEffect(() => {
// //     const unsubscribe = auth.onAuthStateChanged((u) => {
// //       if (u) {
// //         setUser(u);
// //         subscribeToPantry(u.uid);
// //       } else {
// //         setUser(null);
// //         setPantry([]);
// //       }
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   // Subscribe to pantry in Firestore
// //   const subscribeToPantry = (uid) => {
// //     const pantryRef = collection(db, "users", uid, "pantry");
// //     return onSnapshot(pantryRef, (snapshot) => {
// //       const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setPantry(items);
// //     });
// //   };

// //   // Add pantry item
// //   const addPantryItem = async (ingredient) => {
// //     if (!user) return;
// //     try {
// //       const pantryRef = collection(db, "users", user.uid, "pantry");
// //       await addDoc(pantryRef, {
// //         spoonacularId: ingredient.id,
// //         name: ingredient.name,
// //         image: ingredient.image,
// //         addedAt: new Date().toISOString(),
// //       });
// //     } catch (err) {
// //       console.error("Error adding pantry item:", err);
// //     }
// //   };

// //   // Remove pantry item
// //   const removePantryItem = async (itemId) => {
// //     if (!user) return;
// //     try {
// //       const docRef = doc(db, "users", user.uid, "pantry", itemId);
// //       await deleteDoc(docRef);
// //     } catch (err) {
// //       console.error("Error removing pantry item:", err);
// //     }
// //   };

// //   // Fetch recipes from API
// //   const fetchRecipes = async () => {
// //     if (pantry.length === 0) return;
// //     setLoading(true);
// //     setRecipes([]);

// //     try {
// //       const res = await axios.post("/api/spoonacular/recipes", {
// //         ingredients: pantry.map((item) => item.name),
// //         onlyThese,
// //       });
// //       setRecipes(res.data);
// //     } catch (err) {
// //       console.error("Error fetching recipes:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className='p-6 max-w-5xl mx-auto'>
// //       <h1 className='text-2xl font-bold mb-4'>My Pantry</h1>

// //       {/* Add Ingredient */}
// //       <PantryInput onAdd={addPantryItem} />

// //       {/* Pantry List */}
// //       <ul className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4'>
// //         {pantry.map((item) => (
// //           <li
// //             key={item.id}
// //             className='flex flex-col items-center border rounded-lg p-2 relative'
// //           >
// //             <img
// //               src={`https://spoonacular.com/cdn/ingredients_100x100/${item.image}`}
// //               alt={item.name}
// //               className='w-16 h-16 object-contain'
// //             />
// //             <span className='capitalize'>{item.name}</span>
// //             <button
// //               onClick={() => removePantryItem(item.id)}
// //               className='absolute top-1 right-1 text-red-500 hover:text-red-700'
// //             >
// //               ✕
// //             </button>
// //           </li>
// //         ))}
// //       </ul>

// //       {/* Recipe Fetch Controls */}
// //       <div className='mt-6 flex items-center gap-4'>
// //         <button
// //           onClick={fetchRecipes}
// //           className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
// //         >
// //           Find Recipes
// //         </button>

// //         <label className='flex items-center gap-2'>
// //           <input
// //             type='checkbox'
// //             checked={onlyThese}
// //             onChange={(e) => setOnlyThese(e.target.checked)}
// //           />
// //           Only use my pantry items
// //         </label>
// //       </div>

// //       {/* Recipes */}
// //       <div className='mt-8'>
// //         {loading && <p>Loading recipes...</p>}
// //         {recipes.length > 0 && (
// //           <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
// //             {recipes.map((recipe) => (
// //               <RecipeCard key={recipe.id} recipe={recipe} />
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import { db } from "@/lib/firebase";
// import {
//   collection,
//   query,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "@/lib/firebase";
// import PantryInput from "@/components/PantryInput";
// import axios from "axios";

// export default function DashboardPage() {
//   const [user] = useAuthState(auth);
//   const [pantry, setPantry] = useState([]);
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Load pantry items in real-time
//   useEffect(() => {
//     if (!user) return;
//     const pantryRef = collection(db, "users", user.uid, "pantry");
//     const q = query(pantryRef);
//     const unsub = onSnapshot(q, (snapshot) => {
//       setPantry(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     });
//     return () => unsub();
//   }, [user]);

//   // Add pantry item
//   async function addPantryItem(item) {
//     if (!user) return;
//     const pantryRef = collection(db, "users", user.uid, "pantry");
//     await addDoc(pantryRef, { name: item });
//   }

//   // Remove pantry item
//   async function removePantryItem(id) {
//     if (!user) return;
//     const docRef = doc(db, "users", user.uid, "pantry", id);
//     await deleteDoc(docRef);
//   }

//   // Fetch recipes from API
//   async function fetchRecipes() {
//     if (!pantry.length) return;
//     setLoading(true);
//     try {
//       const ingredients = pantry.map((i) => i.name).join(",");
//       const res = await axios.get("/api/spoonacular/recipes", {
//         params: { ingredients },
//       });
//       setRecipes(res.data);
//     } catch (err) {
//       console.error("Error fetching recipes:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className='max-w-4xl mx-auto py-10 px-4'>
//       <h1 className='text-3xl font-bold mb-6'>Your Pantry</h1>

//       {/* Pantry Input */}
//       <PantryInput onSelect={addPantryItem} />

//       {/* Pantry List */}
//       <ul className='mt-6 space-y-2'>
//         {pantry.map((item) => (
//           <li
//             key={item.id}
//             className='flex justify-between items-center bg-(#161611) shadow p-2 rounded'
//           >
//             <span>{item.name}</span>
//             <button
//               onClick={() => removePantryItem(item.id)}
//               className='text-red-500 hover:text-red-700'
//             >
//               Remove
//             </button>
//           </li>
//         ))}
//       </ul>

//       {/* Find Recipes Button */}
//       <div className='mt-8'>
//         <button
//           onClick={fetchRecipes}
//           disabled={!pantry.length || loading}
//           className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400'
//         >
//           {loading ? "Loading..." : "Find Recipes"}
//         </button>
//       </div>

//       {/* Recipe Results */}
//       {recipes.length > 0 && (
//         <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
//           {recipes.map((recipe) => (
//             <div
//               key={recipe.id}
//               className='bg-(#161611) shadow rounded overflow-hidden'
//             >
//               <img
//                 src={recipe.image}
//                 alt={recipe.title}
//                 className='w-full h-40 object-cover'
//               />
//               <div className='p-4'>
//                 <h2 className='font-semibold text-lg'>{recipe.title}</h2>
//                 <a
//                   href={`https://spoonacular.com/recipes/${recipe.title
//                     .toLowerCase()
//                     .replace(/ /g, "-")}-${recipe.id}`}
//                   target='_blank'
//                   rel='noopener noreferrer'
//                   className='text-blue-600 hover:underline mt-2 block'
//                 >
//                   View Recipe
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import RequireAuth from "@/components/RequireAuth";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import PantryInput from "@/components/PantryInput";
import axios from "axios";

function DashboardContent() {
  const [user] = useAuthState(auth);
  const [pantry, setPantry] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const pantryRef = collection(db, "users", user.uid, "pantry");
    const q = query(pantryRef);
    const unsub = onSnapshot(q, (snapshot) => {
      setPantry(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  async function addPantryItem(item) {
    if (!user) return;
    const pantryRef = collection(db, "users", user.uid, "pantry");
    await addDoc(pantryRef, { name: item });
  }

  async function removePantryItem(id) {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "pantry", id);
    await deleteDoc(docRef);
  }

  async function fetchRecipes() {
    if (!pantry.length) return;
    setLoading(true);
    try {
      const ingredients = pantry.map((i) => i.name).join(",");
      const res = await axios.get("/api/spoonacular/recipes", {
        params: { ingredients },
      });
      setRecipes(res.data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='max-w-4xl mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Your Pantry</h1>
      <PantryInput onSelect={addPantryItem} />

      <ul className='mt-6 space-y-2'>
        {pantry.map((item) => (
          <li
            key={item.id}
            className='flex justify-between items-center bg-(#161611) shadow p-2 rounded'
          >
            <span>{item.name}</span>
            <button
              onClick={() => removePantryItem(item.id)}
              className='text-red-500 hover:text-red-700'
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className='mt-8'>
        <button
          onClick={fetchRecipes}
          disabled={!pantry.length || loading}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400'
        >
          {loading ? "Loading..." : "Find Recipes"}
        </button>
      </div>

      {recipes.length > 0 && (
        <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className='bg-(#161611) shadow rounded overflow-hidden'
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className='w-full h-40 object-cover'
              />
              <div className='p-4'>
                <h2 className='font-semibold text-lg'>{recipe.title}</h2>
                <a
                  href={`https://spoonacular.com/recipes/${recipe.title
                    .toLowerCase()
                    .replace(/ /g, "-")}-${recipe.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline mt-2 block'
                >
                  View Recipe
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
