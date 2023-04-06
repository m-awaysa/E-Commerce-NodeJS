const { orderModel } = require("../../../DB/model/order.model");
const cloudinary = require("../../../services/cloudinary.js");
var slugify = require('slugify');
const { pagination } = require("../../../services/pagination");
const { categoryModel } = require("../../../DB/model/category.model");
const { productModel } = require("../../../DB/model/product.model");

const AddToorder = async (req, res, next) => {
  const id = req.userId
  const { products, phone, address, couponId } = req.body

  for (let i = 0; i < products.length; i++) {
    const checkItem = await productModel.findOne(
      {
        id: products[i].productId,
        stock: { $gte: products[i].quantity }
      }
    )
    res.json(checkItem)
  }












  const findorder = await orderModel.findOne({ userId: id })

  if (!findorder) {
    const order = orderModel.create({ userId: id, products });
    return res.status(201).json({ message: 'success', order });

  } else {
    let t = []


  }
}



module.exports = { AddToorder }