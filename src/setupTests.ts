import "@testing-library/jest-dom";
import "jest-environment-jsdom";

const mockRouter = {
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  MemoryRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ element }: { element: React.ReactNode }) => element,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) =>
    children,
  useNavigate: () => jest.fn(),
  useSearchParams: () => [{ get: () => null }, jest.fn()],
  useParams: () => ({}),
  useLocation: () => ({ pathname: "/", search: "", hash: "", state: null }),
};

jest.mock("react-router-dom", () => mockRouter);

// Mock SVG imports
jest.mock("./assets/icons/spinner.svg", () => "spinner-icon");
