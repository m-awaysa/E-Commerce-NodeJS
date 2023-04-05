const Joi = require('joi');
const joi = require('joi');

const createProduct = {
    body: Joi.object().required().keys({
        name: Joi.string().min(5).max(50).required(),
        amount: Joi.number().required().min(0),
        price: Joi.number().required().min(0),
        discount: Joi.number().required().min(0),
        categoryId: Joi.string().required().min(24).max(24),
        subCategoryId: Joi.string().required().min(24).max(24),
        brandId: Joi.string().required().min(24).max(24),
        image: Joi.any(),
    })
}

const updateProduct = {
    body: Joi.object().required().keys({
        name: Joi.string().min(5).max(50).required(),
        amount: Joi.number().required().min(0),
        price: Joi.number().required().min(0),
        discount: Joi.number().required().min(0),
        categoryId: Joi.string().required().min(24).max(24),
        subCategoryId: Joi.string().required().min(24).max(24),
        brandId: Joi.string().required().min(24).max(24),
        image: Joi.any(),
    })
}
module.exports = { createProduct }; 