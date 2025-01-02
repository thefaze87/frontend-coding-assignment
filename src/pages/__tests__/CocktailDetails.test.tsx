import { render, screen, waitFor } from "@testing-library/react";
import CocktailDetails from "../CocktailDetails";
import { fetchCocktailById } from "../../services/cocktails/cocktailService";

jest.mock("../../services/cocktails/cocktailService");
jest.mock("react-router-dom", () => ({
  useParams: () => ({
    id: "11007",
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: "/cocktail/11007",
    search: "",
    hash: "",
    state: null,
  }),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

describe("CocktailDetails Component", () => {
  const mockCocktail = {
    id: 11007,
    name: "Margarita",
    category: "Cocktail",
    image: "margarita.jpg",
    instructions: "Mix ingredients",
    ingredients: ["Tequila", "Lime", "Triple Sec"],
    measures: ["2 oz", "1 oz", "1 oz"],
    glass: "Cocktail glass",
    tags: "IBA,Classic",
    alcoholic: "Alcoholic",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchCocktailById as jest.Mock).mockResolvedValue(mockCocktail);
  });

  it("renders loading state initially", () => {
    (fetchCocktailById as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );
    render(<CocktailDetails />);
    expect(screen.getByAltText("Loading...")).toBeInTheDocument();
  });

  it("renders cocktail details after loading", async () => {
    render(<CocktailDetails />);

    await waitFor(() => {
      expect(screen.getByText("Margarita")).toBeInTheDocument();
      expect(screen.getByText("Instructions")).toBeInTheDocument();
      expect(screen.getByText("Mix ingredients")).toBeInTheDocument();
    });
  });

  it("renders error state when fetch fails", async () => {
    (fetchCocktailById as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );
    render(<CocktailDetails />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
    });
  });
});
