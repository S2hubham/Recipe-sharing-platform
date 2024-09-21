const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../../utility/wrapAsync.js");
const Review = require("../models/review.js");
const Recipe = require("../models/recipe.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../../middleware.js");
const reviewController = require("../controllers/reviewController.js");


router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//review delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;