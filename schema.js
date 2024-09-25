const Joi = require('joi');

module.exports.recipeSchema = Joi.object({
    recipe: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().default("No description provided"),
        ingredients: Joi.array().items(Joi.string().required()).min(1).required(),
        image: Joi.any(), 
        category: Joi.string().valid(
            "Thai", "American", "Chinese", "Mexican", "Indian"
        ).required(),
    }).required()
});




module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
});