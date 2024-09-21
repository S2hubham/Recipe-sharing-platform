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
module.exports.submitRecipe = async (req, res) => {
    try {
        console.log("inside submit");
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        // Handle image upload
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files were uploaded.');
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err);
            });
        }

        // Check if ingredients are provided as a string and convert to an array
        const ingredients = req.body.ingredients.split(',').map(item => item.trim());

        // Ensure user (owner) is added to the recipe
        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: ingredients,  // Save as array
            category: req.body.category,
            image: newImageName,
            user: req.user ? req.user._id : null  // Link to user if available
        });

        // Save the new recipe
        await newRecipe.save();
        req.flash('infoSubmit', 'Recipe has been added.');
        res.redirect("/");
    } catch (error) {
        console.log("submit erree");
        req.flash('infoErrors', error.message || error);
        res.redirect('/submit-recipe');
    }
};
