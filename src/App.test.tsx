/**
 * App Component Tests
 *
 * @maintainer Mark Fasel
 * @lastUpdated 2025-01-02
 */
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders the application header", () => {
    render(<App />);
    const headerElement = screen.getByText(/BarCraft/i);
    expect(headerElement).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Search all drinks/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders the main content area", () => {
    render(<App />);
    const mainHeading = screen.getByText(/All Drinks/i);
    expect(mainHeading).toBeInTheDocument();
  });
});
