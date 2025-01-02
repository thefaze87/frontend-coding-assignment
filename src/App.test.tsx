/**
 * App Component Tests
 *
 * @maintainer Mark Fasel
 * @lastUpdated 2025-01-02
 */
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Mock the Home component
jest.mock("./pages/Home", () => {
  return function MockHome() {
    return <div>Home Page</div>;
  };
});

describe("App Component", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
  });
});
