const mongoose = require('mongoose');
const { Types } = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [3, 'min length is 3'],
        max: [50, 'max length is 25'],
        unique: [true, 'product must be unique'],
        trim: true
    },
    images: [String],
    slug: String,
    imagesPublicIds: [String],
    amount: {
        type: Number,
        default: 0,
        required: [true, 'product owner is required'],
    },
    soldItems: {
        type: Number,
        default: 0,
        required: [true, 'product owner is required'],
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, 'product owner is required'],
    },
    price: {
        type: Number,
        default: 0,
        required: [true, 'product owner is required'],
    },
    discount: {
        type: Number,
        default: 0,
        required: [true, 'product owner is required'],
    },
    finalPrice: {
        type: Number,
        default: 0,
        required: [true, 'product owner is required'],
    },
    color: {
        type: [String]
    },
    sizes: { type: [String], enum: ['s', 'm', 'l', 'xl'] },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user',
        required: [true, 'product owner is required'],
    },
    categoryId: {
        type: Types.ObjectId,
        ref: 'category'
    },
    subCategoryId: {
        type: Types.ObjectId,
        ref: 'subCategory'
    },
    brandId: {
        type: Types.ObjectId,
        ref: 'brand'
    },

}, { timestamps: true, });


const productModel = mongoose.model('product', productSchema);
module.exports = { productModel };