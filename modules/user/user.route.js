const { asyncHandler } = require('../../middleware/asyncHandling');
const auth = require('../../middleware/auth');
const { myMulter,HME, multerValidation } = require('../../services/multer');
const router = require('express').Router();
const userController = require('./controller/user.controller');
const { endPoint } = require('./user.endPoint');

router.patch('/updatePassword',asyncHandler(auth()),asyncHandler(userController.updatePassword))
router.patch('/profile/picture',asyncHandler(auth()),myMulter(multerValidation.image).single('image'),HME,asyncHandler(userController.uploadProfilePic))
router.get('/hi',asyncHandler(auth(endPoint.profile)),asyncHandler((req,res)=>{
  res.json({message:'gsfdh'});
}))

module.exports = router;