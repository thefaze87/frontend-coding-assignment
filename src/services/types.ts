/**
 * Type Definitions
 *
 * Purpose:
 * - Define core data structures
 * - Ensure type safety across application
 * - Document data relationships
 * - Provide interface consistency
 *
 * Design Decisions:
 * - Separate response and domain types
 * - Strict null handling
 * - Optional field management
 * - Clear type hierarchies
 */

/**
 * Search Parameters
 * Used for API requests that support pagination and filtering
 */
export interface SearchParams {
  query?: string;
  index?: number;
  limit?: number;
  firstLetter?: string;
}

/**
 * Cocktail Domain Model
 * Core business object representing a cocktail
 */
export interface Cocktail {
  id: number;
  name: string;
  category: string;
  image: string;
  instructions?: string;
  ingredients: string[];
  measures: string[];
  tags?: string;
  video?: string;
  iba?: string;
  alcoholic?: string;
  glass?: string;
}

/**
 * API response structure for cocktail endpoints
 * Includes pagination metadata for list responses
 */
export interface CocktailResponse {
  drinks: RawCocktailResponse[];
  totalCount: number;
}

/**
 * Represents a single ingredient with its details
 * Maps to TheCocktailDB's ingredient structure
 */
export interface Ingredient {
  id: number; // Unique identifier for the ingredient
  name: string; // Name of the ingredient
  description: string | null; // Description/information about the ingredient
  type: string | null; // Type of ingredient (e.g., "Spirit", "Liqueur")
  alcohol: boolean; // Whether the ingredient contains alcohol
  abv: string | null; // Alcohol by volume percentage
}

/**
 * API response structure for ingredient endpoints
 * Follows same pattern as CocktailResponse
 */
export interface IngredientResponse {
  ingredients: Ingredient[]; // Array of ingredients matching the query
  totalCount: number; // Total number of results available
  pagination: {
    // Pagination metadata
    currentPage: number; // Current page number (0-based)
    totalPages: number; // Total number of pages available
    pageSize: number; // Number of items per page
    startIndex: number; // Starting index of current page
    endIndex: number; // Ending index of current page
    hasMore: boolean; // Whether more results are available
  };
}

export interface CocktailDetailsResponse {
  drink: Cocktail;
}

/**
 * Represents a filtered cocktail with minimal details
 */
export interface FilteredCocktail {
  id: number;
  name: string;
  image: string;
}

/**
 * API response structure for filtered cocktail endpoints
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

export interface RawCocktailResponse {
  idDrink: string;
  strDrink: string;
  strCategory: string;
  strDrinkThumb: string;
  strInstructions: string;
  // ... other raw properties from API
}
