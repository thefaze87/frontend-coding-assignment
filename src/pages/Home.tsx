import React, { useState, useEffect } from "react";
import { fetchCocktails } from "../services/cocktails/cocktailService";
import { Cocktail } from "../services/types";
import Header from "../components/Header";
import CocktailCard from "../components/CocktailCard/CocktailCard";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";

/**
 * Home component serves as the main page of the application
 * Features:
 * - Displays searchable list of cocktails
 * - Handles pagination
 * - Maintains search state in URL
 * - Shows cocktails in a grid layout
 */
const Home = () => {
  // Get search parameters from URL
  const [searchParams] = useSearchParams();

  // State Management
  const [query, setQuery] = useState("m"); // Hidden default query for initial load
  const [displayValue, setDisplayValue] = useState(searchParams.get("q") || ""); // Visible search input value
  const [cocktails, setCocktails] = useState<Cocktail[]>([]); // List of cocktails
  const [index, setIndex] = useState(0); // Pagination start index
  const [limit] = useState(10); // Items per page
  const [loading, setLoading] = useState(true);

  /**
   * Handles search input changes
   * Updates both visible input and internal query
   * Resets pagination when search changes
   */
  const handleSearch = (value: string) => {
    setDisplayValue(value);
    setQuery(value || "m"); // If empty, fallback to default "m"
    setIndex(0); // Reset pagination when searching
  };

  /**
   * Initialize search from URL parameters when component mounts
   * or when URL search params change
   */
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      handleSearch(queryParam);
    }
  }, [searchParams]);

  /**
   * Fetch cocktails when search parameters change
   * This includes: search query, pagination index, or page limit
   */
  useEffect(() => {
    const getCocktails = async () => {
      try {
        setLoading(true);
        const results = await fetchCocktails(query, index, limit);
        setCocktails(results);
      } catch (error) {
        console.error("Failed to fetch cocktails", error);
      } finally {
        setLoading(false);
      }
    };
    getCocktails();
  }, [query, index, limit]);

  return (
    <>
      {/* Header with search functionality */}
      <Header displayValue={displayValue} onSearch={handleSearch} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="mb-4">All Drinks</h2>

        {/* Cocktail Grid */}
        <div className="grid grid-cols-2 gap-6">
          {loading
            ? // Show loading cards while fetching
              Array.from({ length: limit }).map((_, index) => (
                <CocktailCard
                  key={`loading-${index}`}
                  loading={true}
                  cocktail={{} as Cocktail}
                />
              ))
            : cocktails.map((cocktail) => (
                <CocktailCard
                  key={cocktail.id}
                  cocktail={cocktail}
                  loading={false}
                />
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
    </>
  );
};

export default Home;
