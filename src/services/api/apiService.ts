import { SearchParams, CocktailResponse, IngredientResponse } from "../types";

/**
 * Builds a URL with query parameters for API requests
 *
 * @param baseUrl - The base URL for the API endpoint
 * @param params - Object containing search and pagination parameters
 * @returns Formatted URL string with query parameters
 *
 * Examples:
 * - /api/search?query=margarita&index=0&limit=10
 * - /api/search/letter?firstLetter=m
 * - /api/ingredients/search?query=vodka
 */
export function buildUrl(baseUrl: string, params: SearchParams): string {
  const searchParams = new URLSearchParams();

  // Add search query parameter if provided
  // Used for cocktail name search and ingredient search
  if (params.query) {
    searchParams.append("query", params.query);
  }

  // Add first letter parameter if provided
  // Used for searching cocktails by their first letter
  if (params.firstLetter) {
    searchParams.append("firstLetter", params.firstLetter);
  }

  // Add pagination parameters if provided
  // Using typeof check to include 0 values but exclude undefined
  if (typeof params.index === "number") {
    searchParams.append("index", params.index.toString());
  }

  if (typeof params.limit === "number") {
    searchParams.append("limit", params.limit.toString());
  }

  // Combine base URL with query parameters
  // Only add ? if there are actual parameters
  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Generic function to fetch data from the API
 *
 * @param url - Full URL to fetch from
 * @returns Promise resolving to the typed response data
 * @throws Error if the fetch fails or returns non-200 status
 *
 * @template T - Type of the expected response (CocktailResponse or IngredientResponse)
 *
 * Usage:
 * ```typescript
 * const data = await fetchFromApi<CocktailResponse>(url);
 * const data = await fetchFromApi<IngredientResponse>(url);
 * ```
 */
export const fetchFromApi = async <T>(url: string): Promise<T> => {
  try {
    // Attempt to fetch data from the API
    const response = await fetch(url);

    // Check if the response was successful
    if (!response.ok) {
      // Only log errors in non-test environments
      // This keeps test output clean while maintaining logging in production
      if (process.env.NODE_ENV !== "test") {
        console.error(`API Error: ${response.statusText}`);
      }
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    // Log any errors that occur during the fetch
    // Only in non-test environments
    if (process.env.NODE_ENV !== "test") {
      console.error("API Error:", error);
    }
    // Re-throw the error for handling by the caller
    throw error;
  }
};
