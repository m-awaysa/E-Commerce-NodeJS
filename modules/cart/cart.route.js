
const { asyncHandler } = require('../../middleware/asyncHandling');
const auth = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const { myMulter, multerValidation, HME } = require('../../services/multer');
const endPoint = require('./cart.endPoint');
const router = require('express').Router({mergeParams:true});
const cartController = require('./controller/cart.controller');
const  cartValidation = require('./controller/cart.validation');

router.post('/add',asyncHandler(auth(endPoint.add)),
asyncHandler(cartController.AddToCart)) //validation(categoryValidation.createCategory),

// router.put('/update/:id',asyncHandler(auth(endPoint.update)),
// myMulter(multerValidation.image).single('image'),HME,
// asyncHandler(cartController.updatecart)) 

//   router.get('/carts',asyncHandler(cartController.carts)) 

// router.get('/:id',asyncHandler(cartController.getcart))

// router.get('/',(req,res)=>{
//     res.json(req.params);
// })




module.exports = router;