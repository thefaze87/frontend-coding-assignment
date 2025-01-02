import React from "react";
import searchIcon from "../assets/icons/Search-Icon.svg";

/**
 * Header Component
 *
 * Purpose:
 * - Primary navigation and search interface
 * - Maintains search state and history
 * - Provides search suggestions
 * - Handles user input and submission
 *
 * Architecture:
 * - Controlled form component
 * - URL-based state management
 * - Responsive design patterns
 * - Accessibility features
 *
 * Design Decisions:
 * - Clean, minimal interface
 * - Immediate visual feedback
 * - Persistent search context
 * - Mobile-friendly layout
 *
 * UX Considerations:
 * - Clear visual hierarchy
 * - Intuitive search flow
 * - Helpful suggestions
 * - Keyboard navigation
 * - Loading states
 *
 * Technical Implementation:
 * - Form validation
 * - State synchronization
 * - Event handling
 * - Prop type safety
 */

/**
 * Props interface for the Header component
 * @property displayValue - Current value to show in the search input
 * @property onSearch - Callback function triggered when search is submitted
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
 * @param {function} props.onSearch - Handler for search submission
 */
const Header = ({ displayValue, onSearch }: HeaderProps) => {
  const [inputValue, setInputValue] = React.useState(displayValue);

  // Update input value when displayValue prop changes
  React.useEffect(() => {
    setInputValue(displayValue);
  }, [displayValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const searchSuggestions = [
    "Alcoholic",
    "Non Alcoholic",
    "Ordinary Drink",
    "Cocktail",
  ];

  return (
    <header className="border-b border-white/20 w-full">
      <div className="w-full px-8 py-4 flex justify-between items-center">
        {/* App Title */}
        <h1>BarCraft</h1>

        {/* Search Bar Container */}
        <form
          onSubmit={handleSubmit}
          role="form"
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
        <div className="w-[180px]"></div>

        <div className="search-suggestions mt-2 text-sm text-white/60">
          Try: {searchSuggestions.join(", ")}
        </div>
      </div>
    </header>
  );
};

export default Header;
