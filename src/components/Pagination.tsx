/**
 * Pagination Component Module
 * Provides navigation controls for paginated content
 *
 * @module Pagination
 * @category Components
 * @subcategory UI Elements
 */

import nextIcon from "../assets/icons/Next-Icon.svg";
import prevIcon from "../assets/icons/Prev-Icon.svg";

/**
 * Props interface for the Pagination component
 * Defines the required properties for pagination functionality
 *
 * @interface PaginationProps
 * @property {number} index - Current page index (zero-based)
 * @property {number} limit - Number of items per page
 * @property {boolean} hasMore - Indicates if there are more items to load
 * @property {Function} onNext - Callback function for next page navigation
 * @property {Function} onPrevious - Callback function for previous page navigation
 * @property {number} currentPage - Current page number (one-based)
 * @property {number} totalPages - Total number of available pages
 * @property {boolean} isFirstPage - Indicates if currently on first page
 * @property {boolean} isLastPage - Indicates if currently on last page
 */
interface PaginationProps {
  index: number;
  limit: number;
  hasMore: boolean;
  onNext: () => void;
  onPrevious: () => void;
  currentPage: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

/**
 * Pagination Component
 * Renders navigation buttons for moving between pages
 *
 * Features:
 * - Previous/Next buttons with icons
 * - Disabled state styling
 * - Hover animations
 * - Accessibility support
 *
 * @component
 * @param {PaginationProps} props - Component properties
 * @returns {JSX.Element} Rendered pagination controls
 */
const Pagination = ({
  index,
  limit,
  hasMore,
  onNext,
  onPrevious,
}: PaginationProps) => {
  /**
   * Common button styling classes
   * Includes hover states and disabled styling
   */
  const buttonClasses =
    "p-2 border-1 border-pagination-border bg-pagination-button-bg text-white rounded-lg hover:bg-pagination-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-pagination";

  return (
    <div className="mt-8 flex items-center space-x-4">
      {/* Previous Page Button */}
      <button
        onClick={onPrevious}
        disabled={index === 0}
        className={buttonClasses}
        aria-label="Go to previous page"
      >
        <img src={prevIcon} alt="Previous" className="w-6 h-6" />
      </button>

      {/* Next Page Button */}
      <button
        onClick={onNext}
        disabled={!hasMore}
        className={buttonClasses}
        aria-label="Go to next page"
      >
        <img src={nextIcon} alt="Next" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Pagination;
