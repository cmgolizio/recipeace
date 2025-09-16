"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function PantryInput({ onAdd }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const timerRef = useRef(null);

  // Fetch autocomplete suggestions from Spoonacular
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
      setSuggestions(res.data);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error("Error fetching autocomplete:", err);
      setError("Failed to fetch suggestions. Try again later.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  //   function handleSelect(suggestion) {
  //     onSelect(suggestion.name || suggestion);
  //     setQuery("");
  //     setSuggestions([]);
  //   }

  // Debounce input
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(input), 300);

    return () => clearTimeout(timerRef.current);
  }, [input]);

  // Handle adding item to pantry
  const handleAdd = (itemName) => {
    if (!itemName || !onAdd) return;

    onAdd(itemName);
    setInput("");
    setSuggestions([]);
    setAddedMessage(`"${itemName}" added!`);

    setTimeout(() => setAddedMessage(""), 1500);
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleAdd(suggestions[highlightedIndex].name);
      } else {
        handleAdd(input);
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
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Add ingredient...'
        className='w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
      />

      {addedMessage && (
        <p className='absolute top-full left-0 mt-1 text-md text-green-500'>
          {addedMessage}
        </p>
      )}

      {loading && (
        <div className='absolute z-10 top-full left-0 w-full mt-1 border rounded-md shadow-lg h-fit overflow-y-auto bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
          <p className='animate-pulse'>Loading suggestions...</p>
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
              key={suggestion.id || index}
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
