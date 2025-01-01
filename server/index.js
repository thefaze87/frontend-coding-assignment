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

// ... (other endpoints)

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
