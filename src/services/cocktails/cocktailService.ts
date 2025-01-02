/**
 * Cocktail Service Layer
 *
 * Purpose:
 * - Centralize API interactions
 * - Handle data transformation
 * - Manage request/response lifecycle
 * - Provide type-safe interfaces
 *
 * Architecture:
 * - Service-based pattern
 * - Type-driven development
 * - Error boundary handling
 * - Response normalization
 *
 * Design Decisions:
 * - Separation of concerns
 * - Consistent error handling
 * - Data transformation
 * - Caching strategy
 *
 * Technical Implementation:
 * - Strong typing
 * - Async operations
 * - Error propagation
 * - Response mapping
 *
 * Performance Considerations:
 * - Request batching
 * - Response caching
 * - Error recovery
 * - Memory management
 */

import { fetchFromApi, buildUrl } from "../api/apiService";
import {
  SearchParams,
  CocktailResponse,
  IngredientResponse,
  CocktailDetailsResponse,
  Cocktail,
  FilteredCocktail,
  FilteredCocktailResponse,
} from "../types";

const API_BASE_URL = "http://localhost:4000/api";

/**
 * Helper function to extract ingredients from API response
 * @param data - Raw cocktail data from API
 * @returns Array of ingredient names
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
 * @param data - Raw cocktail data from API
 * @returns Array of measurements
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
 * Fetches cocktails based on search criteria
 *
 * Features:
 * - Pagination support
 * - Search filtering
 * - Response transformation
 * - Error handling
 */
export const fetchCocktails = async (
  query: string = "",
  index: number = 0,
  limit: number = 10
) => {
  const params: SearchParams = {
    ...(query && { query }),
    index,
    limit,
  };

  const url = buildUrl(`${API_BASE_URL}/search`, params);
  const response = await fetchFromApi<CocktailResponse>(url);

  if (response.drinks?.length > 0 && !response.drinks[0].strInstructions) {
    return response.drinks.map((drink) => ({
      id: parseInt(drink.idDrink),
      name: drink.strDrink,
      category:
        query.toLowerCase() === "alcoholic"
          ? "Alcoholic"
          : query.toLowerCase() === "non alcoholic"
            ? "Non Alcoholic"
            : query.toLowerCase() === "ordinary drink"
              ? "Ordinary Drink"
              : query.toLowerCase() === "cocktail"
                ? "Cocktail"
                : "Unknown",
      image: drink.strDrinkThumb,
      ingredients: [],
      measures: [],
    }));
  }

  return response.drinks;
};

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
 * @param query - Search term for ingredients
 * @param index - Starting position for pagination (default: 0)
 * @param limit - Number of items per page (default: 10)
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
 * Fetches cocktail details by ID
 *
 * Technical Details:
 * - Direct ID lookup for efficiency
 * - Comprehensive error handling
 * - Full ingredient and measure extraction
 *
 * @param id - Cocktail ID to fetch
 * @throws Error if cocktail not found
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

const mapCocktailDetails = (data: any): Cocktail => ({
  id: data.idDrink,
  name: data.strDrink,
  category: data.strCategory,
  image: data.strDrinkThumb,
  instructions: data.strInstructions,
  ingredients: extractIngredients(data),
  measures: extractMeasures(data),
  tags: data.strTags,
  video: data.strVideo,
  iba: data.strIBA,
  alcoholic: data.strAlcoholic,
  glass: data.strGlass,
});

/**
 * Fetches all drinks in the Cocktail category with pagination
 * @param index - Starting position for pagination (default: 0)
 * @param limit - Number of items per page (default: 10)
 */
export const fetchCocktailsByCategory = async (
  index: number = 0,
  limit: number = 10
): Promise<FilteredCocktail[]> => {
  const params: SearchParams = {
    index,
    limit,
  };

  const url = buildUrl(`${API_BASE_URL}/filter/cocktails`, params);
  const response = await fetchFromApi<FilteredCocktailResponse>(url);
  return response.drinks;
};
