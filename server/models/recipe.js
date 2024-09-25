const mongoose = require("mongoose");
const category = require("./category");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: {
        type: String,
        required: "This field is required.",
    },
    description: {
        type: String,
        required: "This field is required.",
    },
    ingredients: {
        type: [String],
        required: "This field is required.",
    },
    category: {
        type: String,
        enum: ["Thai", "American", "Chinese", "Mexican", "Indian"],
        required: "This field is required.",
    },
    image: {
        type: String,
        required: "This field is required.",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
});

recipeSchema.index({ name: "text", description: "text", category: "text"});
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model("Recipe", recipeSchema);
