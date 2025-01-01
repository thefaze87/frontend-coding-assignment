import React, { useState, useEffect } from "react";
import { fetchCocktails } from "../services/cocktails/cocktailService";
import { Cocktail } from "../services/types";
import Header from "../components/Header";
import CocktailCard from "../components/CocktailCard/CocktailCard";
import Pagination from "../components/Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import loaderIcon from "../assets/icons/spinner.svg";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State Management
  const [query, setQuery] = useState(""); // Remove default query
  const [displayValue, setDisplayValue] = useState(
    searchParams.get("q") || "margarita"
  ); // Visible search input value
  const [cocktails, setCocktails] = useState<Cocktail[]>([]); // List of cocktails
  const [index, setIndex] = useState(0); // Pagination start index
  const [limit] = useState(10); // Items per page
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Handles search input changes
   * Updates both visible input and internal query
   * Resets pagination when search changes
   * Uses "margarita" as default search when input is empty
   */
  const handleSearch = (value: string) => {
    setIsSearching(true);
    setCocktails([]); // Clear existing data when search starts
    const searchTerm = value.trim() || "margarita";
    setDisplayValue(searchTerm);
    setQuery(searchTerm);
    setIndex(0);
    setSearchParams({ q: searchTerm });
  };

  /**
   * Initialize search from URL parameters when component mounts
   * or when URL search params change
   */
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      handleSearch(queryParam);
    } else {
      // Load initial "margarita" search if no query parameter
      handleSearch("margarita");
    }
  }, []); // Run only on mount

  /**
   * Fetch cocktails when search parameters change
   */
  useEffect(() => {
    // Only fetch if we have a query
    if (query) {
      getCocktails();
    }
  }, [query, index, limit]); // Remove unnecessary dependencies

  /**
   * Initialize search from URL parameters when component mounts
   * or when URL search params change
   * Moved outside of useEffect to prevent initial load from being blocked and for access
   */
  const getCocktails = async () => {
    try {
      setLoading(true);
      const results = await fetchCocktails(query, index, limit);
      setCocktails(results);
    } catch (error) {
      console.error("Failed to fetch cocktails", error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <>
      <Header displayValue={displayValue} onSearch={handleSearch} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="mb-4">All Drinks</h2>

        {isSearching || loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <img
              src={loaderIcon}
              alt="Loading..."
              className="w-16 h-16 loading-icon animate-spin"
            />
          </div>
        ) : (
          <>
            {/* Cocktail Grid */}
            <div className="grid grid-cols-2 gap-6">
              {cocktails.map((cocktail) => (
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
          </>
        )}
      </main>
    </>
  );
};

export default Home;
