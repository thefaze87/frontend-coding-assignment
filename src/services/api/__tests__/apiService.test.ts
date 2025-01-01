import { buildUrl, fetchFromApi } from "../apiService";

/**
 * Test suite for the API service functionality
 * Covers URL building and API fetching for all endpoints:
 * - Cocktail search
 * - Letter-based search
 * - Ingredient search
 */
describe("apiService", () => {
  // Base URLs for different API endpoints used throughout tests
  const BASE_URL = "http://localhost:4000/api/search";
  const LETTER_URL = "http://localhost:4000/api/search/letter";
  const INGREDIENT_URL = "http://localhost:4000/api/ingredients/search";

  /**
   * Tests for the buildUrl function
   * Verifies correct URL construction for all endpoints and parameter combinations
   */
  describe("buildUrl", () => {
    /**
     * Tests for the main cocktail search endpoint
     * Verifies URL construction with various search parameters
     */
    describe("search endpoint", () => {
      it("should build URL with all parameters", () => {
        // Test complete URL with query and pagination
        const params = {
          query: "margarita",
          index: 0,
          limit: 10,
        };

        const url = buildUrl(BASE_URL, params);
        expect(url).toBe(
          "http://localhost:4000/api/search?query=margarita&index=0&limit=10"
        );
      });

      it("should build URL with only query", () => {
        // Test URL with just search query (no pagination)
        const params = {
          query: "mojito",
        };

        const url = buildUrl(BASE_URL, params);
        expect(url).toBe("http://localhost:4000/api/search?query=mojito");
      });

      it("should build URL with no parameters", () => {
        // Test base URL when no parameters provided
        const params = {};

        const url = buildUrl(BASE_URL, params);
        expect(url).toBe("http://localhost:4000/api/search");
      });

      it("should handle special characters in query", () => {
        // Test URL encoding of special characters
        const params = {
          query: "piña colada",
        };

        const url = buildUrl(BASE_URL, params);
        expect(url).toBe(
          "http://localhost:4000/api/search?query=pi%C3%B1a+colada"
        );
      });
    });

    /**
     * Tests for the letter-based search endpoint
     * Verifies URL construction for searching by first letter
     */
    describe("letter search endpoint", () => {
      it("should build letter search URL with all parameters", () => {
        // Test complete URL with letter and pagination
        const params = {
          firstLetter: "m",
          index: 0,
          limit: 10,
        };

        const url = buildUrl(LETTER_URL, params);
        expect(url).toBe(
          "http://localhost:4000/api/search/letter?firstLetter=m&index=0&limit=10"
        );
      });

      it("should build letter search URL with only firstLetter", () => {
        // Test URL with just letter parameter
        const params = {
          firstLetter: "a",
        };

        const url = buildUrl(LETTER_URL, params);
        expect(url).toBe(
          "http://localhost:4000/api/search/letter?firstLetter=a"
        );
      });

      it("should handle special characters in firstLetter", () => {
        // Test URL encoding of special characters in letter parameter
        const params = {
          firstLetter: "&",
          index: 0,
        };

        const url = buildUrl(LETTER_URL, params);
        expect(url).toBe(
          "http://localhost:4000/api/search/letter?firstLetter=%26&index=0"
        );
      });
    });

    /**
     * Tests for the ingredient search endpoint
     * Verifies URL construction for ingredient searches
     */
    describe("ingredient search", () => {
      it("should build ingredient search URL with all parameters", () => {
        // Test complete URL with ingredient search and pagination
        const params = {
          query: "vodka",
          index: 0,
          limit: 10,
        };

        const url = buildUrl(INGREDIENT_URL, params);
        expect(url).toBe(
          "http://localhost:4000/api/ingredients/search?query=vodka&index=0&limit=10"
        );
      });

      it("should build ingredient search URL with only query", () => {
        // Test URL with just ingredient query
        const params = {
          query: "gin",
        };

        const url = buildUrl(INGREDIENT_URL, params);
        expect(url).toBe(
          "http://localhost:4000/api/ingredients/search?query=gin"
        );
      });

      it("should handle special characters in ingredient query", () => {
        // Test URL encoding of special characters in ingredient names
        const params = {
          query: "vanilla vodka",
        };

        const url = buildUrl(INGREDIENT_URL, params);
        expect(url).toBe(
          "http://localhost:4000/api/ingredients/search?query=vanilla+vodka"
        );
      });
    });
  });

  /**
   * Tests for the fetchFromApi function
   * Verifies API calls, response handling, and error cases
   */
  describe("fetchFromApi", () => {
    beforeEach(() => {
      // Reset fetch mock before each test to ensure clean state
      global.fetch = jest.fn();
    });

    /**
     * Tests for successful API responses
     * Verifies proper handling of different response types
     */
    describe("successful responses", () => {
      it("should handle cocktail API responses", async () => {
        // Mock successful cocktail search response
        const mockResponse = {
          drinks: [{ id: 1, name: "Margarita" }],
          totalCount: 1,
        };

        // Configure mock to return success response
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await fetchFromApi(BASE_URL);
        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith(BASE_URL);
      });

      it("should handle ingredient API responses", async () => {
        // Mock successful ingredient search response
        const mockResponse = {
          ingredients: [{ id: 1, name: "Vodka" }],
          totalCount: 1,
        };

        // Configure mock to return success response
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await fetchFromApi(INGREDIENT_URL);
        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith(INGREDIENT_URL);
      });
    });

    /**
     * Tests for error handling
     * Verifies proper handling of API and network errors
     */
    describe("error handling", () => {
      it("should handle API errors", async () => {
        // Mock API error response (e.g., 404 Not Found)
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
          statusText: "Not Found",
        });

        await expect(fetchFromApi(BASE_URL)).rejects.toThrow(
          "Error: Not Found"
        );
      });

      it("should handle network errors", async () => {
        // Mock network failure
        global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

        await expect(fetchFromApi(BASE_URL)).rejects.toThrow("Network error");
      });
    });
  });
});
