export default function RecipeCard({ recipe }) {
  return (
    <div className='border rounded-lg p-4 shadow hover:shadow-lg transition'>
      <img
        src={recipe.image}
        alt={recipe.title}
        className='w-full h-40 object-cover rounded'
      />
      <h2 className='text-lg font-semibold mt-2'>{recipe.title}</h2>
      <p className='text-sm text-gray-600'>
        Uses {recipe.usedIngredientCount} of your items
        {recipe.missedIngredientCount > 0 &&
          ` • Missing ${recipe.missedIngredientCount}`}
      </p>
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
  );
}
