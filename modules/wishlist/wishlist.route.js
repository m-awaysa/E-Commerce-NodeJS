
const { asyncHandler } = require('../../middleware/asyncHandling');
const auth = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const { myMulter, multerValidation, HME } = require('../../services/multer');
const endPoint = require('./wishlist.endPoint');
const router = require('express').Router({ mergeParams: true });
const wishlistController = require('./controller/wishlist.controller');
const wishlistValidation = require('./controller/wishlist.validation');

router.patch('/create', asyncHandler(auth(endPoint.remove)),
 // validation(wishlistValidation.addToWishlist),
  asyncHandler(wishlistController.addToWishlist))

  router.delete('/remove', asyncHandler(auth(endPoint.remove)),
 // validation(wishlistValidation.addToWishlist),
  asyncHandler(wishlistController.removeFromWishlist))

// router.put('/update/:id', asyncHandler(auth(endPoint.update)),
//   myMulter(multerValidation.image).array('image',5), HME,
//   asyncHandler(wishlistController.updateWishlist))

// router.get('/wishlists', asyncHandler(wishlistController.wishlists))

// router.get('/:id',asyncHandler(wishlistController.getWishlist))

// router.get('/',(req,res)=>{
//     res.json(req.params);
// })




module.exports = router;