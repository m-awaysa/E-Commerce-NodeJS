const { productModel } = require("../../../DB/model/product.model");
const cloudinary = require("../../../services/cloudinary.js");
var slugify = require('slugify');
const { pagination } = require("../../../services/pagination");
const { categoryModel } = require("../../../DB/model/category.model");
const { subCategoryModel } = require("../../../DB/model/subCategory.model");
const { brandModel } = require("../../../DB/model/brand.model");

const createProduct = async (req, res, next) => {
  if (!req.files?.length) {
    next(new Error('images is required', { cause: 404 }))
  } else {
    const { name, amount, price, discount, brandId, subCategoryId, categoryId } = req.body;
    const slug = slugify(name);
    const finalPrice = price - (price * ((discount || 0) / 100));
    const category = await subCategoryModel.findOne({ _id: subCategoryId, categoryId });
    if (!category) {
      next(new Error("invalid category or sub category id", { cause: 404 }))
    }
    const brand = await brandModel.findOne({ _id: brandId });
    if (!brand) {
      next(new Error("invalid brand id", { cause: 404 }))
    }

    const images = [];
    const imagesPublicIds = [];
    for (const file of req.files) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `e-commerce/product/${name}` });
      images.push(secure_url)
      imagesPublicIds.push(public_id)
    }



    const product = await productModel.create({
      slug,
      name,
      amount,
      price,
      discount,
      finalPrice,
      categoryId,
      subCategoryId,
      brandId,
      createdBy: req.userId,
      images,
      imagesPublicIds
    });

    if (product) {
      res.status(201).json({ message: 'success', product })
    } else {
      await cloudinary.uploader.destroy(public_id)
      next(new Error('failed to add product', { cause: 400 }))
    }

  }
}

const updateProduct = async (req, res, next) => {

  const { id } = req.params;
  console.log(1)
  const myProduct = await productModel.findOne({ _id: id });

  if (myProduct) {
    let data = {}
    if (req.body.name) {
      data.name = req.body.name;
      data.slug = slugify(req.body.name)
    } else {
      data.name = myProduct.name;
    }

    if (req.body.amount) {
      calcStock = req.body.amount - myProduct.soldItems;
      if (calcStock > 0) {
        data.stack = req.body.amount - myProduct.soldItems;
      } else {
        data.stack = 0;
      }
      data.amount = req.body.amount;
    }
    console.log(2)

    if (req.body.price && req.body.discount) {
      data.finalPrice = req.body.price - (req.body.price * ((req.body.discount || 0) / 100));
    } else if (req.body.price) {
      data.finalPrice = req.body.price - (req.body.price * ((myProduct.discount || 0) / 100));
    } else if (req.body.discount) {
      data.finalPrice = myProduct.price - (myProduct.price * ((req.body.discount || 0) / 100));
    }

    if (req.body.categoryId && req.body.subCategoryId) {
      const category = await subCategoryModel.findOne({ _id: req.body.subCategoryId, categoryId: req.body.categoryId });
      if (!category) {
        next(new Error("invalid category or sub category id", { cause: 404 }))
      } else {
        data.subCategoryId = req.body.subCategoryId;
        data.categoryId = req.body.categoryId;
      }
    }
    console.log(3)

    if (req.body.brandId) {
      const brand = await brandModel.findOne({ _id: req.body.brandId });
      if (!brand) {
        next(new Error("invalid brand id", { cause: 404 }))
      } else {
        data.brandId = req.body.brandId;
      }
    }
    console.log(4)
    if (req.files.length) {
      const images = [];
      const imagesPublicIds = [];
      for (const file of req.files) {
        console.log(4.1)
        let { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `e-commerce/product/${data.name}` });
        console.log(4.2)
        images.push(secure_url)
        imagesPublicIds.push(public_id)
      }
      data.images = images;
      data.imagesPublicIds = imagesPublicIds;
    }
    console.log(5)

    //add new data and image
    const product = await productModel.findByIdAndUpdate({ _id: id }, { ...data }, { new: false });

    if (product) {
      //delete old image
      console.log(6)

      if (req.files.length) {
        for (const publicId of product.imagesPublicIds) {
          await cloudinary.uploader.destroy(publicId)
        }
      }
      res.status(201).json({ message: 'success', product });
    } else {
      console.log(7)

      //if failed delete the image you uploaded
      if (req.files.length) {
        for (const publicId of data.imagesPublicIds) {
          await cloudinary.uploader.destroy(publicId)
        }
      }
      next(new Error('fail to update product', { cause: 400 }))
    }

  } else {
    next(new Error('cant find product', { cause: 400 }))
  }
}



const products = async (req, res, next) => {
  const { page } = req.query;
  const { skip, limit } = pagination(page);

  const products = await productModel.find({}).limit(limit).skip(skip).populate([{
    path: 'createdBy',
    select: 'userName'
  }, {
    path: 'categoryId',
    select: 'name'
  }, {
    path: 'subCategoryId',
    select: 'name'
  }, {
    path: 'brandId',
    select: 'name'
  }]);
  if (!products) {
    next(new Error('fail to get products', { cause: 400 }))
  } else {
    res.status(200).json({ message: 'success', products });
  }
}

// const getProduct = async (req, res, next) => {
//   const { id } = req.params;
//   const product = await productModel.findOne({ _id: id }).populate({
//     path: 'createdBy',
//     select: 'userName'
//   });
//   if (!product) {
//     next(new Error('fail to get product', { cause: 400 }))
//   } else {
//     res.status(200).json({ message: 'success', product });
//   }
// }
module.exports = { createProduct, updateProduct, products/*, getProduct*/ };