require("../models/database");
const Category = require("../models/category");
const Recipe = require("../models/recipe");


//get route for homepage
module.exports.homepage = async (req, res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        const thai = await Recipe.find({"category" : "Thai"}).limit(limitNumber);
        const american = await Recipe.find({"category" : "American"}).limit(limitNumber);
        const chinese = await Recipe.find({"category" : "Chinese"}).limit(limitNumber);
        const food = { latest, thai, american, chinese };
        res.render("recipe/index", {
            title: "Cooking Blog - Homepage",
            categories,
            food,
        });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};


// all individual category route
module.exports.exploreCategories = async (req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render("recipe/categories", {title: "Cooking Blog - Categories", categories});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};


// single recipe route
module.exports.exploreRecipe = async (req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render("recipe/recipe", {title: "Cooking Blog - Recipe", recipe});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};


// single category by id route
module.exports.exploreCategoryById = async (req, res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({"category": categoryId}).limit(limitNumber);
        res.render("recipe/categories", {title: "Cooking Blog - Categories", categoryById});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};



// search route
module.exports.searchRecipe = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({$text : {$search : searchTerm, $diacriticSensitive : true}});
        res.render("recipe/search", {title: "Cooking Blog - Search", recipe});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};



// explore latest
module.exports.exploreLatest = async (req, res) => {
    try {
        const limitNumber = 5;
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render("recipe/exploreLatest", {title: "Cooking Blog - Search", latest});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};


// explore random
module.exports.exploreRandom = async (req, res) => {
    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render("recipe/exploreRandom", {title: "Cooking Blog - Search", recipe});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};



// GET submit-recipe form 
module.exports.submitRecipeForm = async (req, res) => {
    try {
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render("recipe/submitRecipe", {title: "Cooking Blog - Submit Recipe", infoErrorsObj, infoSubmitObj});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
};


// POST submit-recipe form
const path = require('path'); // Require the path module
const fs = require('fs'); // Require the fs module

module.exports.submitRecipe = async (req, res) => {
    // Check if files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Access the file
    const recipeImage = req.files['recipe[image]'];

    // Define the uploads directory path
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir); // Create uploads directory if it doesn't exist
    }

    // Define the upload path
    const uploadPath = path.join(uploadsDir, recipeImage.name); // Path to save the uploaded file

    // Move the file to the uploads directory
    recipeImage.mv(uploadPath, async (err) => {
        if (err) {
            console.error("Error moving file:", err); // Log the error for debugging
            return res.status(500).send("Failed to upload the file.");
        }

        // Create the new recipe object
        console.log(req.body);
        const newRecipe = new Recipe({
            name: req.body['recipe[name]'], // Use bracket notation to access the name
            description: req.body['recipe[description]'], // Use bracket notation to access the description
            ingredients: req.body['recipe[ingredients][]'] ? [req.body['recipe[ingredients][]']] : [], // Handle array correctly
            category: req.body['recipe[category]'], // Use bracket notation to access the category
            image: recipeImage.name, // Store the image name
            user: req.user ? req.user._id : null // Link to user if available
        });
        
        console.log(newRecipe); // Log the new recipe for debugging

        try {
            // Save the new recipe
            await newRecipe.save();
            req.flash('infoSubmit', 'Recipe has been added.');
            res.redirect("/");
        } catch (error) {
            console.log("Submit error:", error); // Log the error during save
            req.flash('infoErrors', error.message || error);
            res.redirect('/submit-recipe');
        }
    });
};
