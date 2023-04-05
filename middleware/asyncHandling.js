const asyncHandler = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch( error=>{
           // return res.json({message:"catch error",err:error.message,stack:error.stack,cause});
           return next(new Error(error,{cause:500,stack:error.stack},))
        })
    }
}

const globalErrorHandling = (err,req,res,next)=>{
    console.log(err.message)
    if(err){
     return res.status(err['cause']).json({message:err.message,err,stack:err.stack})
    }
 }
module.exports ={asyncHandler,globalErrorHandling}