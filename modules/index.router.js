
const authRouter = require('./auth/auth.route');
const categoryRouter = require('./category/category.route');
const userRouter = require('./user/user.route');
const subCategoryRouter = require('./subCategory/subCategory.route');
const brandRouter = require('./brand/brand.route');
const productRouter = require('./product/product.route');
const couponRouter = require('./coupon/coupon.route');
const cartRouter = require('./cart/cart.route');




module.exports = {
    authRouter,
    categoryRouter,
    userRouter,
    subCategoryRouter,
    brandRouter,
    productRouter,
    couponRouter,
    cartRouter
}
