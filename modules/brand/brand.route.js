
const { asyncHandler } = require('../../middleware/asyncHandling');
const auth = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const { myMulter, multerValidation, HME } = require('../../services/multer');
const endPoint = require('./brand.endPoint');
const router = require('express').Router({mergeParams:true});
const brandController = require('./controller/brand.controller');
const  brandValidation = require('./controller/brand.validation');

router.post('/create',asyncHandler(auth(endPoint.add)),
myMulter(multerValidation.image).single('image'),HME,
asyncHandler(brandController.createBrand)) //validation(categoryValidation.createCategory),

router.put('/update/:id',asyncHandler(auth(endPoint.update)),
myMulter(multerValidation.image).single('image'),HME,
asyncHandler(brandController.updateBrand)) 

  router.get('/brands',asyncHandler(brandController.brands)) 

// router.get('/:id',asyncHandler(brandController.getBrand))

// router.get('/',(req,res)=>{
//     res.json(req.params);
// })




module.exports = router;