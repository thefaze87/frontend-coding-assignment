/**
 * Express Server Configuration
 *
 * Architecture Overview:
 * - Acts as a proxy to CocktailDB API
 * - Provides normalized endpoints for frontend
 * - Handles data transformation and error cases
 * - Implements proper CORS and security measures
 *
 * Key Features:
 * - Search endpoint with pagination
 * - Filter endpoints for categories
 * - Detailed cocktail information
 * - Error handling and logging
 */

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

/**
 * Express server configuration for CocktailDB API proxy
 * Provides endpoints for:
 * - Searching cocktails
 * - Getting cocktail details
 * - Searching by first letter
 * - Getting popular cocktails
 * - Searching ingredients
 */

const app = express();
const port = 4000;

// Enable CORS for frontend requests
app.use(cors());
// Parse JSON request bodies
app.use(express.json());
// Remove warning listeners (helps with development noise)
process.removeAllListeners("warning");

// Base URL for the CocktailDB API
const COCKTAIL_DB_BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/**
 * Helper function to extract ingredients from CocktailDB response
 * CocktailDB stores ingredients in numbered properties (strIngredient1, strIngredient2, etc.)
 */
function getIngredients(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }
  return ingredients;
}

/**
 * Helper function to extract measurements from CocktailDB response
 * CocktailDB stores measurements in numbered properties (strMeasure1, strMeasure2, etc.)
 */
function getMeasures(drink) {
  const measures = [];
  for (let i = 1; i <= 15; i++) {
    const measure = drink[`strMeasure${i}`];
    if (measure) {
      measures.push(measure.trim());
    }
  }
  return measures;
}

/**
 * GET /api/cocktail/:id
 * Get detailed information about a specific cocktail
 *
 * @param {string} id - Cocktail ID from CocktailDB
 * @returns {Object} Formatted cocktail details
 * @throws {404} If cocktail not found
 * @throws {400} If ID is invalid
 * Provides better semantic values for the API
 */
app.get("/api/cocktail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Incoming request details:", {
      rawParams: req.params,
      rawUrl: req.url,
      id: id,
      idType: typeof id,
      fullUrl: req.protocol + "://" + req.get("host") + req.originalUrl,
    });

    // Validate ID
    if (!id || isNaN(Number(id))) {
      console.log("Invalid ID received:", id);
      return res.status(400).json({
        id: id,
        error: "Invalid cocktail ID",
        message: "The ID must be a valid number",
        debug: {
          receivedId: id,
          idType: typeof id,
          params: req.params,
          url: req.url,
        },
      });
    }

    // Request cocktail details from CocktailDB
    const cocktailDbUrl = `${COCKTAIL_DB_BASE_URL}/lookup.php?i=${id}`;
    console.log("Requesting from CocktailDB:", cocktailDbUrl);

    const response = await fetch(cocktailDbUrl);
    const data = await response.json();

    // Handle not found case
    if (!data.drinks || !data.drinks[0]) {
      console.log("No drink found for ID:", id);
      return res.status(404).json({
        id: id,
        error: "Cocktail not found",
        message:
          "This cocktail ID is not available in the CocktailDB database. Try IDs between 11000 and 15000 for best results.",
        suggestion:
          "Popular cocktails have IDs like: 11007 (Margarita), 11000 (Mojito), 11001 (Old Fashioned)",
      });
    }

    // Format the response data
    const drink = data.drinks[0];
    const formattedDrink = {
      id: parseInt(drink.idDrink),
      name: drink.strDrink,
      category: drink.strCategory,
      image: drink.strDrinkThumb,
      instructions: drink.strInstructions,
      ingredients: getIngredients(drink),
      measures: getMeasures(drink),
      tags: drink.strTags,
      video: drink.strVideo,
      iba: drink.strIBA,
      alcoholic: drink.strAlcoholic,
      glass: drink.strGlass,
    };

    res.json({ drink: formattedDrink });
  } catch (error) {
    console.error("Error fetching cocktail:", error);
    res.status(500).json({
      id: req.params.id,
      error: "Failed to fetch cocktail details",
    });
  }
});

/**
 * Search Endpoint
 *
 * Design Considerations:
 * - Supports both search and filter operations
 * - Implements pagination for large result sets
 * - Normalizes response format
 * - Handles edge cases (empty results, invalid params)
 *
 * @route GET /api/search
 * @param {string} query - Search term or filter category
 * @param {number} index - Pagination start index
 * @param {number} limit - Items per page
 */
