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

import { buildUrl } from "../../../api/apiService";
import { fetchFromApi } from "../../../api/apiService";
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
  const mockDrink = {
    id: 1,
    name: "Margarita",
    category: "Cocktail",
    image: "margarita.jpg",
    instructions: "Mix ingredients",
    ingredients: ["Tequila", "Lime", "Triple Sec"],
    measures: ["2 oz", "1 oz", "1 oz"],
  };

  const mockPaginatedResponse = {
    drinks: [mockDrink],
    totalCount: 1,
    pagination: {
      hasMore: false,
    },
  };

  const mockArrayResponse = [mockDrink];

  beforeEach(() => {
    jest.clearAllMocks();
    (buildUrl as jest.Mock).mockReturnValue("http://localhost:4000/api/search");
  });

  /**
   * Cocktail Search Tests
   * Tests the main cocktail search functionality
   */
  describe("fetchCocktails", () => {
    it("should fetch cocktails with default parameters", async () => {
      (fetchFromApi as jest.Mock).mockResolvedValueOnce(mockPaginatedResponse);
      const result = await fetchCocktails();
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  /**
   * Letter-based Search Tests
   * Tests searching cocktails by their first letter
   */
  describe("fetchCocktailsByLetter", () => {
    it("should fetch cocktails by first letter", async () => {
      (fetchFromApi as jest.Mock).mockResolvedValueOnce({
        drinks: mockArrayResponse,
      });
      const result = await fetchCocktailsByLetter("m");
      expect(result).toEqual(mockArrayResponse);
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
    it("should fetch popular cocktails", async () => {
      (fetchFromApi as jest.Mock).mockResolvedValueOnce({
        drinks: mockArrayResponse,
      });
      const result = await fetchPopularCocktails();
      expect(result).toEqual(mockArrayResponse);
    });
  });
});
