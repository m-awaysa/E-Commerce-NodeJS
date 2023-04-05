require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { connectDb } = require('./DB/connection');
const { globalErrorHandling } = require('./middleware/asyncHandling');
const app = express();
const port = 3000;
const indexRouter = require('./modules/index.router');
app.use(express.json());
if(process.env.MOOD == 'dev'){
    app.use(morgan('DEV'))
}else{
    app.use(morgan('combined'))
}



connectDb();
const baseUrl=process.env.BASEURL;
app.use(`${baseUrl}/upload`,express.static('./upload'));
app.use(`${baseUrl}/auth`,indexRouter.authRouter);
app.use(`${baseUrl}/category`,indexRouter.categoryRouter);
app.use(`${baseUrl}/user`,indexRouter.userRouter);
app.use(`${baseUrl}/brand`,indexRouter.brandRouter);
app.use(`${baseUrl}/product`,indexRouter.productRouter);
app.use(`${baseUrl}/coupon`,indexRouter.couponRouter);
app.use(`${baseUrl}/cart`,indexRouter.cartRouter);

app.use('*', (req, res)=>{
    res.json({message:'error 404'});
});

//error handling middleware
app.use(globalErrorHandling)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));



