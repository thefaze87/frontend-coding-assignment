import express from "express";
import cors from "cors";
import fetch from "node-fetch";

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

/**
 * Search endpoint - searches cocktails by name
 * GET /api/search?query=string&index=number&limit=number
 *
 * @query {string} query - Search term for cocktail names
 * @query {number} index - Starting position for pagination
 * @query {number} limit - Number of items per page
 */
app.get("/api/search", async (req, res) => {
  // Get and validate query parameters
  const query = String(req.query.query || "");
  const startIndex = req.query.index ? Number(req.query.index) : 0;
  const pageSize = req.query.limit ? Number(req.query.limit) : 10;

  // Log request parameters for debugging
  console.log("Request parameters:", {
    raw: req.query,
    parsed: { query, startIndex, pageSize },
  });

  try {
    // Fetch data from CocktailDB
    const response = await fetch(
      `${COCKTAIL_DB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    // Transform raw data into our API format
    const allDrinks =
      data.drinks?.map((drink) => ({
        id: parseInt(drink.idDrink),
        name: drink.strDrink,
        category: drink.strCategory,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions,
        ingredients: getIngredients(drink),
        measures: getMeasures(drink),
      })) || [];

    // Calculate pagination values
    const start = Math.max(0, startIndex);
    const end = Math.min(start + pageSize, allDrinks.length);

    // Log pagination details for debugging
    console.log("Pagination calculation:", {
      start,
      end,
      totalDrinks: allDrinks.length,
      requestedSize: pageSize,
    });

    // Get paginated subset of drinks
    const paginatedDrinks = allDrinks.slice(start, end);

    // Return formatted response with pagination metadata
    res.json({
      drinks: paginatedDrinks,
      totalCount: allDrinks.length,
      pagination: {
        currentPage: Math.floor(start / pageSize),
        totalPages: Math.ceil(allDrinks.length / pageSize),
        pageSize,
        startIndex: start,
        endIndex: end - 1,
        hasMore: end < allDrinks.length,
      },
    });
  } catch (error) {
    console.error("Error fetching from CocktailDB:", error);
    res.status(500).json({ error: "Failed to fetch drinks" });
  }
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
 * Letter search endpoint - searches cocktails by first letter
 * GET /api/search/letter?firstLetter=string&index=number&limit=number
 *
 * @query {string} firstLetter - Single letter to search by
 * @query {number} index - Starting position for pagination
 * @query {number} limit - Number of items per page
 */
app.get("/api/search/letter", async (req, res) => {
  const firstLetter = req.query.firstLetter || "";
  const startIndex = parseInt(req.query.index) || 0;
  const pageSize = parseInt(req.query.limit) || 10;

  try {
    // Fetch drinks by first letter from CocktailDB
    const response = await fetch(
      `${COCKTAIL_DB_BASE_URL}/search.php?f=${encodeURIComponent(firstLetter)}`
    );
    const data = await response.json();

    // Transform and format the response data
    const allDrinks =
      data.drinks?.map((drink) => ({
        id: parseInt(drink.idDrink),
        name: drink.strDrink,
        category: drink.strCategory,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions,
        ingredients: getIngredients(drink),
        measures: getMeasures(drink),
      })) || [];

    // Calculate pagination values
    const totalCount = allDrinks.length;
    const start = Math.max(0, startIndex);
    const end = Math.min(start + pageSize, totalCount);
    const paginatedDrinks = allDrinks.slice(start, end);

    // Return formatted response with pagination metadata
    res.json({
      drinks: paginatedDrinks,
      totalCount,
      pagination: {
        currentPage: Math.floor(start / pageSize),
        totalPages: Math.ceil(totalCount / pageSize),
        pageSize,
        startIndex: start,
        endIndex: end - 1,
        hasMore: end < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching from CocktailDB:", error);
    res.status(500).json({ error: "Failed to fetch drinks" });
  }
});

/**
 * Popular cocktails endpoint - returns a curated list of popular drinks
 * This endpoint is not used in the frontend, but it's a good example of how to fetch multiple cocktails in parallel. It's not used in the frontend because the API doesn't support it unless you are a premium user.
 * GET /api/popular
 */
app.get("/api/popular", async (req, res) => {
  try {
    // List of popular cocktails to fetch
    const popularNames = ["margarita", "mojito", "old fashioned", "negroni"];

    // Fetch all popular cocktails in parallel
    const promises = popularNames.map((name) =>
      fetch(
        `${COCKTAIL_DB_BASE_URL}/search.php?s=${encodeURIComponent(name)}`
      ).then((res) => res.json())
    );

    const results = await Promise.all(promises);

    // Transform and combine all results
    const drinks = results
      .flatMap((data) => data.drinks || [])
      .map((drink) => ({
        id: parseInt(drink.idDrink),
        name: drink.strDrink,
        category: drink.strCategory,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions,
        ingredients: getIngredients(drink),
        measures: getMeasures(drink),
        popular: true, // Mark as popular cocktail
      }));

    res.json({
      drinks,
      totalCount: drinks.length,
    });
  } catch (error) {
    console.error("Error fetching from CocktailDB:", error);
    res.status(500).json({ error: "Failed to fetch popular drinks" });
  }
});

/**
 * Ingredient search endpoint - searches ingredients by name
 * GET /api/ingredients/search?query=string&index=number&limit=number
 *
 * @query {string} query - Search term for ingredient names
 * @query {number} index - Starting position for pagination
 * @query {number} limit - Number of items per page
 *
 * Example: /api/ingredients/search?query=vodka&index=0&limit=10
 */
app.get("/api/ingredients/search", async (req, res) => {
  // Get and validate query parameters
  const query = String(req.query.query || "");
  const startIndex = req.query.index ? Number(req.query.index) : 0;
  const pageSize = req.query.limit ? Number(req.query.limit) : 10;

  try {
    // Fetch ingredients from CocktailDB
    const response = await fetch(
      `${COCKTAIL_DB_BASE_URL}/search.php?i=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    // Transform raw data into our API format
    const allIngredients =
      data.ingredients?.map((ingredient) => ({
        id: parseInt(ingredient.idIngredient),
        name: ingredient.strIngredient,
        description: ingredient.strDescription,
        type: ingredient.strType,
        alcohol: ingredient.strAlcohol === "Yes",
        abv: ingredient.strABV ? ingredient.strABV : null,
      })) || [];

    // Calculate pagination values
    const totalCount = allIngredients.length;
    const start = Math.max(0, startIndex);
    const end = Math.min(start + pageSize, totalCount);
    const paginatedIngredients = allIngredients.slice(start, end);

    // Return formatted response with pagination metadata
    res.json({
      ingredients: paginatedIngredients,
      totalCount,
      pagination: {
        currentPage: Math.floor(start / pageSize),
        totalPages: Math.ceil(totalCount / pageSize),
        pageSize,
        startIndex: start,
        endIndex: end - 1,
        hasMore: end < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching ingredients from CocktailDB:", error);
    res.status(500).json({ error: "Failed to fetch ingredients" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
