import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CocktailDetails from "./pages/CocktailDetails";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <div className="App min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cocktail/:id" element={<CocktailDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
