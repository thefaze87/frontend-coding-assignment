import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CocktailDetails from "./pages/CocktailDetails";
import Home from "./pages/Home";

/**
 * App Component
 * Defines the main application structure and routing configuration
 *
 * Routes:
 * - / : Home page with cocktail listing and search
 * - /cocktail/:id : Individual cocktail details page
 *
 * @returns {JSX.Element} The rendered application
 */
const App = () => {
  return (
    <Router>
      <div className="App min-h-screen">
        <Routes>
          {/* Home Route - Displays cocktail listing and search */}
          <Route path="/" element={<Home />} />

          {/* Cocktail Details Route - Displays individual cocktail information */}
          <Route path="/cocktail/:id" element={<CocktailDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
