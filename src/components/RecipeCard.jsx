import axios from "axios";

export default function RecipeCard({
  recipe,
  user,
  toggleFavorite,
  isFavorited,
  // fetchRecipeSourceUrl,
}) {
  const fetchRecipeSourceUrl = async (recipeId) => {
    try {
      const res = await axios.get("/api/spoonacular/recipe-source", {
        params: { "recipe-id": recipeId },
      });
      if (res.data && res.data.sourceUrl) {
        // setRecipeSourceUrl(res.data.sourceUrl);
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
    <div className='h-full border rounded-lg p-4 shadow hover:shadow-lg transition hover:cursor-pointer'>
      <img
        src={recipe.image}
        alt={recipe.title}
        className='w-full h-40 object-cover rounded'
      />
      <h2 className='text-lg font-semibold mt-2'>{recipe.title}</h2>
      <p className='text-sm text-gray-600'>
        ✅ Uses {recipe.usedIngredientCount} pantry items <br />❌ Missing{" "}
        {recipe.missedIngredientCount} items
      </p>
      {/* <a
        href={`https://spoonacular.com/recipes/${recipe.title
          .toLowerCase()
          .replace(/ /g, "-")}-${recipe.id}`}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-600 hover:underline mt-2 block'
      >
        View Recipe
      </a> */}
      <button
        className='text-blue-600 hover:underline mt-2 block hover:cursor-pointer'
        onClick={() => fetchRecipeSourceUrl(recipe.id)}
      >
        View Recipe
      </button>
      {user && (
        <button
          onClick={() => toggleFavorite(recipe)}
          className={`mt-2 px-2 py-1 rounded text-sm ${
            isFavorited(recipe.id)
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {isFavorited(recipe.id)
            ? "Remove from Favorites"
            : "Add to Favorites"}
        </button>
      )}
    </div>
  );
}
