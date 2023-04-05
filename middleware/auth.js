var jwt = require('jsonwebtoken');
const { userModel } = require('../DB/model/user.model');

const auth = (accessRole = []) => {
    return async (req, res, next) => {
        let { token } = req.headers;
        if (token) {
            if (token.startsWith(process.env.AUTHBEARERTOKEN)) {
                token = token.split(process.env.AUTHBEARERTOKEN)[1];
                const decoded = await jwt.verify(token, process.env.LOGINTOKEN);
                if (decoded) {
                    const user = await userModel.findById(decoded.id).select('role blocked');
                    if (user) {
                        if(!user.blocked){
                            if (accessRole.includes(user.role)) {
                                req.userId = user._id;
                                next();
                            } else {
                                return next(new Error('not authorized', { cause: 403 }))
                            }
                        }else{
                            return next(new Error('blocked account', { cause: 401 }))
                        }
                    } else {
                        return next(new Error('not registered user', { cause: 400 }))
                    }
                } else {
                    return next(new Error('invalid token', { cause: 400 }))
                }
            } else {
                return next(new Error('invalid bearer token', { cause: 400 }))
            }
        } else {
            return next(new Error('missing token', { cause: 400 }))
        }
    }
}

module.exports = auth;