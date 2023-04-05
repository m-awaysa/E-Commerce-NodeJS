const mongoose  = require('mongoose');
const {Types}= require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [3, 'min length is 3'],
        max: [25, 'max length is 25'],
        unique:[true,'subCategory must be unique']
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user',
        required: [true, 'subCategory owner is required'],
    },
    image: String,
    slug:String,
    imagePublicId:String,
    categoryId: {
        type: Types.ObjectId,
        ref: 'category',
        required: [true, 'subCategory parent is required'],
    },
},{timestamps:true});

const subCategoryModel = mongoose.model('subCategory',subCategorySchema);
module.exports = {subCategoryModel};