
const { asyncHandler } = require('../../middleware/asyncHandling');
const auth = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const { myMulter, multerValidation, HME } = require('../../services/multer');
const endPoint = require('./order.endPoint');
const router = require('express').Router({mergeParams:true});
const orderController = require('./controller/order.controller');
const  orderValidation = require('./controller/order.validation');

router.post('/add',asyncHandler(auth(endPoint.add)),
asyncHandler(orderController.AddToorder)) //validation(categoryValidation.createCategory),

// router.put('/update/:id',asyncHandler(auth(endPoint.update)),
// myMulter(multerValidation.image).single('image'),HME,
// asyncHandler(orderController.updateorder)) 

//   router.get('/orders',asyncHandler(orderController.orders)) 

// router.get('/:id',asyncHandler(orderController.getorder))

// router.get('/',(req,res)=>{
//     res.json(req.params);
// })




module.exports = router;