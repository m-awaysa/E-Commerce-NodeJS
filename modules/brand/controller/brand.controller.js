const { brandModel } = require("../../../DB/model/brand.model");
const cloudinary = require("../../../services/cloudinary.js");
var slugify = require('slugify');
const { pagination } = require("../../../services/pagination");
const { categoryModel } = require("../../../DB/model/category.model");

const createBrand = async (req, res, next) => {

  if (!req.file) {
    next(new Error('image is required', { cause: 400 }))
  } else {
    const { name } = req.body;
    const slug = slugify(name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'e-commerce/brand' });

    const brand = await brandModel.create({
      image: secure_url,
      slug,
      name,
      createdBy: req.userId,
      imagePublicId: public_id,
    });

    if (brand) {
      res.status(201).json({ message: 'success', brand })
    } else {
      await cloudinary.uploader.destroy(public_id)
      next(new Error('failed to add brand', { cause: 400 }))
    }

  }
}

const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  let brand = await brandModel.findOne({ _id: id });

  if (brand) {
    let data = {}
    if (req.file) {
      var { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'e-commerce/brand' });
      data.image = secure_url;
      data.imagePublicId = public_id;
    }

    if (req.body.name) {
      data.name = req.body.name;
      data.slug = slugify(req.body.name)
    }

    //add new data and image
    const brand = await brandModel.findByIdAndUpdate({ _id: id }, { ...data }, { new: false });

    if (brand) {
      //delete old image
      if (req.file) {
        await cloudinary.uploader.destroy(brand.imagePublicId)
      }
      res.status(201).json({ message: 'success', brand });
    } else {
      if (req.file) {
        await cloudinary.uploader.destroy(public_id)
      }
      next(new Error('fail to update brand', { cause: 400 }))
    }

  } else {
    next(new Error('cant find brand', { cause: 400 }))
  }
}



const brands = async (req, res, next) => {
  const { page } = req.query;
  const { skip, limit } = pagination(page);

  const brands = await brandModel.find({}).limit(limit).skip(skip).populate({
    path: 'createdBy',
    select: 'userName'
  });
  if (!brands) {
    next(new Error('fail to get brands', { cause: 400 }))
  } else {
    res.status(200).json({ message: 'success', brands });
  }
}

// const getBrand = async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await brandModel.findOne({ _id: id }).populate({
//     path: 'createdBy',
//     select: 'userName'
//   });
//   if (!brand) {
//     next(new Error('fail to get brand', { cause: 400 }))
//   } else {
//     res.status(200).json({ message: 'success', brand });
//   }
// }



module.exports = { createBrand, updateBrand, brands/*, getBrand */ };