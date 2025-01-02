import { fetchFromApi, buildUrl } from "../api/apiService";
import {
  SearchParams,
  CocktailResponse,
  IngredientResponse,
  CocktailDetailsResponse,
  Cocktail,
  FilteredCocktailResponse as FilteredResponse,
} from "../types";

const API_BASE_URL = "http://localhost:4000/api";

/**
 * Helper function to extract ingredients from API response
 * Processes raw API data to get a clean array of ingredients
 *
 * @param data - Raw cocktail data from API containing strIngredient1...strIngredient15
 * @returns Array of non-null ingredient names
 */
const extractIngredients = (data: any): string[] => {
  const ingredients: string[] = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = data[`strIngredient${i}`];
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }
  return ingredients;
};

/**
 * Helper function to extract measurements from API response
 * Processes raw API data to get a clean array of measurements
 *
 * @param data - Raw cocktail data from API containing strMeasure1...strMeasure15
 * @returns Array of non-null, trimmed measurements
 */
const extractMeasures = (data: any): string[] => {
  const measures: string[] = [];
  for (let i = 1; i <= 15; i++) {
    const measure = data[`strMeasure${i}`];
    if (measure) {
      measures.push(measure.trim());
    }
  }
  return measures;
};

/**
 * Fetches cocktails based on search criteria with pagination
 * Primary search endpoint for cocktail discovery
 *
 * @param query - Search term for cocktail names (optional)
 * @param index - Starting position for pagination (default: 0)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise with paginated cocktail results
 */
export const fetchCocktails = async (
  query: string = "",
  index: number = 0,
  limit: number = 10
): Promise<CocktailResponse> => {
  const params: SearchParams = {
    query,
    index,
    limit,
  };

  const url = buildUrl(`${API_BASE_URL}/search`, params);
  return await fetchFromApi<CocktailResponse>(url);
};

/**
 * Fetches cocktails starting with a specific letter
 * Used for alphabetical browsing functionality
 *
 * @param letter - Single character to filter cocktails by
 * @param index - Starting position for pagination (default: 0)
 * @param limit - Number of items per page (default: 10)
 * @throws Error if letter parameter is not a single character
 * @returns Promise with matching cocktails array
 */
export const fetchCocktailsByLetter = async (
  letter: string,
  index: number = 0,
  limit: number = 10
) => {
  if (letter.length !== 1) {
    throw new Error("Letter parameter must be a single character");
  }

  const params: SearchParams = {
    firstLetter: letter.toLowerCase(),
    index,
    limit,
  };

  const url = buildUrl(`${API_BASE_URL}/search/letter`, params);
  const response = await fetchFromApi<CocktailResponse>(url);
  return response.drinks;
};

/**
 * Fetches popular cocktails with pagination
 * Returns curated list of frequently accessed cocktails
 *
 * @param index - Starting position for pagination (default: 0)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise with array of popular cocktails
 */
export const fetchPopularCocktails = async (
  index: number = 0,
  limit: number = 10
) => {
  const params: SearchParams = {
    index,
    limit,
  };

  const url = buildUrl(`${API_BASE_URL}/popular`, params);
  const response = await fetchFromApi<CocktailResponse>(url);
  return response.drinks;
};

/**
 * Fetches ingredients by search query with pagination
 * Supports ingredient discovery and filtering
 *
 * @param query - Search term for ingredients (optional)
 * @param index - Starting position for pagination (default: 0)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise with paginated ingredient results
 */
export const fetchIngredients = async (
  query: string = "",
  index: number = 0,
  limit: number = 10
) => {
  const params: SearchParams = {
    ...(query && { query }),
    index,
    limit,
  };

  const url = buildUrl(`${API_BASE_URL}/ingredients/search`, params);
  const response = await fetchFromApi<IngredientResponse>(url);
  return response.ingredients;
};

/**
 * Fetches detailed information for a specific cocktail
 * Includes full recipe, ingredients, and instructions
 *
 * @param id - Unique identifier of the cocktail
 * @throws Error if cocktail is not found
 * @returns Promise with complete cocktail details
 */
export const fetchCocktailById = async (id: number): Promise<Cocktail> => {
  const url = `${API_BASE_URL}/cocktail/${id}`;

  try {
    const response = await fetchFromApi<CocktailDetailsResponse>(url);
    if (!response.drink) {
      throw new Error(`Cocktail with ID ${id} not found`);
    }
    return response.drink;
  } catch (error) {
    console.error("Error fetching cocktail:", error);
    throw error;
  }
};

/**
 * Fetches all drinks in the Cocktail category with pagination
 * Used for browsing the main cocktail collection
 *
 * @param index - Starting position for pagination (default: 0)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise with paginated filtered cocktail results
 */
export const fetchCocktailsByCategory = async (
  index: number = 0,
  limit: number = 10
): Promise<FilteredResponse> => {
  const url = `${API_BASE_URL}/filter/cocktails?index=${index}&limit=${limit}`;
  return await fetchFromApi<FilteredResponse>(url);
};
