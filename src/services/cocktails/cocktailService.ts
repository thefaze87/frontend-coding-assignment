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
  console.log("Fetching from URL:", url); // Debug log
  const response = await fetchFromApi<CocktailResponse>(url);
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
