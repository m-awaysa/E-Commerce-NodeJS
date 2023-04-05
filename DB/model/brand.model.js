const mongoose  = require('mongoose');
const {Types}= require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [3, 'min length is 3'],
        max: [25, 'max length is 25'],
        unique:[true,'brand must be unique']
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user',
        required: [true, 'brand owner is required'],
    },
    image: String,
    slug:String,
    imagePublicId:String,
},{timestamps:true});

const brandModel = mongoose.model('brand',brandSchema);
module.exports = {brandModel};