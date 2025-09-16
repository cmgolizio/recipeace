import React from "react";

const PantryList = ({ pantry, removePantryItem }) => {
  return (
    <ul className='mt-4 space-y-2'>
      {pantry.map((item) => (
        <li
          key={item.id}
          className='flex justify-between items-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 rounded'
        >
          <span>{item.name}</span>
          <button
            onClick={() => removePantryItem(item.id)}
            className='text-red-600 hover:underline text-sm'
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PantryList;
