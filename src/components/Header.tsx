import React from "react";
import searchIcon from "../assets/icons/Search-Icon.svg";
import { FILTER_CATEGORIES } from "../services/filters/filterService";

/**
 * Props interface for the Header component
 * @property displayValue - Current value to show in the search input
 * @property onSearch - Callback function triggered when search is submitted
 * @property activeFilter - Currently selected filter endpoint
 * @property onFilterChange - Callback function triggered when filter is changed
 */
interface HeaderProps {
  displayValue: string;
  onSearch: (value: string) => void;
  activeFilter: string | null;
  onFilterChange: (endpoint: string | null) => void;
}

/**
 * Header component for the BarCraft application
 * Displays the app title, search bar, and search button
 *
 * @component
 * @param {HeaderProps} props - Component props
 * @param {string} props.displayValue - Current search input value
 * @param {function} props.onSearch - Handler for search submission
 */
const Header = ({
  displayValue,
  onSearch,
  activeFilter,
  onFilterChange,
}: HeaderProps) => {
  const [inputValue, setInputValue] = React.useState(displayValue);

  // Update input value when displayValue prop changes
  React.useEffect(() => {
    setInputValue(displayValue);
  }, [displayValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <header className="border-b border-white/20 w-full">
      <div className="w-full px-8 py-4 flex flex-col space-y-4">
        {/* Top Row: Title and Search */}
        <div className="flex justify-between items-center">
          <h1 className="w-1/3">BarCraft</h1>

          {/* Search Bar Container */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex items-center space-x-2 w-1/4 rounded-lg border border-white"
          >
            {/* Search Icon */}
            <div className="px-4">
              <img src={searchIcon} alt="search" className="w-7 h-7" />
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              placeholder="Search all drinks"
              className="bg-transparent text-white placeholder-white w-full focus:outline-none"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="text-white flex-end ml-auto border-l border-white px-5 py-3"
            >
              Go
            </button>
          </form>

          {/* Spacer for layout balance */}
          <div className="w-1/3"></div>
        </div>

        {/* Bottom Row: Filter Buttons */}
        <div className="flex justify-center space-x-4">
          {FILTER_CATEGORIES.map(({ label, endpoint }) => (
            <button
              key={label}
              onClick={() => onFilterChange(endpoint)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === endpoint
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
