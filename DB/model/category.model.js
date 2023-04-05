const mongoose = require('mongoose');
const { Types } = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [3, 'min length is 3'],
        max: [25, 'max length is 25'],
        unique: [true, 'category must be unique']
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user',
        required: [true, 'category owner is required'],
    },
    image: String,
    slug: String,
    imagePublicId: String

}, {
     timestamps: true,
     toJSON: { virtuals: true },
    toObject:{virtual:true}
});

categorySchema.virtual('subCategory', {
    ref: 'subCategory',
    localField: '_id',
    foreignField: 'categoryId'
})

const categoryModel = mongoose.model('category', categorySchema);
module.exports = { categoryModel };