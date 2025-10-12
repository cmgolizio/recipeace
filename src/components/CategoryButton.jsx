"use client";

import { useRouter } from "next/navigation";

const CategoryButton = ({ category }) => {
  const router = useRouter();

  const handleCategoryButtonRoute = (category) => {
    router.push(`/${category.toLowerCase()}`);
  };

  return (
    <button
      className={`px-20 py-8 p-4 text-3xl text-gray-200 rounded-xl hover:scale-105 active:scale-95 ${
        category === "Drink"
          ? "bg-teal-400 hover:bg-teal-500 active:bg-teal-600"
          : "bg-red-400 hover:bg-red-500 active:bg-red-700"
      }`}
      onClick={() => handleCategoryButtonRoute(category)}
    >
      {category}
    </button>
  );
};

export default CategoryButton;
