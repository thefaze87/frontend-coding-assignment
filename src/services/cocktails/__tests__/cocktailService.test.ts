/**
 * Cocktail Service Tests
 *
 * @maintainer Mark Fasel
 * @lastUpdated 2025-01-02
 */
import { fetchCocktails, fetchCocktailById } from "../cocktailService";
import { buildUrl, fetchFromApi } from "../../api/apiService";
import { CocktailResponse } from "../../types";

jest.mock("../../api/apiService");

describe("cocktailService", () => {
  const mockResponse: CocktailResponse = {
    drinks: [
      {
        id: 11007,
        name: "Margarita",
        category: "Ordinary Drink",
        image: "https://example.com/margarita.jpg",
        instructions: "Mix ingredients...",
        ingredients: ["Tequila", "Triple sec", "Lime juice"],
        measures: ["1 1/2 oz", "1/2 oz", "1 oz"],
      },
    ],
    totalCount: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchFromApi as jest.Mock).mockResolvedValue(mockResponse);
  });

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

    it("should fetch cocktails with pagination", async () => {
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

  describe("fetchCocktailById", () => {
    it("should fetch a single cocktail by ID", async () => {
      const mockDetailResponse = {
        drink: mockResponse.drinks[0],
      };
      (fetchFromApi as jest.Mock).mockResolvedValue(mockDetailResponse);

      const result = await fetchCocktailById(11007);

      expect(fetchFromApi).toHaveBeenCalledWith(
        "http://localhost:4000/api/cocktail/11007"
      );
      expect(result).toEqual(mockDetailResponse.drink);
    });

    it("should throw error when cocktail is not found", async () => {
      (fetchFromApi as jest.Mock).mockResolvedValue({ drink: null });

      await expect(fetchCocktailById(99999)).rejects.toThrow(
        "Cocktail with ID 99999 not found"
      );
    });
  });
});
