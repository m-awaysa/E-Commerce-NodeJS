const { cartModel } = require("../../../DB/model/cart.model");
const cloudinary = require("../../../services/cloudinary.js");
var slugify = require('slugify');
const { pagination } = require("../../../services/pagination");
const { categoryModel } = require("../../../DB/model/category.model");

const AddToCart = async (req, res, next) => {
  const id = req.userId
  const { products } = req.body
  const findCart = await cartModel.findOne({ userId: id })

  if (!findCart) {
    const cart = cartModel.create({ userId: id, products });
    return res.status(201).json({ message: 'success', cart });

  } else {
    let t = []

  
    for (const newProduct of products) {
      let done = true;
      for (let index = 0; index < findCart.products.length; index++) {
        if (newProduct.productId == findCart.products[index].productId) {
          findCart.products[index] = newProduct;
          done = false;
          break;
        } 
      }
      if (done) {
        findCart.products.push(newProduct);
      }
      const updateCart = await cartModel.findOneAndUpdate({ userId: id }, { products: findCart.products }, { new: true })
      res.status(200).json({ message: 'success', updateCart });
    }
  }
}



module.exports = { AddToCart }