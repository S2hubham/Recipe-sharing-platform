const Recipe = require("./server/models/recipe.js");
const Review = require("./server/models/review.js");
const ExpressError = require("./utility/ExpressError.js");
const { recipeSchema, reviewSchema } = require("./schema.js");

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


// authorization
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to post a recipe!");
        return res.redirect("/user/login");
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this recipe");
        return res.redirect(`/recipe/${id}`);
    }
    next();
};


module.exports.validateRecipe = (req, res, next) => {
    const ingredientsArray = req.body['recipe[ingredients][]'];
    const ingredients = Array.isArray(ingredientsArray) ? ingredientsArray : [ingredientsArray];
    const recipeData = {
        recipe: {
            name: req.body['recipe[name]'],
            description: req.body['recipe[description]'],
            ingredients,
            category: req.body['recipe[category]'],
            image: req.body['recipe[image]'] 
        }
    };
    const { error } = recipeSchema.validate(recipeData);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        console.log(error);
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); 
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/recipe/${id}`);
    }
    next();
};