/**
 * Express Server Application
 * Provides a RESTful API interface for cocktail data
 *
 * @module Server
 * @category Backend
 */

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

/**
 * Server Configuration Constants
 */
const app = express();
const port = 4000;
const COCKTAIL_DB_BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

/**
 * Middleware Setup
 * - CORS for cross-origin requests
 * - JSON parsing for request bodies
 * - Request logging for debugging
 */
app.use(cors());
app.use(express.json());
process.removeAllListeners("warning");

/**
 * Request Logger Middleware
 * Logs all incoming requests for debugging purposes
 */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/**
 * Data Extraction Utilities
 * Helper functions for processing CocktailDB responses
 */

/**
 * Extracts ingredient list from raw drink data
 * @param {Object} drink - Raw drink data from CocktailDB
 * @returns {string[]} Array of ingredient names
 */
function getIngredients(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    if (ingredient) ingredients.push(ingredient);
  }
  return ingredients;
}

/**
 * Extracts measurement list from raw drink data
 * @param {Object} drink - Raw drink data from CocktailDB
 * @returns {string[]} Array of measurements
 */
function getMeasures(drink) {
  const measures = [];
  for (let i = 1; i <= 15; i++) {
    const measure = drink[`strMeasure${i}`];
    if (measure) measures.push(measure.trim());
  }
  return measures;
}

/**
 * API Endpoints
 * RESTful routes for cocktail data access
 */

/**
 * GET /api/cocktail/:id
 * Fetches detailed information for a specific cocktail
 *
 * @param {string} id - Cocktail ID
 * @returns {Object} Formatted cocktail details
 * @throws {404} When cocktail is not found
 * @throws {400} When ID is invalid
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
 * GET /api/search
 * Searches cocktails with pagination support
 *
 * @param {string} query - Search term (optional)
 * @param {number} index - Pagination start index
 * @param {number} limit - Items per page
 * @returns {Object} Paginated search results
 */
app.get("/api/search", async (req, res) => {
  try {
    const { query = "", index = 0, limit = 10 } = req.query;
    console.log("Search params:", { query, index, limit });
    const searchUrl = query
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
 * GET /api/filter
 * Filters cocktails by category or alcohol content
 *
 * @param {string} type - Filter type ('category' or 'alcoholic')
 * @param {string} value - Filter value
 * @param {number} index - Pagination start index
 * @param {number} limit - Items per page
 * @returns {Object} Filtered and paginated results
 */
app.get("/api/filter", async (req, res) => {
  try {
    const { type, value, index = 0, limit = 10 } = req.query;
    let filterUrl;

    // Build the appropriate filter URL based on filter type
    if (type === "category") {
      filterUrl = `${COCKTAIL_DB_BASE_URL}/filter.php?c=${encodeURIComponent(value)}`;
    } else if (type === "alcoholic") {
      filterUrl = `${COCKTAIL_DB_BASE_URL}/filter.php?a=${encodeURIComponent(value)}`;
    } else {
      return res.status(400).json({
        error: "Invalid filter type",
        message: "Filter type must be either 'category' or 'alcoholic'",
      });
    }

    console.log("Filtering drinks:", { type, value, url: filterUrl });
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

    // Format and paginate results
    const startIdx = parseInt(index);
    const endIdx = startIdx + parseInt(limit);
    const paginatedDrinks = data.drinks
      .slice(startIdx, endIdx)
      .map((drink) => ({
        id: parseInt(drink.idDrink),
        name: drink.strDrink,
        image: drink.strDrinkThumb,
        category: type === "category" ? value : "",
        alcoholic: type === "alcoholic" ? value : "",
        instructions: "",
        ingredients: [],
        measures: [],
        glass: "",
        iba: null,
        video: null,
        tags: "",
      }));

    res.json({
      drinks: paginatedDrinks,
      totalCount: data.drinks.length,
      pagination: {
        currentPage: Math.floor(startIdx / parseInt(limit)),
        totalPages: Math.ceil(data.drinks.length / parseInt(limit)),
        pageSize: parseInt(limit),
        startIndex: startIdx,
        endIndex: endIdx,
        hasMore: endIdx < data.drinks.length,
      },
    });
  } catch (error) {
    console.error("Error filtering drinks:", error);
    res.status(500).json({
      error: "Failed to filter drinks",
      message: error.message,
    });
  }
});

/**
 * Shorthand Filter Routes
 * Convenience endpoints for common filter operations
 */
app.get("/api/filter/alcoholic", async (req, res) => {
  req.query.type = "alcoholic";
  req.query.value = "Alcoholic";
  await app.handle(req, res);
});

/**
 * GET /api/filter/non-alcoholic
 * Shorthand endpoint for non-alcoholic drinks
 */
app.get("/api/filter/non-alcoholic", async (req, res) => {
  req.query.type = "alcoholic";
  req.query.value = "Non_Alcoholic";
  await app.handle(req, res);
});

/**
 * GET /api/filter/ordinary-drink
 * Shorthand endpoint for ordinary drinks
 */
app.get("/api/filter/ordinary-drink", async (req, res) => {
  req.query.type = "category";
  req.query.value = "Ordinary_Drink";
  await app.handle(req, res);
});

/**
 * GET /api/filter/cocktail
 * Shorthand endpoint for cocktails
 */
app.get("/api/filter/cocktail", async (req, res) => {
  req.query.type = "category";
  req.query.value = "Cocktail";
  await app.handle(req, res);
});

/**
 * Server Initialization
 * Starts the Express server on the configured port
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
