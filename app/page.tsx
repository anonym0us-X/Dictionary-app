"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./globals.css";

export default function Home() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setMeaning(null);
  }, [word]);

  const fetchMeaning = async () => {
    if (!word.trim()) return;
    setError(null);
    setMeaning(null);
    
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.data || response.data.length === 0) {
        throw new Error("Invalid response format");
      }
      
      const meanings = response.data[0]?.meanings;
      if (!meanings || meanings.length === 0 || !meanings[0].definitions) {
        throw new Error("Meaning not found");
      }
      
      const definitions = meanings[0].definitions;
      setMeaning(definitions[0]?.definition || "No definition available.");
    } catch (err) {
      setError(typeof err === 'string' ? err : "Word not found. Try another word.");
    }
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg">Word Meaning Finder</h1>
      <div className="flex gap-2 bg-white p-2 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Enter a word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button onClick={fetchMeaning} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-bold transition-all">
          Search
        </button>
      </div>
      {meaning && (
        <p className="mt-6 bg-white p-4 rounded-lg shadow-lg text-black text-lg font-semibold max-w-lg text-center">
          Meaning: {meaning}
        </p>
      )}
      {error && <p className="mt-6 text-red-200 font-bold">{error}</p>}
    </div>
  );
}
