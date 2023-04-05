
const { asyncHandler } = require('../../middleware/asyncHandling');
const auth = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const { myMulter, multerValidation, HME } = require('../../services/multer');
const endPoint = require('./coupon.endPoint');
const router = require('express').Router({ mergeParams: true });
const couponController = require('./controller/coupon.controller');
const couponValidation = require('./controller/coupon.validation');



router.post('/create', asyncHandler(auth(endPoint.add)),
  asyncHandler(couponController.createCoupon)) //validation(categoryValidation.createCategory),

router.put('/update/:id', asyncHandler(auth(endPoint.update)),
  asyncHandler(couponController.updateCoupon))

router.delete('/delete/:id', asyncHandler(auth(endPoint.delete)),
  asyncHandler(couponController.deleteCoupon))

router.get('/validCoupons', asyncHandler(auth(endPoint.add)),
  asyncHandler(couponController.ValidCoupons))

// router.get('/:id',asyncHandler(couponController.getCoupon))

// router.get('/',(req,res)=>{
//     res.json(req.params);
// })




module.exports = router;