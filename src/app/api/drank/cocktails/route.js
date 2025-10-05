// pages/api/cocktails.js
import { createClient } from "@supabase/supabase-js";
import { verifyIdToken } from "@/lib/firebaseAdmin";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.split("Bearer ")[1];
    await verifyIdToken(token); // throws if invalid

    // Query Supabase
    const { data, error } = await supabase
      .from("cocktails")
      .select("id, name, category, instructions, glass_type, tags, image_url");

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}
