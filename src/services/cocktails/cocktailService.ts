import { fetchFromApi, buildUrl } from "../api/apiService";
import { SearchParams, CocktailResponse, IngredientResponse } from "../types";

const API_BASE_URL = "http://localhost:4000/api";

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
