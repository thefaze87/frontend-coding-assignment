import "@testing-library/jest-dom";
import "jest-environment-jsdom";

/**
 * Mock Router Configuration
 * Provides mock implementations for all React Router DOM components and hooks
 * Used across all test files to simulate routing behavior
 */
const mockRouter = {
  /**
   * Mock BrowserRouter component
   * Simply renders children without actual routing logic
   */
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,

  /**
   * Mock MemoryRouter component
   * Used for testing routing state in isolation
   */
  MemoryRouter: ({ children }: { children: React.ReactNode }) => children,

  /**
   * Mock Routes component
   * Container for Route components
   */
  Routes: ({ children }: { children: React.ReactNode }) => children,

  /**
   * Mock Route component
   * Renders route element without path matching
   */
  Route: ({ element }: { element: React.ReactNode }) => element,

  /**
   * Mock Link component
   * Renders as plain text without navigation
   */
  Link: ({ children, to }: { children: React.ReactNode; to: string }) =>
    children,

  /**
   * Mock navigation hook
   * Returns a no-op function
   */
  useNavigate: () => jest.fn(),

  /**
   * Mock search parameters hook
   * Returns empty search params and update function
   */
  useSearchParams: () => [{ get: () => null }, jest.fn()],

  /**
   * Mock URL parameters hook
   * Returns empty params object
   */
  useParams: () => ({}),

  /**
   * Mock location hook
   * Returns default location object
   */
  useLocation: () => ({
    pathname: "/",
    search: "",
    hash: "",
    state: null,
  }),
};

/**
 * Apply router mocks globally
 * Makes router functionality available to all tests
 */
jest.mock("react-router-dom", () => mockRouter);

/**
 * Mock SVG imports
 * Replaces SVG files with string identifiers
 */
jest.mock("./assets/icons/spinner.svg", () => "spinner-icon");
