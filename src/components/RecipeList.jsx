// "use client";

// import { useState } from "react";
// import axios from "axios";

// export default function RecipeList({ pantry }) {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [strict, setStrict] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchRecipes = async () => {
//     if (pantry.length === 0) {
//       setError("Your pantry is empty. Add some items first!");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.get("/api/spoonacular/recipes", {
//         params: {
//           ingredients: pantry.join(","),
//           strict,
//         },
//       });
//       if (res.data.length === 0) {
//         setError("No recipes found with these ingredients.");
//       }
//       setRecipes(res.data);
//     } catch (err) {
//       console.error("Error fetching recipes:", err);
//       setError(
//         "Something went wrong while fetching recipes. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='mt-6'>
//       <div className='flex items-center gap-3'>
//         <button
//           onClick={fetchRecipes}
//           className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50'
//           disabled={loading || pantry.length === 0}
//         >
//           {loading ? "Loading..." : "Find Recipes"}
//         </button>
//         <label className='flex items-center gap-2'>
//           <input
//             type='checkbox'
//             checked={strict}
//             onChange={(e) => setStrict(e.target.checked)}
//           />
//           Strict mode (only pantry items)
//         </label>
//       </div>

//       {error && (
//         <p className='mt-4 text-red-500 text-sm font-medium'>{error}</p>
//       )}

//       {loading && (
//         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 animate-pulse'>
//           {[...Array(6)].map((_, idx) => (
//             <div
//               key={idx}
//               className='p-4 border rounded-lg shadow bg-gray-100 h-56'
//             >
//               <div className='w-full h-32 bg-gray-300 rounded-md'></div>
//               <div className='h-4 bg-gray-300 rounded mt-3 w-3/4'></div>
//               <div className='h-3 bg-gray-300 rounded mt-2 w-1/2'></div>
//             </div>
//           ))}
//         </div>
//       )}

//       {!loading && recipes.length > 0 && (
//         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
//           {recipes.map((recipe) => (
//             <div
//               key={recipe.id}
//               className='p-4 border rounded-lg shadow hover:shadow-md bg-white'
//             >
//               <img
//                 src={recipe.image}
//                 alt={recipe.title}
//                 className='w-full h-40 object-cover rounded-md'
//               />
//               <h3 className='mt-2 font-semibold'>{recipe.title}</h3>
//               <p className='text-sm text-gray-600'>
//                 ✅ Uses {recipe.usedIngredientCount} pantry items <br />❌
//                 Missing {recipe.missedIngredientCount} items
//               </p>
//               <a
//                 href={`https://spoonacular.com/recipes/${recipe.title.replace(
//                   /\s+/g,
//                   "-"
//                 )}-${recipe.id}`}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className='inline-block mt-2 text-blue-500 hover:underline text-sm'
//               >
//                 View Recipe →
//               </a>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import RecipeCard from "./RecipeCard";

export default function RecipeList({ pantry }) {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [strict, setStrict] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recipeSourceUrl, setRecipeSourceUrl] = useState(null);

  // Fetch recipes
  const fetchRecipes = async () => {
    if (pantry.length === 0) {
      setError("Your pantry is empty. Add some items first!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("/api/spoonacular/recipes", {
        params: {
          ingredients: pantry.join(","),
          strict,
        },
      });
      if (res.data.length === 0) {
        setError("No recipes found with these ingredients.");
      }
      setRecipes(res.data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(
        "Something went wrong while fetching recipes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // const fetchRecipeSourceUrl = async (recipeId) => {
  //   try {
  //     const res = await axios.get("/api/spoonacular/recipe-source", {
  //       params: { "recipe-id": recipeId },
  //     });
  //     if (res.data && res.data.sourceUrl) {
  //       setRecipeSourceUrl(res.data.sourceUrl);
  //       // window.open(res.data.sourceUrl, "_blank");
  //       console.log("Recipe source URL:", res.data.sourceUrl);
  //     } else {
  //       console.error("No source URL found in response:", res.data);
  //       return null;
  //     }
  //   } catch (err) {
  //     console.error("Error fetching recipe source URL:", err);
  //     return null;
  //   }
  // };

  // Fetch favorites
  useEffect(() => {
    if (!user) return;
    const favoritesRef = collection(db, "users", user.uid, "favorites");
    const q = query(favoritesRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favs);
    });

    return () => unsubscribe();
  }, [user]);

  const isFavorited = (recipeId) => {
    return favorites.some((fav) => fav.recipeId === recipeId);
  };

  const toggleFavorite = async (recipe) => {
    if (!user) return;

    const favoritesRef = collection(db, "users", user.uid, "favorites");

    if (isFavorited(recipe.id)) {
      // Remove favorite
      const favDoc = favorites.find((fav) => fav.recipeId === recipe.id);
      await deleteDoc(doc(db, "users", user.uid, "favorites", favDoc.id));
    } else {
      // Add favorite
      await addDoc(favoritesRef, {
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
      });
    }
  };

  return (
    <div className='mt-6'>
      <div className='flex items-center gap-3'>
        <button
          onClick={fetchRecipes}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50'
          disabled={loading || pantry.length === 0}
        >
          {loading ? "Loading..." : "Find Recipes"}
        </button>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={strict}
            onChange={(e) => setStrict(e.target.checked)}
          />
          Strict mode (only pantry items)
        </label>
      </div>

      {error && (
        <p className='mt-4 text-red-500 text-sm font-medium'>{error}</p>
      )}

      {loading && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 animate-pulse'>
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className='p-4 border rounded-lg shadow bg-gray-100 h-56'
            >
              <div className='w-full h-32 bg-gray-300 rounded-md'></div>
              <div className='h-4 bg-gray-300 rounded mt-3 w-3/4'></div>
              <div className='h-3 bg-gray-300 rounded mt-2 w-1/2'></div>
            </div>
          ))}
        </div>
      )}

      {!loading && recipes.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6'>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              user={user}
              toggleFavorite={toggleFavorite}
              isFavorited={isFavorited}
              // fetchRecipeSourceUrl={fetchRecipeSourceUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
