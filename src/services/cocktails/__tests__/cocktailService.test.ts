import { fetchCocktails, fetchCocktailById } from "../cocktailService";
import { buildUrl } from "../../api/apiService";
import { fetchFromApi } from "../../api/apiService";

// Mock the API service
jest.mock("../../api/apiService", () => ({
  buildUrl: jest.fn(),
  fetchFromApi: jest.fn(),
}));

/**
 * Test suite for the Cocktail Service
 * Tests the business logic layer that interfaces with the cocktail API
 */
describe("cocktailService", () => {
  /**
   * Mock cocktail data representing a standard drink response
   * Includes all required fields for testing cocktail operations
   */
  const mockDrink = {
    id: 11007,
    name: "Margarita",
    category: "Ordinary Drink",
    image: "https://example.com/margarita.jpg",
    instructions: "Mix ingredients...",
    ingredients: ["Tequila", "Triple sec", "Lime juice"],
    measures: ["1 1/2 oz", "1/2 oz", "1 oz"],
  };

  /**
   * Mock paginated response matching the API's response structure
   * Used for testing endpoints that return multiple cocktails
   */
  const mockResponse = {
    drinks: [mockDrink],
    totalCount: 1,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      startIndex: 0,
      endIndex: 9,
      hasMore: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (buildUrl as jest.Mock).mockReturnValue("http://localhost:4000/api/search");
    (fetchFromApi as jest.Mock).mockResolvedValue(mockResponse);
  });

  /**
   * Tests for the main cocktail search functionality
   * Verifies proper handling of search parameters and response parsing
   */
  describe("fetchCocktails", () => {
    it("should fetch cocktails with default parameters", async () => {
      const result = await fetchCocktails();
      expect(fetchFromApi).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  /**
   * Tests for fetching individual cocktail details
   * Verifies proper error handling and response transformation
   */
  describe("fetchCocktailById", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should fetch a single cocktail by ID", async () => {
      const mockDetailResponse = {
        drink: mockResponse.drinks[0],
      };
      (fetchFromApi as jest.Mock).mockResolvedValue(mockDetailResponse);
      const result = await fetchCocktailById(11007);
      expect(result).toEqual(mockDetailResponse.drink);
    });

    it("should throw error when cocktail is not found", async () => {
      (fetchFromApi as jest.Mock).mockResolvedValue({ drink: null });
      await expect(fetchCocktailById(99999)).rejects.toThrow(
        "Cocktail with ID 99999 not found"
      );
    });
  });

  /**
   * Tests for error handling across all service functions
   * Verifies proper error propagation and logging
   */
  describe("Error handling", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should handle API errors gracefully", async () => {
      (fetchFromApi as jest.Mock).mockRejectedValue(new Error("API Error"));
      await expect(fetchCocktails()).rejects.toThrow("API Error");
    });

    it("should handle malformed responses", async () => {
      const mockNullResponse = {
        drinks: null,
        totalCount: 0,
        pagination: {
          hasMore: false,
        },
      };
      (fetchFromApi as jest.Mock).mockResolvedValue(mockNullResponse);
      const result = await fetchCocktails();
      expect(result).toEqual(mockNullResponse);
    });
  });
});
