const  mongoose =require('mongoose');
const { Types } = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        min: [3, 'min length is 3'],
        max: [25, 'max length is 25'],
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'email is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    image: String,
    blocked: {
        type: Boolean,
        default: 'false'
    },
    wishlist:[{
        type:Types.ObjectId,
        ref:'product'
    }]

}, { timestamps: true });

const userModel = mongoose.model('user', userSchema);
 module.exports= { userModel };