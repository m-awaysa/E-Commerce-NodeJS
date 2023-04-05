const { subCategoryModel } = require("../../../DB/model/subCategory.model");
const cloudinary = require("../../../services/cloudinary.js");
var slugify = require('slugify');
const { pagination } = require("../../../services/pagination");
const { categoryModel } = require("../../../DB/model/category.model");

const createSubCategory = async (req, res, next) => {

  if (!req.file) {
    next(new Error('image is required', { cause: 400 }))
  } else {

    const { categoryId } = req.params;
    const category = await categoryModel.findById(categoryId);

    if (category) {
      const { name } = req.body;
      const slug = slugify(name)
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'e-commerce/subCategory' });

      const subCategory = await subCategoryModel.create({
        image: secure_url,
        slug,
        name,
        createdBy: req.userId,
        imagePublicId: public_id,
        categoryId: categoryId
      });

      if (subCategory) {
        res.status(201).json({ message: 'success', subCategory })
      } else {
        await cloudinary.uploader.destroy(public_id)
        next(new Error('failed to add subCategory', { cause: 400 }))
      }
    } else {
      next(new Error('category not found', { cause: 400 }))
    }
  }
}

const updateSubCategory = async (req, res, next) => {
  const { id, categoryId } = req.params;
  let sub = await subCategoryModel.findOne({ _id: id, categoryId: categoryId });
  if (sub) {
    let data = {}
    if (req.file) {
      var { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'e-commerce/subCategory' });
      data.image = secure_url;
      data.imagePublicId = public_id;
    }

    if (req.body.name) {
      data.name = req.body.name;
      data.slug = slugify(req.body.name)
    }

    //add new data and image
    const subCategory = await subCategoryModel.findOneAndUpdate({ _id: id, categoryId: categoryId }, { ...data }, { new: false });

    if (subCategory) {
      //delete old image
      if (req.file) {
        await cloudinary.uploader.destroy(subCategory.imagePublicId)
      }
      res.status(201).json({ message: 'success', subCategory });
    } else {
      await cloudinary.uploader.destroy(public_id)
      next(new Error('fail to update subCategory', { cause: 400 }))
    }

  }else{
    next(new Error('cant find subCategory', { cause: 400 }))
  }
}



const subCategories = async (req, res, next) => {
  const { page } = req.query;
  const { skip, limit } = pagination(page);

  const subCategories = await subCategoryModel.find({}).limit(limit).skip(skip).populate({
    path: 'createdBy',
    select: 'userName'
  });
  if (!subCategories) {
    next(new Error('fail to get subCategories', { cause: 400 }))
  } else {
    res.status(200).json({ message: 'success', subCategories });
  }
}

const getSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findOne({ _id: id }).populate({
    path: 'createdBy',
    select: 'userName'
  });
  if (!subCategory) {
    next(new Error('fail to get subCategory', { cause: 400 }))
  } else {
    res.status(200).json({ message: 'success', subCategory });
  }
}



module.exports = { createSubCategory, updateSubCategory, subCategories, getSubCategory };