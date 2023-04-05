
const { asyncHandler } = require('../../middleware/asyncHandling');
const auth = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const { myMulter, multerValidation, HME } = require('../../services/multer');
const endPoint = require('./subCategory.endPoint');
const router = require('express').Router({mergeParams:true});
const subCategoryController = require('./controller/subCategory.controller');
const  subCategoryValidation = require('./controller/subCategory.validation');

router.post('/create',asyncHandler(auth(endPoint.add)),
myMulter(multerValidation.image).single('image'),HME,
asyncHandler(subCategoryController.createSubCategory)) //validation(categoryValidation.createCategory),

router.put('/update/:id',asyncHandler(auth(endPoint.update)),
myMulter(multerValidation.image).single('image'),HME,
asyncHandler(subCategoryController.updateSubCategory)) 

 router.get('/subCategories',asyncHandler(subCategoryController.subCategories)) 

router.get('/:id',asyncHandler(subCategoryController.getSubCategory))

router.get('/',(req,res)=>{
    res.json(req.params);
})




module.exports = router;