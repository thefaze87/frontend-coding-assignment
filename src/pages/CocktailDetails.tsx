import React, { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Cocktail } from "../services/types";
import { fetchCocktailById } from "../services/cocktails/cocktailService";
import loaderIcon from "../assets/icons/spinner.svg";
import Header from "../components/Header";

/**
 * CocktailDetails component displays detailed information about a specific cocktail
 * Features:
 * - Fetches and displays detailed cocktail information
 * - Shows loading states while fetching
 * - Handles errors with user-friendly messages
 * - Provides navigation back to search
 * - Maintains search functionality in header
 */
const CocktailDetails = () => {
  // Get cocktail ID from URL parameters
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State management
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayValue, setDisplayValue] = useState("");

  // Update display value when search params change
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setDisplayValue(queryParam);
    }
  }, [searchParams]);

  /**
   * Handles search input changes
   * Redirects to home page with search query parameter
   */
  const handleSearch = (value: string) => {
    setDisplayValue(value);
    navigate(`/?q=${encodeURIComponent(value)}`, { replace: true });
  };

  /**
   * Fetches cocktail details when component mounts or ID changes
   * Handles loading states and error scenarios
   */
  useEffect(() => {
    const getCocktailDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id || isNaN(Number(id))) {
          throw new Error("Invalid cocktail ID");
        }

        const data = await fetchCocktailById(Number(id));
        setCocktail(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch cocktail";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    getCocktailDetails();
  }, [id]);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src={loaderIcon}
          alt="Loading..."
          className="w-16 h-16  loading-icon"
        />
      </div>
    );
  }

  // Show error message if fetch failed. Mostly for debugging.
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center max-w-lg">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <p className="text-white/70 mb-6">
            Most cocktails have IDs between 11000 and 15000.
            <br />
            <br />
            Try these popular cocktails:
            <br />
            11007 (Margarita)
            <br />
            11000 (Mojito)
            <br />
            11001 (Old Fashioned)
          </p>
        </div>
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to search
        </Link>
      </div>
    );
  }

  // Return null if no cocktail data (shouldn't normally happen)
  if (!cocktail) return null;

  if (cocktail.ingredients) {
    const ingredientsCount = cocktail.ingredients.length;
  }

  // Render cocktail details
  return (
    <>
      <Header displayValue={displayValue} onSearch={handleSearch} />
      <div className="w-630 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation back to search. Wasn't in the design doc, but I added it to help with navigation and user experience. */}
        <Link to="/" className="text-white mb-4 inline-block hover:underline">
          ← Back to search
        </Link>

        {/* Cocktail title */}
        <h1 className="text-4xl text-white mb-4 mt-6">{cocktail.name}</h1>

        {/* Main content container */}
        <div className="border-1 border-white rounded-lg p-8 mt-4">
          <div className="flex gap-8 mb-4">
            {/* Cocktail image */}
            <img
              src={cocktail.image}
              alt={cocktail.name}
              className="w-[220px] h-[220px] rounded-lg"
            />

            {/* Details section */}
            <div className="flex-1">
              {/* Ingredients section */}
              {cocktail.ingredients && cocktail.ingredients.length > 0 && (
                <div>
                  <h2 className="text-xl text-white mb-2">
                    {`${cocktail.ingredients.length === 1 ? "Ingredient" : cocktail.ingredients.length + " Ingredients"}`}
                  </h2>
                  <ul className="text-white/80">
                    {cocktail.ingredients.map((ingredient, index) => (
                      <li key={ingredient} className="mb-1">
                        {ingredient}{" "}
                        {cocktail.measures?.[index] &&
                          `- ${cocktail.measures[index]}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Category tag */}
          <span className="cocktail-category inline-block rounded-lg px-3 py-1 border-1 border-white text-white mb-6">
            {cocktail.category}
          </span>

          <div className="flex flex-col gap-4">
            {/* Instructions section */}
            {cocktail.instructions && (
              <div className="mb-8">
                <h2 className="text-xl text-white mb-2">Instructions</h2>
                <p className="text-white/80">{cocktail.instructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CocktailDetails;
