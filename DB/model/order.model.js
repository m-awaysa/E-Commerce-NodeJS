const mongoose = require('mongoose');
const { Types } = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: Types.ObjectId,
            ref: 'product',
            required: true,
        },
        quantity: {
            type: Number,
            default: 1
        },
        totalPrice: {
            type: Number,
            default: 1
        }
    }],
    address: String,
    phone: String,
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'cancelled', 'approved', 'received']
    },
    PaymentMethod: {
        type: String,
        default: 'cash',
        enum: ['cash', 'paypal', 'visa']
    },
    userId: {
        type: Types.ObjectId,
        ref: 'user',
        required: [true, 'order owner is required'],
    },

}, { timestamps: true });

const orderModel = mongoose.model('order', orderSchema);
module.exports = { orderModel };