const { wishlistModel } = require("../../../DB/model/product.model");
const cloudinary = require("../../../services/cloudinary.js");
var slugify = require('slugify');
const { pagination } = require("../../../services/pagination");
const { categoryModel } = require("../../../DB/model/category.model");
const { subCategoryModel } = require("../../../DB/model/subCategory.model");
const { brandModel } = require("../../../DB/model/brand.model");
const { userModel } = require("../../../DB/model/user.model");

const addToWishlist = async (req, res, next) => {
  const { productId } = req.params;
  const product = await userModel.findOneAndUpdate(req.userId, {
    $addToSet: { wishlist: productId }
  })

  if (product) {
    res.status(201).json({ message: 'success' });
  } else {
    return next(new Error('fail to add', { cause: 400 }))
  }
}

const removeFromWishlist = async (req, res, next) => {
  const { productId } = req.params;
  const product = await userModel.findOneAndUpdate(req.userId, {
    $pull: { wishlist: productId }
  })

  if (product) {
    res.status(201).json({ message: 'success' });
  } else {
    return next(new Error('fail to remove', { cause: 400 }))
  }
}


module.exports = { addToWishlist, removeFromWishlist };