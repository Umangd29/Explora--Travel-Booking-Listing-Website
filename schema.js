const Joi = require('joi');

const listingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null),
        category: Joi.alternatives().try(
            Joi.string(),      // if single category
            Joi.array().items(Joi.string()) // if multiple categories
        ).required(),
    }).required()
});

const reviewSchema = Joi.object({
    Review: Joi.object({
        rating: Joi.string().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required()
});



module.exports = { listingSchema, reviewSchema };
