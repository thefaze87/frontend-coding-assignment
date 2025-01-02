import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders app header and title", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const headingElement = screen.getByText(/BarCraft/i);
  expect(headingElement).toBeInTheDocument();

  // Also verify the default view heading
  const defaultViewHeading = screen.getByText(/All Drinks/i);
  expect(defaultViewHeading).toBeInTheDocument();
});
