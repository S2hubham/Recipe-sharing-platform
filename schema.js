const Joi = require('joi');


module.exports.recipeSchema = Joi.object({
    recipe: Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Recipe name is required.',
            'any.required': 'This field is required.'
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Description is required.',
            'any.required': 'This field is required.'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email.',
            'any.required': 'This field is required.'
        }),
        // Accepting ingredients as a string for easier validation
        ingredients: Joi.string().required().messages({
            'string.empty': 'Ingredients are required and should be comma-separated.',
            'any.required': 'This field is required.'
        }),
        category: Joi.string().valid(
            "Thai", "American", "Chinese", "Mexican", "Indian"
        ).required().messages({
            'any.only': 'Category must be one of the valid options.',
            'any.required': 'This field is required.'
        }),
        // Changing the image validation from URI to string
        image: Joi.string().required().messages({
            'string.empty': 'Image is required.',
            'any.required': 'This field is required.'
        }),
        user: Joi.string().optional(), // assuming user ID is optional
        reviews: Joi.array().items(Joi.string()).optional() // assuming review IDs are strings
    }).required()
});




module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
});