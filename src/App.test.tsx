/**
 * App Component Test Suite
 * Tests the root application component and its routing behavior
 *
 * @module App.test
 * @category Tests
 * @subcategory Component Tests
 */

import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/**
 * Mock Implementation
 * Provides a simplified version of the Home component for testing
 * Reduces test complexity by removing child component logic
 */
jest.mock("./pages/Home", () => {
  return function MockHome() {
    return <div>Home Page</div>;
  };
});

/**
 * App Component Test Suite
 * Verifies the basic rendering and routing functionality
 */
describe("App Component", () => {
  /**
   * Basic Render Test
   * Ensures the application renders without errors
   * Verifies the presence of the mocked Home component
   */
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
  });
});
