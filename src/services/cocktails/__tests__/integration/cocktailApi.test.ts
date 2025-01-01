/**
 * Cocktail API Integration Test Suite
 *
 * This test suite verifies the integration between our frontend services
 * and the backend API. It covers:
 * 1. Cocktail search functionality
 * 2. Letter-based cocktail search
 * 3. Ingredient search
 * 4. Popular cocktails retrieval
 *
 * Each endpoint is tested for:
 * - Successful responses
 * - Error handling
 * - Parameter validation
 * - Response structure
 */

import { buildUrl, fetchFromApi } from "../../../api/apiService";
import {
  fetchCocktails,
  fetchCocktailsByLetter,
  fetchIngredients,
  fetchPopularCocktails,
} from "../../cocktailService";

// Mock the API service functions
jest.mock("../../../api/apiService", () => ({
  buildUrl: jest.fn(),
  fetchFromApi: jest.fn(),
}));

describe("Cocktail API Integration", () => {
  /**
   * Mock response data used across tests
   * Represents the standard structure of API responses
   */
  const mockResponse = {
    drinks: [
      {
        id: 1,
        name: "Margarita",
        category: "Cocktail",
        image: "margarita.jpg",
        instructions: "Mix ingredients",
        ingredients: ["Tequila", "Lime", "Triple Sec"],
        measures: ["2 oz", "1 oz", "1 oz"],
      },
    ],
    totalCount: 1,
    pagination: {
      currentPage: 0,
      totalPages: 1,
      pageSize: 10,
      startIndex: 0,
      endIndex: 0,
      hasMore: false,
    },
  };

  /**
   * Reset all mocks before each test
   * Ensures clean state for accurate testing
   */
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchFromApi as jest.Mock).mockResolvedValue(mockResponse);
  });

  /**
   * Cocktail Search Tests
   * Tests the main cocktail search functionality
   */
  describe("fetchCocktails", () => {
    it("should fetch cocktails with default parameters", async () => {
      // Test default search behavior (no parameters)
      const result = await fetchCocktails();

      // Verify URL construction
      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/search",
        {
          index: 0,
          limit: 10,
        }
      );

      // Verify response handling
      expect(result).toEqual(mockResponse.drinks);
    });

    it("should fetch cocktails with search query", async () => {
      // Test search with specific query
      const result = await fetchCocktails("margarita");

      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/search",
        {
          query: "margarita",
          index: 0,
          limit: 10,
        }
      );
      expect(result).toEqual(mockResponse.drinks);
    });

    it("should fetch cocktails with pagination", async () => {
      // Test search with custom pagination
      const result = await fetchCocktails("", 20, 30);

      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/search",
        {
          index: 20,
          limit: 30,
        }
      );
      expect(result).toEqual(mockResponse.drinks);
    });
  });

  /**
   * Letter-based Search Tests
   * Tests searching cocktails by their first letter
   */
  describe("fetchCocktailsByLetter", () => {
    it("should fetch cocktails by first letter", async () => {
      // Test letter-based search
      const result = await fetchCocktailsByLetter("a");

      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/search/letter",
        {
          firstLetter: "a",
          index: 0,
          limit: 10,
        }
      );
      expect(result).toEqual(mockResponse.drinks);
    });

    it("should throw error for invalid letter parameter", async () => {
      // Test validation of letter parameter
      await expect(fetchCocktailsByLetter("ab")).rejects.toThrow(
        "Letter parameter must be a single character"
      );
    });
  });

  /**
   * Ingredient Search Tests
   * Tests the ingredient search functionality
   */
  describe("fetchIngredients", () => {
    const mockIngredientResponse = {
      ingredients: [
        {
          id: 1,
          name: "Vodka",
          description: "Clear spirit",
          type: "Spirit",
          alcohol: true,
          abv: "40",
        },
      ],
      totalCount: 1,
    };

    beforeEach(() => {
      (fetchFromApi as jest.Mock).mockResolvedValue(mockIngredientResponse);
    });

    it("should fetch ingredients with search query", async () => {
      // Test ingredient search with query
      const result = await fetchIngredients("vodka");

      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/ingredients/search",
        {
          query: "vodka",
          index: 0,
          limit: 10,
        }
      );
      expect(result).toEqual(mockIngredientResponse.ingredients);
    });

    it("should handle empty results", async () => {
      // Test handling of no results
      const emptyResponse = { ingredients: [], totalCount: 0 };
      (fetchFromApi as jest.Mock).mockResolvedValueOnce(emptyResponse);

      const result = await fetchIngredients("nonexistent");
      expect(result).toEqual([]);
    });
  });

  /**
   * Popular Cocktails Tests
   * Tests fetching of popular/featured cocktails
   */
  describe("fetchPopularCocktails", () => {
    it("should fetch popular cocktails with default parameters", async () => {
      // Test default popular cocktails fetch
      const result = await fetchPopularCocktails();

      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/popular",
        {
          index: 0,
          limit: 10,
        }
      );
      expect(result).toEqual(mockResponse.drinks);
    });

    it("should fetch popular cocktails with custom pagination", async () => {
      // Test popular cocktails with pagination
      const result = await fetchPopularCocktails(20, 30);

      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/popular",
        {
          index: 20,
          limit: 30,
        }
      );
      expect(result).toEqual(mockResponse.drinks);
    });
  });
});
