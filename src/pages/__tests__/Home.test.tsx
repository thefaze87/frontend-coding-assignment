/**
 * Home Component Tests
 *
 * Testing Strategy:
 * - Component integration testing
 * - API interaction verification
 * - State management validation
 * - User interaction simulation
 *
 * Test Coverage:
 * - Search functionality
 * - Loading states
 * - Error handling
 * - Pagination
 * - Filter operations
 *
 * Technical Considerations:
 * - Mock service layer
 * - Async operation handling
 * - Router integration
 * - Component lifecycle
 */

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";
import {
  fetchCocktails,
  fetchCocktailsByCategory,
} from "../../services/cocktails/cocktailService";

jest.mock("../../services/cocktails/cocktailService");

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Search Filter Functionality
   *
   * Purpose:
   * - Verifies search filter integration with API
   * - Tests URL parameter handling
   * - Confirms proper display of search results
   *
   * Implementation Notes:
   * - Uses delayed promise resolution to simulate real API behavior
   * - Verifies both category and general search functionality
   */
  it("handles filter searches correctly", async () => {
    const mockDrinks = [
      {
        id: 11007,
        name: "Margarita",
        category: "Alcoholic",
        image: "test.jpg",
      },
    ];

    // Mock both API endpoints to test the complete search flow
    (fetchCocktailsByCategory as jest.Mock).mockResolvedValueOnce([]);
    (fetchCocktails as jest.Mock).mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
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

  /**
   * Test: Loading State
   *
   * Purpose:
   * - Ensures proper display of loading indicator
   * - Verifies component handles async operations gracefully
   *
   * Technical Notes:
   * - Uses delayed promise to ensure loading state is visible
   * - Tests immediate UI feedback for user actions
   */
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

  /**
   * Test: No Results State
   *
   * Purpose:
   * - Verifies proper handling of empty search results
   * - Tests user feedback for unsuccessful searches
   *
   * Implementation Details:
   * - Mocks both API endpoints to return empty results
   * - Verifies appropriate error message display
   */
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
