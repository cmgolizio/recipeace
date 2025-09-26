import React from "react";

const IngredientList = ({ ingredientList, removeIngredient }) => {
  return (
    <ul className='mt-10 space-y-2'>
      {ingredientList.map((item) => (
        <li
          key={item.id}
          className='flex justify-between items-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 rounded'
        >
          <span>{item.name}</span>
          <button
            onClick={() => removeIngredient(item.id)}
            className='text-red-600 hover:underline text-sm'
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default IngredientList;
