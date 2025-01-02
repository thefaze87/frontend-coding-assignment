/**
 * Core Cocktail Interface
 * Represents the complete data structure for a cocktail recipe
 */
export interface Cocktail {
  id: number;
  name: string;
  category: string;
  image: string;
  instructions: string;
  ingredients: string[];
  measures: string[];
  tags?: string;
  video?: string | null;
  iba?: string | null;
  alcoholic?: string;
  glass?: string;
}

/**
 * API Response for Cocktail Search Results
 * Used for paginated cocktail lists with full details
 * @property drinks - Array of complete cocktail objects
 * @property totalCount - Total number of results available
 * @property pagination - Metadata for handling paginated results
 */
export interface CocktailResponse {
  drinks: Cocktail[];
  totalCount: number;
  pagination: {
    hasMore: boolean;
  };
}

/**
 * API Response for Cocktail Details
 * Used when fetching a single cocktail's complete information
 * @property drink - Single cocktail object with full details
 */
export interface CocktailDetailsResponse {
  drink: Cocktail;
}

/**
 * API Response for Ingredient Search
 * Used when fetching ingredient lists
 * @property ingredients - Array of ingredient names
 * @property totalCount - Total number of ingredients available
 * @property pagination - Metadata for handling paginated results
 */
export interface IngredientResponse {
  ingredients: string[];
  totalCount: number;
  pagination: {
    hasMore: boolean;
  };
}

/**
 * Filtered Cocktail Interface
 * Represents a minimal version of cocktail data used in search results
 * Contains only essential display information
 */
export interface FilteredCocktail {
  id: number;
  name: string;
  image: string;
}

/**
 * API Response for Search and Filter Operations
 * Includes pagination metadata for list views
 * @property drinks - Array of simplified cocktail objects
 * @property totalCount - Total number of results available
 * @property pagination - Detailed pagination information
 */
export interface FilteredCocktailResponse {
  drinks: FilteredCocktail[];
  totalCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    startIndex: number;
    endIndex: number;
    hasMore: boolean;
  };
}

/**
 * Search Parameters Interface
 * Defines the possible parameters for API search requests
 * @property query - Optional search term for filtering results
 * @property index - Starting position for pagination
 * @property limit - Number of items per page
 * @property firstLetter - Filter by first letter of cocktail name
 */
export interface SearchParams {
  query?: string;
  index?: number;
  limit?: number;
  firstLetter?: string;
}
