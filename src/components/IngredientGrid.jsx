import React from "react";
import Image from "next/image";

const IngredientGrid = ({ ingredientList, removeIngredient }) => {
  return (
    <div className='min-w-full mx-auto mt-6 p-4 rounded-lg'>
      <div className='grid grid-cols-3 grid-auto-flow-row gap-4 mt-10 space-y-2'>
        {ingredientList.map((item) => (
          <div
            key={item.id}
            className='w-full h-fit m-2 p-2 flex flex-col justify-around items-center-safe dark:bg-gray-200 bg-gray-800 dark:text-gray-800 text-gray-200 rounded'
          >
            <span>{item.name}</span>
            {item.image_url && (
              <Image
                src={item.image_url || null}
                alt={item.name || "Ingredient Image"}
                width={80}
                height={80}
                className='object-contain rounded'
              />
            )}
            <button
              onClick={() => removeIngredient(item.id)}
              className='text-red-600 hover:text-red-700 active:text-red-900 hover:underline text-sm'
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientGrid;
