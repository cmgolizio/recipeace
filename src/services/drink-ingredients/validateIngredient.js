import { supabase } from "@/lib/supabaseClient";

export async function validateIngredient(name) {
  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name, type, subcategory, abv")
    .ilike("name", name) // case-insensitive match
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data || null; // null if ingredient not found
}
