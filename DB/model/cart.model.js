const mongoose = require('mongoose');
const { Types } = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: Types.ObjectId,
            ref: 'product',
            required: true,
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    userId: {
        type: Types.ObjectId,
        ref: 'user',
        required: [true, 'cart owner is required'],
    },
}, { timestamps: true });

const cartModel = mongoose.model('cart', cartSchema);
module.exports = { cartModel };