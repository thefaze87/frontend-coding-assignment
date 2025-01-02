import React from "react";
import nextIcon from "../assets/icons/Next-Icon.svg";
import prevIcon from "../assets/icons/Prev-Icon.svg";

/**
 * Props interface for the Pagination component
 * @property index - Current page index
 * @property limit - Items per page
 * @property hasMore - Whether there are more items to load
 * @property onNext - Handler for next page click
 * @property onPrevious - Handler for previous page click
 * @property currentPage - Current page number
 * @property totalPages - Total number of pages
 * @property isFirstPage - Whether the current page is the first page
 * @property isLastPage - Whether the current page is the last page
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
 * Pagination component for navigating through results
 * Displays previous and next buttons with hover animations
 *
 * @component
 */
const Pagination = ({
  index,
  limit,
  hasMore,
  onNext,
  onPrevious,
}: PaginationProps) => {
  const buttonClasses =
    "p-2 border-1 border-pagination-border bg-pagination-button-bg text-white rounded-lg hover:bg-pagination-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-pagination";

  return (
    <div className="mt-8 flex items-center space-x-4">
      {/* Previous Page Button */}
      <button
        onClick={onPrevious}
        disabled={index === 0}
        className={buttonClasses}
      >
        <img src={prevIcon} alt="Previous" className="w-6 h-6" />
      </button>

      {/* Next Page Button */}
      <button onClick={onNext} disabled={!hasMore} className={buttonClasses}>
        <img src={nextIcon} alt="Next" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Pagination;
