const Review = require("../models/review");
const Recipe = require("../models/recipe");

module.exports.createReview = async(req, res) => {
    let Recipe = await Recipe.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);

    Recipe.reviews.push(newReview);

    await newReview.save();
    await Recipe.save();

    // console.log("new review saved");
    req.flash("success", "Review created successfuly");
    res.redirect(`/Recipe/${Recipe._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Recipe.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/Recipe/${id}`);
}