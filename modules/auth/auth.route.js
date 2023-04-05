const router = require('express').Router();
const { validation } = require('../../middleware/validation');
const authController = require('./controller/auth.controller');
const  validations  = require('./controller/auth.validation');
const  {asyncHandler}  =require('../../middleware/asyncHandling');

router.get('/', (req, res) => {
    res.json({ message: 'auth' });
});
router.post('/signup',validation(validations.signup),asyncHandler(authController.signup));
router.get('/confirmEmail/:token', asyncHandler(authController.confirmEmail));
router.get('/refreshToken/:token', asyncHandler(authController.refreshToken));
router.post('/signin',validation(validations.signin),asyncHandler(authController.signin));//,validation(validations.signin)
router.get('/sendCode',asyncHandler(authController.sendCode));
router.patch('/forgetPassword',asyncHandler(authController.forgetPassword))
module.exports = router;