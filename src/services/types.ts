/**
 * Core Type Definitions for Cocktail Application
 *
 * Contains all shared interfaces and types used throughout the application:
 * - Data models (Cocktail)
 * - API responses
 * - Component props
 * - Utility types
 *
 * @maintainer Mark Fasel
 * @lastUpdated 2025-01-02
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
 * Generic paginated response wrapper
 * Used to standardize API responses that include pagination metadata
 *
 * @template T - The type of items being paginated
 */
export interface PaginatedResponse<T> {
  drinks: T[]; // Array of paginated items
  totalCount: number; // Total number of items available
  pagination: {
    currentPage: number; // Current page number (1-based)
    totalPages: number; // Total number of pages available
    pageSize: number; // Number of items per page
    startIndex: number; // Starting index of current page
    endIndex: number; // Ending index of current page
    hasMore: boolean; // Whether more pages exist
  };
}

/**
 * Extended Cocktail interface for filtered results
 * Adds required category and alcoholic properties
 * Used when displaying filtered cocktail lists
 */
export interface FilteredCocktail extends Cocktail {
  category: string; // Required category for filtered results
  alcoholic: string; // Required alcoholic status for filtered results
}

/**
 * Type aliases for specific response types
 * Improves code readability and type checking
 */
export interface CocktailResponse extends PaginatedResponse<Cocktail> {}
export interface FilteredResponse extends PaginatedResponse<FilteredCocktail> {}

/**
 * Props interface for Pagination component
 * Defines the contract for pagination controls
 *
 * Design Pattern: Controlled component
 * - Component receives all state from parent
 * - Actions are delegated to parent via callbacks
 * - No internal state management
 */
export interface PaginationProps {
  index: number; // Current starting index
  limit: number; // Items per page
  hasMore: boolean; // Whether more pages exist
  onNext: () => void; // Handler for next page
  onPrevious: () => void; // Handler for previous page
  currentPage: number; // Current page number (1-based)
  totalPages: number; // Total available pages
  isFirstPage: boolean; // Whether on first page
  isLastPage: boolean; // Whether on last page
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
