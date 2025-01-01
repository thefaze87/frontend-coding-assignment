import React from "react";
import searchIcon from "../assets/icons/Search-Icon.svg";

/**
 * Props interface for the Header component
 * @property displayValue - Current value to show in the search input
 * @property onSearch - Callback function triggered when search input changes
 */
interface HeaderProps {
  displayValue: string;
  onSearch: (value: string) => void;
}

/**
 * Header component for the BarCraft application
 * Displays the app title, search bar, and search button
 *
 * @component
 * @param {HeaderProps} props - Component props
 * @param {string} props.displayValue - Current search input value
 * @param {function} props.onSearch - Handler for search input changes
 */
const Header = ({ displayValue, onSearch }: HeaderProps) => {
  return (
    <header className="border-b border-white/20 w-full">
      <div className="w-full px-8 py-4 flex justify-between items-center">
        {/* App Title */}
        <h1>BarCraft</h1>

        {/* Search Bar Container */}
        <div className="mx-auto flex items-center space-x-2 w-1/4 rounded-lg border border-white">
          {/* Search Icon */}
          <div className="px-4">
            <img src={searchIcon} alt="search" className="w-7 h-7" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={displayValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearch(e.target.value)
            }
            placeholder="Search for a cocktail"
            className="bg-transparent text-white placeholder-white w-full focus:outline-none"
          />

          {/* Search Button */}
          <button className="text-white flex-end ml-auto border-l border-white px-5 py-3">
            Go
          </button>
        </div>

        {/* Spacer for layout balance */}
        <div className="w-[180px]"></div>
      </div>
    </header>
  );
};

export default Header;
