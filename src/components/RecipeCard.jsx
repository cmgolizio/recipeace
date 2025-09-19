"use client";

import { useState } from "react";
import Link from "next/link";
import { SlHeart } from "react-icons/sl";
import { ImHeart } from "react-icons/im";

import { fetchRecipeSourceUrl, isFavorited, toggleFavorite } from "@/lib/utils";

export default function RecipeCard({
  recipe,
  user,
  favorites,
  // toggleFavorite,
  // isFavorited,
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div className='border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col text-center'>
      <img
        src={recipe.image}
        alt={recipe.title}
        className='w-full h-40 object-cover rounded'
      />
      <Link href={`/recipe/${recipe.id}`}>
        <h2 className='text-lg font-semibold mt-2 hover:underline'>
          {recipe.title}
        </h2>
      </Link>
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
          onClick={() => toggleFavorite(user, favorites, recipe)}
          className='hover:cursor-pointer mt-2 px-2 py-2'
        >
          {isFavorited(favorites, recipe.id) ? (
            <ImHeart style={{ color: "red" }} />
          ) : (
            <SlHeart />
          )}
        </button>
      )}
    </div>
  );
}
