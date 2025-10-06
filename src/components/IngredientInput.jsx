"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { addDrinkIngredient } from "@/helpers/addDrinkIngredient";
import { auth } from "@/lib/firebase";

export default function IngredientInput({ onAdd, type, setAddedMessage }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const timerRef = useRef(null);

  // Fetch autocomplete suggestions from Spoonacular (food only)
  async function fetchSuggestions(value) {
    setInput(value);
    if (!value) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/spoonacular/autocomplete", {
        params: { query: value },
      });
      setSuggestions(res.data || []);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error("Error fetching autocomplete:", err);
      setError("Failed to fetch suggestions. Try again later.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

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

  // Debounce input for food
  useEffect(() => {
    if (type === "drink") return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(input), 500);

    return () => clearTimeout(timerRef.current);
  }, [input, type]);

  // Handle adding item to pantry
  const handleAdd = (itemName) => {
    if (!itemName || !onAdd) return;

    onAdd(itemName);
    setInput("");
    setSuggestions([]);
    if (setAddedMessage) {
      setAddedMessage(`"${itemName}" added!`);
      setTimeout(() => setAddedMessage(""), 2000);
    }
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleAdd(suggestions[highlightedIndex].name);
      } else {
        type === "drink" ? validateIngredient(e) : handleAdd(input);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
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
        <div className='absolute left-0 top-full ml-1.5 py-1.5 rounded-md shadow-lg h-fit overflow-y-auto bg-transparent text-violet-600 text-xl'>
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

      {!loading && suggestions.length > 0 && (
        <ul className='absolute z-10 top-full left-0 w-full mt-1 border rounded-md shadow-lg h-fit overflow-y-auto bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id || `suggestion-${index}`}
              onClick={() => handleAdd(suggestion.name)}
              className={`px-3 py-2 cursor-pointer ${
                highlightedIndex === index
                  ? "bg-blue-100"
                  : "hover:bg-gray-100 hover:dark:bg-gray-600 hover:text-gray-900 hover:dark:text-gray-100"
              }`}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
