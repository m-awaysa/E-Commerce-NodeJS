const multer = require('multer');
const { nanoid } = require('nanoid'); 
const multerValidation = {
    image: ['image/png','image/jpeg','image/jpg'],
    pdf: ['application/pdf']
};

const HME = (error, req, res, next) => {
    if (error) {
        if(error.cause){
            return next(new Error(error, { cause: error['cause'] }))
        }else{
            return next(new Error(error, { cause: 400 }))
        }
    } else {
        next();
    }
}
function myMulter(multerValidation) {
    const storage = multer.diskStorage({});
    function fileFilter(req, file, cb) {
        if (multerValidation.includes(file.mimetype)) {

            cb(null, true)
        } else {
            cb('invalid file type ', false)
        }
    }

    const upload = multer({ dest: 'upload', fileFilter, storage });

    return upload;
}

module.exports = { myMulter, HME, multerValidation }

