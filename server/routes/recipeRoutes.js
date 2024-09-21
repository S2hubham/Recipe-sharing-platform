const express = require("express");
const router = express.Router(); // Capitalize Router
const recipeController = require("../controllers/recipeController");

// App routes
router.get("/", recipeController.homepage);

//all category routes
router.get("/categories", recipeController.exploreCategories);

//single recipe route
router.get("/recipe/:id", recipeController.exploreRecipe);

// sigle category route 
router.get("/categories/:id", recipeController.exploreCategoryById);

// search
router.post("/search", recipeController.searchRecipe);

// explore latest
router.get("/explore-latest", recipeController.exploreLatest);

// explore random
router.get("/explore-random", recipeController.exploreRandom);

// submit recipe
// GET
router.get("/submit-recipe", recipeController.submitRecipeForm);
// POST
router.post("/submit-recipe", recipeController.submitRecipe);

module.exports = router; // Change export to exports
