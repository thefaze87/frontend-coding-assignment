/**
 * Header Component Module
 * Provides the main navigation and search functionality for BarCraft
 *
 * @module Header
 * @category Components
 * @subcategory Navigation
 */

import React from "react";
import searchIcon from "../assets/icons/Search-Icon.svg";

/**
 * Props interface for the Header component
 * Defines the required properties for search functionality
 *
 * @interface HeaderProps
 * @property {string} displayValue - Current value to show in the search input
 * @property {function} onSearch - Callback function triggered when search is submitted
 */
interface HeaderProps {
  displayValue: string;
  onSearch: (value: string) => void;
}

/**
 * Header Component
 * Main navigation bar containing app title and search functionality
 *
 * Features:
 * - Responsive layout with balanced spacing
 * - Real-time search input handling
 * - Controlled form submission
 * - Visual search icon integration
 *
 * @component
 * @param {HeaderProps} props - Component properties
 */
const Header = ({ displayValue, onSearch }: HeaderProps) => {
  /** Local state for input value management */
  const [inputValue, setInputValue] = React.useState(displayValue);

  /**
   * Synchronize local input state with prop value
   * Ensures controlled component behavior
   */
  React.useEffect(() => {
    setInputValue(displayValue);
  }, [displayValue]);

  /**
   * Handle form submission
   * Prevents default form behavior and triggers search
   *
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <header className="border-b border-white/20 w-full">
      <div className="w-full px-8 py-4 flex justify-between items-center">
        {/* App Title Section */}
        <h1 className="w-1/3">BarCraft</h1>

        {/* Search Form Section */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex items-center space-x-2 w-1/4 rounded-lg border border-white"
          role="search"
          aria-label="Search drinks"
        >
          {/* Search Icon Container */}
          <div className="px-4">
            <img src={searchIcon} alt="search" className="w-7 h-7" />
          </div>

          {/* Search Input Field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            placeholder="Search all drinks"
            className="bg-transparent text-white placeholder-white w-full focus:outline-none"
            aria-label="Search input"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="text-white flex-end ml-auto border-l border-white px-5 py-3"
            aria-label="Submit search"
          >
            Go
          </button>
        </form>

        {/* Layout Balance Spacer */}
        <div className="w-1/3" aria-hidden="true"></div>
      </div>
    </header>
  );
};

export default Header;
