import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Home from "../Home";
import {
  fetchCocktails,
  fetchCocktailsByCategory,
} from "../../services/cocktails/cocktailService";

// Mock the service
jest.mock("../../services/cocktails/cocktailService");

// No need to mock react-router-dom here since it's in setupTests.ts
describe("Home Component", () => {
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

  const mockResponse = {
    drinks: [mockCocktail],
    totalCount: 20,
    pagination: { hasMore: true },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchCocktails as jest.Mock).mockResolvedValue(mockResponse);
    (fetchCocktailsByCategory as jest.Mock).mockResolvedValue(mockResponse);
  });

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
