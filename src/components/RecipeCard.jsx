"use client";

import { useState } from "react";
import axios from "axios";
import { SlHeart } from "react-icons/sl";
import { ImHeart } from "react-icons/im";

export default function RecipeCard({
  recipe,
  user,
  toggleFavorite,
  isFavorited,
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const fetchRecipeSourceUrl = async (recipeId) => {
    try {
      const res = await axios.get("/api/spoonacular/recipe-source", {
        params: { "recipe-id": recipeId },
      });
      if (res.data && res.data.sourceUrl) {
        window.open(res.data.sourceUrl, "_blank");
        console.log("Recipe source URL:", res.data.sourceUrl);
      } else {
        console.error("No source URL found in response:", res.data);
        return null;
      }
    } catch (err) {
      console.error("Error fetching recipe source URL:", err);
      return null;
    }
  };
  return (
    <div className='border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col text-center'>
      <img
        src={recipe.image}
        alt={recipe.title}
        className='w-full h-40 object-cover rounded'
      />
      <h2 className='text-lg font-semibold mt-2'>{recipe.title}</h2>
      <p className='text-sm text-gray-600'>
        ✅ Uses {recipe.usedIngredientCount} pantry items
      </p>
      <span
        className={`cursor-pointer ${tooltipVisible ? "text-blue-600" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <p className='text-sm text-gray-600'>
          ❌ Missing {recipe.missedIngredientCount} items
        </p>
      </span>
      {tooltipVisible && (
        <div className='absolute z-10 bg-white border rounded p-2 mt-1 text-sm text-gray-800 shadow-lg w-64'>
          <ul className='text-sm'>
            {recipe?.missedIngredients.map((ing) => (
              <li key={ing.id}>- {ing.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        className='text-blue-600 hover:underline mt-2 block hover:cursor-pointer'
        onClick={() => fetchRecipeSourceUrl(recipe.id)}
      >
        View Recipe
      </button>
      {user && (
        <button
          onClick={() => toggleFavorite(recipe)}
          className='hover:cursor-pointer mt-2 px-2 py-2'
        >
          {isFavorited(recipe.id) ? (
            <ImHeart style={{ color: "red" }} />
          ) : (
            <SlHeart />
          )}
        </button>
      )}
    </div>
  );
}

{
  /* {user && (
        <button
          onClick={() => toggleFavorite(recipe)}
          className={`absolute bottom-0 left-0 mt-2 px-2 py-2 rounded text-sm ${
            isFavorited(recipe.id)
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {isFavorited(recipe.id)
            ? "Remove from Favorites"
            : "Add to Favorites"}
        </button>
      )} */
}
