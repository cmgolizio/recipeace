"use client";

import { useState, useEffect } from "react";

import { auth } from "@/lib/firebase";

export default function IngredientInput({ onAdd, type, setAddedMessage }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [normalizedSuggestions, setNormalizedSuggestions] = useState([]);

  // validate drink input with Supabase "Drank" database, before adding to Firestore
  const validateIngredient = async (e) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);

    // Get Firebase ID token
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");
    const idToken = await user.getIdToken();

    try {
      // Call API route
      const res = await fetch("/api/drank/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientName: input, idToken }),
      });

      const data = await res.json();
      console.log("validateIngredient response:", data);

      if (!res.ok) {
        alert(`❌ ${data.error || "Ingredient not found"}`);
        setLoading(false);
        return;
      }

      // Add to Firestore
      await onAdd(data.ingredient);

      // Update UI
      setLoading(false);
      setInput("");
    } catch (err) {
      console.error(err);
      setError("Error validating ingredient");
      setLoading(false);
    }
  };

  // Lightweight local suggestions to remove network dependency on typing speed
  useEffect(() => {
    if (type !== "food") return;
    if (!input) {
      setNormalizedSuggestions([]);
      return;
    }

    const lowered = input.toLowerCase();
    const matches = [
      "tomato",
      "onion",
      "garlic",
      "chicken",
      "olive oil",
      "pasta",
      "basil",
      "parmesan",
      "ground beef",
      "carrot",
      "celery",
      "potato",
      "bell pepper",
    ].filter((name) => name.includes(lowered));
    setNormalizedSuggestions(matches);
  }, [input, type]);

  // Handle adding item to pantry
  const handleAdd = async (itemName) => {
    if (!itemName || !onAdd) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ingredients/normalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: itemName }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Unable to normalize ingredient");

      const normalized = data.normalizedIngredients?.[0];
      if (!normalized) throw new Error("No recognizable ingredient");

      await onAdd(normalized);
      setInput("");
      setNormalizedSuggestions([]);
      if (setAddedMessage) {
        setAddedMessage(`"${normalized.canonicalName}" added!`);
        setTimeout(() => setAddedMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to add ingredient");
    } finally {
      setLoading(false);
    }
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      type === "drink" ? validateIngredient(e) : handleAdd(input);
    }
  };

  return (
    <div className='relative w-full max-w-md'>
      {type === "food" ? (
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Add ingredient...'
          className='w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
        />
      ) : (
        <div className='relative flex items-center w-full'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Add spirit or mixer...'
            className='w-full p-2 bg-gray-700 active:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 dark:active:bg-gray-200 border rounded-md focus:outline-none focus:ring focus:border-none border-none'
          />
          <button
            className='absolute right-0 scale-95 rounded-md px-3 py-2 text-gray-100 bg-gray-500 hover:bg-gray-400 hover:scale-105 active:scale-95 active:bg-gray-600'
            onClick={(e) => validateIngredient(e)}
          >
            Add
          </button>
        </div>
      )}

      {loading && (
        <div className='absolute left-0 top-full ml-1.5 py-1.5 px-2.5 rounded-md shadow-lg h-fit overflow-y-auto bg-[rgba(255,255,255,0.3)] backdrop-blur-[10px] text-violet-300 text-lg'>
          <p className='animate-pulse'>
            {type === "food"
              ? "Loading suggestions..."
              : "Validating bar ingredient..."}
          </p>
        </div>
      )}

      {error && (
        <p className='absolute top-full left-0 mt-1 text-sm text-red-500'>
          {error}
        </p>
      )}

      {!loading && normalizedSuggestions.length > 0 && (
        <ul className='absolute z-10 top-full left-0 w-full mt-1 border rounded-md shadow-lg h-fit overflow-y-auto bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
          {normalizedSuggestions.map((suggestion, index) => (
            <li
              key={`suggestion-${index}`}
              onClick={() => handleAdd(suggestion)}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-600 hover:text-gray-900 hover:dark:text-gray-100`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
