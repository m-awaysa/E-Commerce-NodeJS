
const { asyncHandler } = require('../../middleware/asyncHandling');
const auth = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const { myMulter, multerValidation, HME } = require('../../services/multer');
const endPoint = require('./product.endPoint');
const router = require('express').Router({ mergeParams: true });
const productController = require('./controller/product.controller');
const productValidation = require('./controller/product.validation');
const wishlistRouter = require('../wishlist/wishlist.route');

router.use("/:productId/wishlist", wishlistRouter);
router.post('/create', asyncHandler(auth(endPoint.add)),
  myMulter(multerValidation.image).array('image', 5), HME, validation(productValidation.createProduct),
  asyncHandler(productController.createProduct)) //validation(productValidation.createProduct),

router.put('/update/:id', asyncHandler(auth(endPoint.update)),
  myMulter(multerValidation.image).array('image', 5), HME,
  asyncHandler(productController.updateProduct))

router.get('/products', asyncHandler(productController.products))

// router.get('/:id',asyncHandler(productController.getProduct))

// router.get('/',(req,res)=>{
//     res.json(req.params);
// })




module.exports = router;