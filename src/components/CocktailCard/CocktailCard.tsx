import { Link, useSearchParams } from "react-router-dom";
import loaderIcon from "../../assets/icons/spinner.svg";
import { Cocktail } from "../../services/types";
import "./CocktailCard.scss";

/**
 * CocktailCard component displays a preview of a cocktail
 * Features:
 * - Displays cocktail image, name, and category
 * - Links to detailed view while preserving search context
 * - Includes hover effects for better UX
 * - Shows loading state with spinner while data loads
 *
 * @param {CocktailCardProps} props - Component props
 * @param {Cocktail} props.cocktail - Cocktail data to display
 * @param {boolean} props.loading - Whether the cocktail data is loading
 */
interface CocktailCardProps {
  cocktail: Cocktail;
  loading?: boolean;
}

const CocktailCard = ({ cocktail, loading = false }: CocktailCardProps) => {
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q");

  if (loading) {
    return (
      <div className="cocktail-card border-1 border-white rounded-lg shadow overflow-hidden p-4 h-48 flex items-center justify-center">
        <img
          src={loaderIcon}
          alt="Loading..."
          className="w-8 h-8 loading-icon"
        />
      </div>
    );
  }

  return (
    <Link
      to={
        currentQuery
          ? `/cocktail/${cocktail.id}?q=${encodeURIComponent(currentQuery)}`
          : `/cocktail/${cocktail.id}`
      }
      className="block"
    >
      <div className="cocktail-card border-1 border-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 flex items-start space-x-2 p-4">
        <img
          src={cocktail.image}
          alt={cocktail.name}
          className="w-36 h-36 object-cover"
        />

        <div className="p-4 w-full flex flex-col justify-between space-y-4">
          <h3 className="cocktail-name text-lg text-whit">{cocktail.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="cocktail-category rounded-lg px-2 py-2 border-1 border-white">
              {cocktail.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CocktailCard;
