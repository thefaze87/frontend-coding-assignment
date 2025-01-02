import React, { useState, useEffect } from "react";
import {
  fetchCocktails,
  fetchCocktailsByCategory,
} from "../services/cocktails/cocktailService";
import { Cocktail } from "../services/types";
import Header from "../components/Header";
import CocktailCard from "../components/CocktailCard/CocktailCard";
import Pagination from "../components/Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import loaderIcon from "../assets/icons/spinner.svg";
import {
  FILTER_CATEGORIES,
  fetchFilteredCocktails,
} from "../services/filters/filterService";

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
  const [displayValue, setDisplayValue] = useState(searchParams.get("q") || ""); // Visible search input value
  const [cocktails, setCocktails] = useState<Cocktail[]>([]); // List of cocktails
  const [index, setIndex] = useState(0); // Pagination start index
  const [limit] = useState(10); // Items per page
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDefaultView, setIsDefaultView] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  /**
   * Handles search input changes
   * Updates both visible input and internal query
   * Resets pagination when search changes
   */
  const handleSearch = (value: string) => {
    setIsSearching(true);
    setCocktails([]); // Clear existing data when search starts
    const searchTerm = value.trim();
    setDisplayValue(searchTerm); // Only show what user typed
    setQuery(searchTerm);
    setIsDefaultView(!searchTerm); // Set to default view if search is empty
    setIndex(0);
    setSearchParams(
      searchTerm ? { q: searchTerm } : {}, // Only set URL param if there's a search
      { replace: true }
    );
  };

  /**
   * Initialize search from URL parameters when component mounts
   * or when URL search params change
   */
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      handleSearch(queryParam);
      setIsDefaultView(false);
    } else {
      // Show default alcoholic drinks view
      setIsDefaultView(true);
      setQuery("");
    }
  }, []); // Keep as mount-only to prevent search loop

  /**
   * Fetch cocktails when search parameters change
   */
  useEffect(() => {
    const getCocktails = async () => {
      try {
        setLoading(true);
        const results = await fetchFilteredCocktails(
          activeFilter,
          index,
          limit
        );
        setCocktails(results.drinks);
        setTotalCount(results.totalCount);
        setHasMore(results.pagination?.hasMore || false);
      } catch (error) {
        console.error("Failed to fetch cocktails", error);
      } finally {
        setLoading(false);
      }
    };

    getCocktails();
  }, [activeFilter, index, limit]);

  // Calculate pagination state
  const currentPage = Math.floor(index / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);
  const showPagination = cocktails.length > 0 && totalCount > limit;

  /**
   * Handles filter changes
   * Resets pagination and updates results
   */
  const handleFilterChange = (endpoint: string | null) => {
    setActiveFilter(endpoint);
    setIndex(0); // Reset pagination when filter changes
  };

  return (
    <>
      <Header
        displayValue={displayValue}
        onSearch={handleSearch}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <h2 className="mb-4">
          {isDefaultView ? "All Drinks" : `Search Results: ${query}`}
        </h2>

        {/* Content Container with fixed height */}
        <div className="min-h-[600px]">
          {isSearching || loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <img
                src={loaderIcon}
                alt="Loading..."
                className="w-16 h-16 loading-icon animate-spin"
              />
            </div>
          ) : (
            <>
              {cocktails.length > 0 ? (
                /* Cocktail Grid */
                <div className="grid grid-cols-2 gap-6">
                  {cocktails.map((cocktail) => (
                    <CocktailCard
                      key={cocktail.id}
                      cocktail={cocktail}
                      loading={false}
                    />
                  ))}
                </div>
              ) : (
                /* No Results Message */
                <div className="flex flex-col items-center justify-center min-h-[400px] text-white/80">
                  <p className="text-xl mb-2">No drinks found</p>
                  <p>Try searching for something else</p>
                </div>
              )}

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
        </div>
      </main>
    </>
  );
};

export default Home;
