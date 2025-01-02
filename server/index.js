import express from "express";
import cors from "cors";
import fetch from "node-fetch";

/**
 * Express Server - CocktailDB API Proxy
 *
 * Provides a clean API interface between frontend and CocktailDB:
 * - Standardized response formats
 * - Error handling
 * - Request logging
 * - CORS support
 * - Pagination
 *
 * Design Pattern: RESTful API with middleware
 * Error Handling: Consistent error responses
 * Performance: Response formatting on server
 *
 * @maintainer Mark Fasel
 * @lastUpdated 2025-01-02
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
 * GET /api/search
 * Search cocktails by name
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

/**
 * Filter Endpoint
 * Handles cocktail filtering by category and alcohol content
 *
 * Design Decisions:
 * - Single endpoint with type parameter for flexibility
 * - Server-side pagination for performance
 * - Consistent response structure
 * - Error boundary implementation
 *
 * @route GET /api/filter
 * @param {string} type - Filter type ('category' or 'alcoholic')
 * @param {string} value - Filter value
 * @param {number} index - Pagination start index
 * @param {number} limit - Items per page
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
 * Shorthand Filter Endpoints
 */
app.get("/api/filter/alcoholic", async (req, res) => {
  try {
    const { index = 0, limit = 10 } = req.query;
    const filterUrl = `${COCKTAIL_DB_BASE_URL}/filter.php?a=Alcoholic`;

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
        alcoholic: "Alcoholic",
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
    res.status(500).json({ error: "Failed to filter drinks" });
  }
});

app.get("/api/filter/non-alcoholic", async (req, res) => {
  const newReq = {
    ...req,
    url: "/api/filter",
    query: {
      ...req.query,
      type: "alcoholic",
      value: "Non_Alcoholic",
    },
  };
  app.handle(newReq, res);
});

app.get("/api/filter/ordinary-drink", async (req, res) => {
  const newReq = {
    ...req,
    url: "/api/filter",
    query: {
      ...req.query,
      type: "category",
      value: "Ordinary_Drink",
    },
  };
  app.handle(newReq, res);
});

app.get("/api/filter/cocktail", async (req, res) => {
  try {
    const { index = 0, limit = 10 } = req.query;
    const filterUrl = `${COCKTAIL_DB_BASE_URL}/filter.php?c=Cocktail`;

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

    const startIdx = parseInt(index);
    const endIdx = startIdx + parseInt(limit);
    const paginatedDrinks = data.drinks
      .slice(startIdx, endIdx)
      .map((drink) => ({
        id: parseInt(drink.idDrink),
        name: drink.strDrink,
        image: drink.strDrinkThumb,
        category: "Cocktail",
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
    res.status(500).json({ error: "Failed to filter drinks" });
  }
});

// Add a root route
app.get("/", (req, res) => {
  res.json({ message: "BarCraft API Server" });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
