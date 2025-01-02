/**
 * Filter Service
 * Manages cocktail filtering operations
 */

import { fetchFromApi } from "../api/apiService";
import { FilteredResponse } from "../types";

const API_BASE_URL = "http://localhost:4000/api";

export const FILTER_CATEGORIES = [
  { label: "All Drinks", endpoint: "search" },
  { label: "Alcoholic", endpoint: "filter/alcoholic" },
  { label: "Non-Alcoholic", endpoint: "filter/non-alcoholic" },
  { label: "Ordinary Drinks", endpoint: "filter/ordinary-drink" },
  { label: "Cocktails", endpoint: "filter/cocktail" },
] as const;

export const fetchFilteredCocktails = async (
  endpoint: string | null,
  index: number = 0,
  limit: number = 10
): Promise<FilteredResponse> => {
  const finalEndpoint = endpoint || "search";
  return fetchFromApi<FilteredResponse>(
    `${API_BASE_URL}/${finalEndpoint}?index=${index}&limit=${limit}`
  );
};
