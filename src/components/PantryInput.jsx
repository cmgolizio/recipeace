"use client";

import { useState } from "react";
import axios from "axios";

export default function PantryInput({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch autocomplete suggestions
  async function fetchSuggestions(value) {
    setQuery(value);
    if (!value) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("/api/spoonacular/autocomplete", {
        params: { query: value },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching autocomplete:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle selecting a suggestion
  function handleSelect(suggestion) {
    onSelect(suggestion.name || suggestion);
    setQuery("");
    setSuggestions([]);
  }

  // Handle manual "Enter" submission
  function handleKeyDown(e) {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      handleSelect(query.trim());
    }
  }

  return (
    <div className='relative w-full max-w-md'>
      <input
        type='text'
        placeholder='Add an ingredient...'
        value={query}
        onChange={(e) => fetchSuggestions(e.target.value)}
        onKeyDown={handleKeyDown}
        className='w-full border rounded p-2 shadow-sm'
      />

      {loading && (
        <div className='absolute bg-(#161611) shadow-md rounded w-full mt-1 p-2 text-gray-500 text-sm'>
          Loading...
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className='absolute bg-gray-50 text-gray-900 shadow-md rounded w-full h-fit mt-1 z-10 overflow-y-auto'>
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(s)}
              className='p-2 hover:bg-gray-100 cursor-pointer'
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
