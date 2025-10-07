import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Next.js dynamic route component
export default async function RecipePage({ params }) {
  const { id } = await params;

  const cocktailId = Number(id);
  if (isNaN(cocktailId)) {
    return <div>Invalid cocktail ID.</div>;
  }

  // Fetch the cocktail details from Supabase
  const { data: cocktail, error } = await supabase
    .from("cocktails")
    .select(
      `
      *,
      cocktail_ingredients (
        ingredient_id,
        ingredients (
          id,
          name,
          type,
          subcategory,
          abv,
          notes
        )
      )
    `
    )
    // .select("id, name, category, instructions, glass_type, tags")
    .eq("id", cocktailId)
    .maybeSingle();

  if (error) {
    console.error("Supabase error fetching cocktail:", error);
    return <div>Error loading cocktail. Please try again.</div>;
  }

  if (!cocktail) {
    return <div>Cocktail not found.</div>;
  }

  // const { name, category, instructions } = cocktail;
  const { name, category, instructions, cocktail_ingredients, image_url } =
    cocktail;
  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-4'>{name}</h1>
      <p className='text-gray-600 mb-2'>Category: {category}</p>
      <h2 className='text-xl font-semibold mt-4 mb-2'>Ingredients:</h2>
      <div className='w-full flex flex-row gap-4'>
        <ul className='list-disc pl-6'>
          {cocktail_ingredients.map((ci) => {
            const ing = ci.ingredients;
            return (
              <li key={ing.id}>
                {ing.name} {ing.abv ? `(${ing.abv}%)` : ""}{" "}
                {/* {ing.notes ? `- ${ing.notes}` : ""} */}
              </li>
            );
          })}
        </ul>
        <Image src={image_url || ""} alt={name} width={400} height={400} />
      </div>
      <h2 className='text-xl font-semibold mt-4 mb-2'>Instructions:</h2>
      <p>{instructions}</p>
    </div>
  );
}
