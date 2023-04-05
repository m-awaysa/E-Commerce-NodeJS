const mongoose = require('mongoose');
const { Types } = require('mongoose');

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [3, 'min length is 3'],
        max: [25, 'max length is 25'],
        unique: [true, 'coupon must be unique'],
        trim: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user',
        required: [true, 'coupon owner is required'],
    },
    usedBy: [{
        type: Types.ObjectId,
        ref: 'user',
    }],
    expireDate: String,
    amount: {
        type: String,
        max: [100, 'max is 100'],
        min: [1, 'min is 1']
    },
    imagePublicId: String,
}, { timestamps: true });

const couponModel = mongoose.model('coupon', couponSchema);
module.exports = { couponModel };