import React, { useState, useEffect } from "react";
import { fetchCocktails } from "./services/cocktails/cocktailService";
import { Cocktail } from "./services/types";
import "./App.scss";
import Header from "./components/Header";
import CocktailCard from "./components/CocktailCard/CocktailCard";
import Pagination from "./components/Pagination";
/**
 * Main application component for BarCraft
 * Manages the global state and layout of the application
 *
 * @component
 */
const App = () => {
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
            <CocktailCard key={cocktail.id} cocktail={cocktail} />
          ))}
        </div>

        {/* Pagination Controls */}
        {cocktails.length > 0 && (
          <Pagination
            index={index}
            limit={limit}
            hasMore={cocktails.length >= limit}
            onNext={() => setIndex(index + limit)}
            onPrevious={() => setIndex(Math.max(0, index - limit))}
          />
        )}
      </main>
    </div>
  );
};

export default App;
