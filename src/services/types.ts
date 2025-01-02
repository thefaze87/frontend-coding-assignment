/**
 * Core interfaces for the cocktail search application
 */

/**
 * Represents a single cocktail with all its details
 * Maps to TheCocktailDB's drink structure with our custom formatting
 */
export interface Cocktail {
  id: number; // Unique identifier for the cocktail
  name: string; // Name of the cocktail
  category: string; // Category (e.g., "Cocktail", "Ordinary Drink")
  image: string; // URL to the cocktail's image
  popular?: boolean; // Whether this is a popular/featured cocktail
  instructions?: string; // Step-by-step mixing instructions
  ingredients?: string[]; // Array of ingredient names
  measures?: string[]; // Array of measurements corresponding to ingredients
  tags?: string | null;
  video?: string | null;
  iba?: string | null;
  alcoholic?: string;
  glass?: string;
}

/**
 * API response structure for cocktail endpoints
 * Includes pagination metadata for list responses
 */
export interface CocktailResponse {
  drinks: Cocktail[]; // Array of cocktails matching the query
  totalCount: number; // Total number of results available
  pagination?: {
    // Optional pagination metadata
    currentPage: number; // Current page number (0-based)
    totalPages: number; // Total number of pages available
    pageSize: number; // Number of items per page
    startIndex: number; // Starting index of current page
    endIndex: number; // Ending index of current page
    hasMore: boolean; // Whether more results are available
  };
}

/**
 * Search parameters for API endpoints
 * Used to build query strings for requests
 */
export interface SearchParams {
  query?: string; // Text search query
  firstLetter?: string; // First letter filter for letter-based search
  index?: number; // Pagination start index
  limit?: number; // Number of items to return
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
