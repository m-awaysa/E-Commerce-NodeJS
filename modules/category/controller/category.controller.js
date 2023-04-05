const { categoryModel} = require("../../../DB/model/category.model");
const cloudinary = require("../../../services/cloudinary.js");
var slugify = require('slugify');
const { pagination } = require("../../../services/pagination");
const { subCategoryModel } = require("../../../DB/model/subCategory.model");

const createCategory = async (req, res, next) => {
  if (!req.file) {
    next(new Error('image is required', { cause: 400 }))
  } else {
    const { name } = req.body;
    const slug = slugify(name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'e-commerce/category' });

    const category = await categoryModel.create({ image: secure_url, slug, name, createdBy: req.userId, imagePublicId: public_id });
    if (!category) {
      await cloudinary.uploader.destroy(public_id)
      next(new Error('failed to add category', { cause: 400 }))
    } else {
      res.status(201).json({ message: 'success', category })
    }

  }
}

const updateCategory = async (req, res, next) => {
  let data = {}
  const { id } = req.params;
  const cat = await categoryModel.findById(id);
  if(cat){

    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'e-commerce/category' });
      data.image = secure_url;
      data.imagePublicId = public_id;
    }
  
    if (req.body.name) {
      data.name = req.body.name;
      data.slug = slugify(req.body.name)
    }
    //add new image
    const category = await categoryModel.findByIdAndUpdate(id, { ...data }, { new: false });
  
  
    if (!category) {
      await cloudinary.uploader.destroy(public_id)
      next(new Error('fail to update category', { cause: 400 }))
    } else {
      //delete old image
      if (req.file) {
        await cloudinary.uploader.destroy(category.imagePublicId)
      }
      res.status(201).json({ message: 'success', category });
    }
  }else{
    next(new Error('cant find category', { cause: 400 }))
  }
}

const categories = async (req, res, next) => {
  const { page } = req.query;
  const { skip, limit } = pagination(page);

  const categories = await categoryModel.find({}).limit(limit).skip(skip).populate({
    path: 'createdBy',
    select: 'userName'
  },{
    path:'subCategory'
  });
  if (!categories) {
    next(new Error('fail to get categories', { cause: 400 }))
  } else {
    res.status(200).json({ message: 'success', categories });
  }
}

const getCategory = async (req, res, next) => {
  const { id } = req.params;
  const cat = await categoryModel.findOne({ _id: id }).populate({
    path: 'createdBy',
    select: 'userName'
  });
 

  if (!cat) {
    next(new Error('fail to get category', { cause: 400 }))
  } else {
    const subcategories = await subCategoryModel.find({categoryId:cat._id});
    let category = {cat};
    category.subcategories =subcategories;
    res.status(200).json({ message: 'success', category });
  }
}


module.exports = { createCategory, updateCategory, categories, getCategory };