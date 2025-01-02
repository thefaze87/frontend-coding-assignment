/**
 * CocktailCard Component Module
 * Displays individual cocktail preview cards with image and basic information
 *
 * @module CocktailCard
 * @category Components
 * @subcategory Display
 */

import { Link, useSearchParams } from "react-router-dom";
import loaderIcon from "../../assets/icons/spinner.svg";
import { Cocktail } from "../../services/types";
import "./CocktailCard.scss";

/**
 * Props interface for the CocktailCard component
 *
 * @interface CocktailCardProps
 * @property {Cocktail} cocktail - Cocktail data to display in the card
 * @property {boolean} [loading] - Optional loading state flag
 */
interface CocktailCardProps {
  cocktail: Cocktail;
  loading?: boolean;
}

/**
 * CocktailCard Component
 * Renders a card displaying cocktail preview information
 *
 * Features:
 * - Responsive image display
 * - Loading state handling
 * - Search context preservation in navigation
 * - Hover effects and transitions
 * - Accessible link structure
 *
 * @component
 * @param {CocktailCardProps} props - Component properties
 */
const CocktailCard = ({ cocktail, loading = false }: CocktailCardProps) => {
  /** Get current search parameters for navigation context */
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q");

  /**
   * Loading State View
   * Displays a spinner while content is loading
   */
  if (loading) {
    return (
      <div className="cocktail-card border-1 border-white rounded-lg shadow overflow-hidden p-4 h-48 flex items-center justify-center">
        <img
          src={loaderIcon}
          alt="Loading..."
          className="w-8 h-8 loading-icon"
          role="status"
        />
      </div>
    );
  }

  /**
   * Main Card View
   * Displays cocktail information with link to details
   */
  return (
    <Link
      to={
        currentQuery
          ? `/cocktail/${cocktail.id}?q=${encodeURIComponent(currentQuery)}`
          : `/cocktail/${cocktail.id}`
      }
      className="block"
      aria-label={`View details for ${cocktail.name}`}
    >
      <div className="cocktail-card border-1 border-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 flex items-start space-x-2 p-4">
        {/* Cocktail Image */}
        <img
          src={cocktail.image}
          alt={cocktail.name}
          className="w-36 h-36 object-cover"
        />

        {/* Cocktail Information */}
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