app.get("/api/search", async (req, res) => {
  try {
    const { query = "", index = 0, limit = 10 } = req.query;
    console.log("Search params:", { query, index, limit });

    // Handle special filter cases
    const filterTerms = {
      alcoholic: "filter.php?a=Alcoholic",
      "non alcoholic": "filter.php?a=Non_Alcoholic",
      "ordinary drink": "filter.php?c=Ordinary_Drink",
      cocktail: "filter.php?c=Cocktail",
    };

    const searchTerm = query.toLowerCase();
    const filterUrl = filterTerms[searchTerm];

    // Use appropriate endpoint based on search term
    const searchUrl = filterUrl
      ? `${COCKTAIL_DB_BASE_URL}/${filterUrl}`
      : query
        ? `${COCKTAIL_DB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
        : `${COCKTAIL_DB_BASE_URL}/filter.php?c=Cocktail`;

    console.log("Searching CocktailDB:", searchUrl);

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.drinks) {
      return res.json({
        drinks: [],
        totalCount: 0,
        pagination: {
          currentPage: 0,
          totalPages: 0,
          pageSize: parseInt(limit),
          startIndex: parseInt(index),
          endIndex: parseInt(index),
          hasMore: false,
        },
      });
    }

    const drinks = data.drinks || [];
    const formattedDrinks = drinks.map((drink) =>
      query
        ? {
            id: parseInt(drink.idDrink),
            name: drink.strDrink,
            category: drink.strCategory,
            image: drink.strDrinkThumb,
            instructions: drink.strInstructions,
            ingredients: getIngredients(drink),
            measures: getMeasures(drink),
            tags: drink.strTags,
            video: drink.strVideo,
            iba: drink.strIBA,
            alcoholic: drink.strAlcoholic,
            glass: drink.strGlass,
          }
        : {
            id: parseInt(drink.idDrink),
            name: drink.strDrink,
            category: "Cocktail",
            image: drink.strDrinkThumb,
          }
    );

    // Handle pagination
    const startIdx = parseInt(index);
    const endIdx = startIdx + parseInt(limit);
    const paginatedDrinks = formattedDrinks.slice(startIdx, endIdx);

    res.json({
      drinks: paginatedDrinks,
      totalCount: drinks.length,
      pagination: {
        currentPage: Math.floor(startIdx / parseInt(limit)),
        totalPages: Math.ceil(drinks.length / parseInt(limit)),
        pageSize: parseInt(limit),
        startIndex: startIdx,
        endIndex: endIdx,
        hasMore: endIdx < drinks.length,
      },
    });
  } catch (error) {
    console.error("Error searching cocktails:", error);
    res.status(500).json({ error: "Failed to search cocktails" });
  }
});

/**
 * GET /api/filter/cocktails
 * Get all drinks in the Cocktail category
 */
app.get("/api/filter/cocktails", async (req, res) => {
  try {
    const { index = 0, limit = 10 } = req.query;
    const filterUrl = `${COCKTAIL_DB_BASE_URL}/filter.php?c=Cocktail`;
    console.log("Filtering cocktail category:", filterUrl);

    const response = await fetch(filterUrl);
    const data = await response.json();

    if (!data.drinks) {
      return res.json({
        drinks: [],
        totalCount: 0,
        pagination: {
          currentPage: 0,
          totalPages: 0,
          pageSize: parseInt(limit),
          startIndex: parseInt(index),
          endIndex: parseInt(index),
          hasMore: false,
        },
      });
    }

    const drinks = data.drinks || [];
    const formattedDrinks = drinks.map((drink) => ({
      id: parseInt(drink.idDrink),
      name: drink.strDrink,
      image: drink.strDrinkThumb,
    }));

    // Handle pagination
    const startIdx = parseInt(index);
    const endIdx = startIdx + parseInt(limit);
    const paginatedDrinks = formattedDrinks.slice(startIdx, endIdx);

    res.json({
      drinks: paginatedDrinks,
      totalCount: drinks.length,
      pagination: {
        currentPage: Math.floor(startIdx / parseInt(limit)),
        totalPages: Math.ceil(drinks.length / parseInt(limit)),
        pageSize: parseInt(limit),
        startIndex: startIdx,
        endIndex: endIdx,
        hasMore: endIdx < drinks.length,
      },
    });
  } catch (error) {
    console.error("Error fetching cocktail category:", error);
    res.status(500).json({ error: "Failed to fetch cocktail category" });
  }
});

// ... (other endpoints)

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
