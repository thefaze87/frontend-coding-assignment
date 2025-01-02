import React from "react";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
import CocktailDetails from "./pages/CocktailDetails";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cocktail/:id" element={<CocktailDetails />} />
      </Routes>
    </div>
  );
};

export default App;
