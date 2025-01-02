import {
  fetchCocktails,
  fetchCocktailsByLetter,
  fetchPopularCocktails,
  fetchCocktailsByCategory,
} from "../cocktailService";
import { fetchFromApi, buildUrl } from "../../api/apiService";
import { CocktailResponse } from "../types";

/**
 * Test suite for cocktailService
 * Tests the service layer that handles cocktail data fetching and processing
 */

/**
 * Mock the entire apiService module
 * This allows us to control API responses and verify correct URL construction
 */
jest.mock("../../api/apiService", () => ({
  fetchFromApi: jest.fn(),
  buildUrl: jest.fn((baseUrl, params) => {
    // Return a proper URL for testing
    const parts = [];
    if (params.query) parts.push(`query=${params.query}`);
    if (params.index !== undefined) parts.push(`index=${params.index}`);
    if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
    return parts.length ? `${baseUrl}?${parts.join("&")}` : baseUrl;
  }),
}));

describe("cocktailService", () => {
  /**
   * Mock response data used across tests
   * Represents a typical API response with one cocktail
   */
  const mockResponse: CocktailResponse = {
    drinks: [
      {
        id: 11007,
        name: "Margarita",
        category: "Ordinary Drink",
        image:
          "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
        instructions: "Rub the rim of the glass with the lime slice...",
        ingredients: ["Tequila", "Triple sec", "Lime juice", "Salt"],
        measures: ["1 1/2 oz", "1/2 oz", "1 oz", null],
      },
    ],
    totalCount: 1,
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
   * Test suite for fetchCocktails function
   * Tests search functionality with various parameters
   */
  describe("fetchCocktails", () => {
    it("should fetch cocktails with default parameters", async () => {
      const result = await fetchCocktails();

      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/search",
        {
          index: 0,
          limit: 10,
        }
      );
      expect(result).toEqual(mockResponse.drinks);
    });

    it("should fetch cocktails with search query", async () => {
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

    it("should fetch cocktails with custom pagination", async () => {
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
   * Test suite for fetchCocktailsByLetter function
   * Tests letter-based search functionality
   */
  describe("fetchCocktailsByLetter", () => {
    it("should fetch cocktails by first letter", async () => {
      const result = await fetchCocktailsByLetter("m");

      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/search/letter",
        {
          firstLetter: "m",
          index: 0,
          limit: 10,
        }
      );
      expect(result).toEqual(mockResponse.drinks);
    });

    it("should throw error for invalid letter parameter", async () => {
      await expect(fetchCocktailsByLetter("ab")).rejects.toThrow(
        "Letter parameter must be a single character"
      );
    });
  });

  /**
   * Test suite for fetchPopularCocktails function
   * Tests fetching of featured/popular cocktails
   */
  describe("fetchPopularCocktails", () => {
    it("should fetch popular cocktails with default parameters", async () => {
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

  describe("fetchCocktailsByCategory", () => {
    // Setup specific mock response for category filtering
    const categoryMockResponse = {
      drinks: [
        {
          id: 11007,
          name: "Margarita",
          image: "https://example.com/margarita.jpg",
        },
      ],
      totalCount: 1,
      pagination: {
        currentPage: 0,
        totalPages: 1,
        pageSize: 10,
        startIndex: 0,
        endIndex: 1,
        hasMore: false,
      },
    };

    beforeEach(() => {
      // Override the default mock for these specific tests
      (fetchFromApi as jest.Mock).mockResolvedValue(categoryMockResponse);
    });

    it("should fetch cocktails by category with pagination", async () => {
      const result = await fetchCocktailsByCategory();
      expect(result).toEqual(categoryMockResponse.drinks);
      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/filter/cocktails",
        {
          index: 0,
          limit: 10,
        }
      );
    });

    it("should handle empty response", async () => {
      const emptyResponse = {
        drinks: [],
        totalCount: 0,
        pagination: {
          currentPage: 0,
          totalPages: 0,
          pageSize: 10,
          startIndex: 0,
          endIndex: 0,
          hasMore: false,
        },
      };
      (fetchFromApi as jest.Mock).mockResolvedValue(emptyResponse);

      const result = await fetchCocktailsByCategory();
      expect(result).toEqual([]);
      expect(buildUrl).toHaveBeenCalledWith(
        "http://localhost:4000/api/filter/cocktails",
        {
          index: 0,
          limit: 10,
        }
      );
    });
  });
});
