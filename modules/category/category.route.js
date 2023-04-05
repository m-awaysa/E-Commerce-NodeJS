
const { asyncHandler } = require('../../middleware/asyncHandling');
const auth = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const { myMulter, multerValidation, HME } = require('../../services/multer');
const  subCategoryRouter  = require('../subCategory/subCategory.route');
const endPoint = require('./category.endPoint');
const router = require('express').Router();
const categoryController = require('./controller/category.controller');
const  categoryValidation = require('./controller/category.validation');

router.use('/:categoryId/subCategory',subCategoryRouter)

router.post('/create',asyncHandler(auth(endPoint.add)),
myMulter(multerValidation.image).single('image'),HME,
asyncHandler(categoryController.createCategory)) //validation(categoryValidation.createCategory),

router.put('/update/:id',asyncHandler(auth(endPoint.update)),
myMulter(multerValidation.image).single('image'),HME,
asyncHandler(categoryController.updateCategory)) 

router.get('/categories',asyncHandler(categoryController.categories)) 

router.get('/:id',asyncHandler(categoryController.getCategory))






module.exports = router;