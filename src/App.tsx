import React, { useState, useEffect } from "react";
import { fetchCocktails } from "./services/cocktails/cocktailService";
import { Cocktail } from "./services/types";
import "./App.scss";
import Header from "./components/Header";

/**
 * Main application component for BarCraft
 * Manages the global state and layout of the application
 *
 * @component
 */
const App: React.FC = () => {
  // State Management
  const [query, setQuery] = useState("m"); // Hidden default query for initial load
  const [displayValue, setDisplayValue] = useState(""); // Visible search input value
  const [cocktails, setCocktails] = useState<Cocktail[]>([]); // List of cocktails
  const [index, setIndex] = useState(0); // Pagination start index
  const [limit, setLimit] = useState(10); // Items per page

  /**
   * Handles search input changes
   * Updates both the visible input value and the actual search query
   * Resets pagination when search changes
   *
   * @param value - New search input value
   */
  const handleSearch = (value: string) => {
    setDisplayValue(value);
    setQuery(value || "m"); // If empty, fallback to default "m"
    setIndex(0); // Reset pagination when searching
  };

  /**
   * Fetches cocktails when search parameters change
   * This includes: search query, pagination index, or page limit
   */
  useEffect(() => {
    const getCocktails = async () => {
      try {
        const results = await fetchCocktails(query, index, limit);
        setCocktails(results);
      } catch (error) {
        console.error("Failed to fetch cocktails", error);
      }
    };
    getCocktails();
  }, [query, index, limit]);

  return (
    <div className="App min-h-screen">
      {/* Header with search functionality */}
      <Header displayValue={displayValue} onSearch={handleSearch} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="mb-4">All Drinks</h2>

        {/* Cocktail Grid */}
        <div className="grid grid-cols-2 gap-6">
          {cocktails.map((cocktail) => (
            <div
              key={cocktail.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={cocktail.image}
                alt={cocktail.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {cocktail.name}
                </h3>
                <p className="text-sm text-gray-600">{cocktail.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {cocktails.length > 0 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            {/* Previous Page Button */}
            <button
              onClick={() => setIndex(Math.max(0, index - limit))}
              disabled={index === 0}
              className="p-2 text-white rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Page Indicator */}
            <span className="text-white">
              Page {Math.floor(index / limit) + 1}
            </span>

            {/* Next Page Button */}
            <button
              onClick={() => setIndex(index + limit)}
              disabled={cocktails.length < limit}
              className="p-2 text-white rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
