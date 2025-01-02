import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../../../components/Header";

describe("Header", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search suggestions", () => {
    render(<Header displayValue="" onSearch={mockOnSearch} />);

    expect(screen.getByText(/Try:/)).toBeInTheDocument();
    expect(screen.getByText(/Alcoholic/)).toBeInTheDocument();
    expect(screen.getByText(/Non Alcoholic/)).toBeInTheDocument();
    expect(screen.getByText(/Ordinary Drink/)).toBeInTheDocument();
    expect(screen.getByText(/Cocktail/)).toBeInTheDocument();
  });

  it("handles filter term searches", () => {
    render(<Header displayValue="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Search all drinks/i);
    fireEvent.change(input, { target: { value: "Alcoholic" } });
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockOnSearch).toHaveBeenCalledWith("Alcoholic");
  });

  it("updates input value when displayValue prop changes", () => {
    const { rerender } = render(
      <Header displayValue="" onSearch={mockOnSearch} />
    );
    const input = screen.getByPlaceholderText(/Search all drinks/i);

    rerender(<Header displayValue="Margarita" onSearch={mockOnSearch} />);
    expect(input).toHaveValue("Margarita");
  });
});
