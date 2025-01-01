import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders cocktail search heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/cocktail search/i);
  expect(headingElement).toBeInTheDocument();
});
