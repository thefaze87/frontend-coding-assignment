import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";
import {
  fetchCocktails,
  fetchCocktailsByCategory,
} from "../../services/cocktails/cocktailService";

jest.mock("../../services/cocktails/cocktailService");

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles filter searches correctly", async () => {
    const mockDrinks = [
      {
        id: 11007,
        name: "Margarita",
        category: "Alcoholic",
        image: "test.jpg",
      },
    ];

    (fetchCocktailsByCategory as jest.Mock).mockResolvedValueOnce([]);
    (fetchCocktails as jest.Mock).mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // Simulate async
      return mockDrinks;
    });

    render(
      <MemoryRouter initialEntries={[`/?q=alcoholic`]}>
        <Home />
      </MemoryRouter>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Margarita")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows loading state while fetching", async () => {
    (fetchCocktailsByCategory as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Loading...")).toBeInTheDocument();
  });

  it("shows no results message when no drinks found", async () => {
    (fetchCocktailsByCategory as jest.Mock).mockResolvedValueOnce([]);
    (fetchCocktails as jest.Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter initialEntries={[`/?q=nonexistent`]}>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No drinks found/i)).toBeInTheDocument();
    });
  });
});
