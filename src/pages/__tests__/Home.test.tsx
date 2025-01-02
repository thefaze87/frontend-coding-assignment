import { render, screen, waitFor, act } from "@testing-library/react";
import Home from "../Home";
import {
  fetchCocktails,
  fetchCocktailsByCategory,
} from "../../services/cocktails/cocktailService";

/**
 * Mock the cocktail service
 * Ensures consistent test behavior for API calls
 */
jest.mock("../../services/cocktails/cocktailService");

/**
 * Test suite for Home component
 * Tests the main landing page functionality
 */
describe("Home Component", () => {
  /**
   * Mock cocktail data representing a single drink
   * Contains all required fields for display testing
   */
  const mockCocktail = {
    id: 1,
    name: "Margarita",
    category: "Cocktail",
    image: "margarita.jpg",
    instructions: "Mix ingredients",
    ingredients: ["Tequila", "Lime", "Triple Sec"],
    measures: ["2 oz", "1 oz", "1 oz"],
    popular: false,
    tags: "",
    video: null,
    iba: null,
    alcoholic: "",
    glass: "",
  };

  /**
   * Mock API response with pagination
   * Simulates the structure returned by the cocktail service
   */
  const mockResponse = {
    drinks: [mockCocktail],
    totalCount: 20,
    pagination: { hasMore: true },
  };

  /**
   * Setup before each test
   * Resets mocks and configures default responses
   */
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchCocktails as jest.Mock).mockResolvedValue(mockResponse);
    (fetchCocktailsByCategory as jest.Mock).mockResolvedValue(mockResponse);
  });

  /**
   * Test initial render and data loading
   * Verifies component renders correctly with fetched data
   */
  it("renders without crashing", async () => {
    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(screen.getByText(/All Drinks/i)).toBeInTheDocument();
      expect(screen.getByText("Margarita")).toBeInTheDocument();
    });
  });
});
