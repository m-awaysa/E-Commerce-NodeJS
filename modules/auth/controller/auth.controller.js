var jwt = require('jsonwebtoken');
const { userModel } = require('../../../DB/model/user.model');
let bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const { sendEmail } = require('../../../services/email');
const { getConfirmMessage } = require("../../../services/confirmMessage.js");


const signup = async (req, res,next) => {
     
        const { name, email, password, cPassword } = req.body;
        if (cPassword == password) {
            const user = await userModel.findOne({ email });
            if (!user) {
                let hashPassword = await bcrypt.hash(password, parseInt(process.env.SaltRound));
                const newUser = new userModel({ email, userName: name, password: hashPassword });

                let token = await jwt.sign({ id: newUser._id }, process.env.CONFIRMEMAILTOKEN, { expiresIn: '1h' });
                let refreshToken = await jwt.sign({ id: newUser._id }, process.env.REFRESHTOKENEMAIL);

                const url = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
                const messageRefreshUrl = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshToken/${refreshToken}`

                let message = await getConfirmMessage(url, messageRefreshUrl);
                const info = await sendEmail(email, 'Confirm Email', message);
                console.log(info)
                if (info.accepted.length) {
                    const savedUser = await newUser.save();
                    res.status(201).json({ message: "success", savedUser });

                } else {
                    res.status(404).json({ message: "email rejected" });
                }
            } else {
                res.status(409).json({ message: 'email already exist' });
            }
        } else {
            res.status(400).status().json({ message: 'password not match' });
        }

}

const confirmEmail = async (req, res,next) => {
     
        const { token } = req.params;

        const decoded = jwt.verify(token, process.env.CONFIRMEMAILTOKEN);

        if (!decoded) {
            return next(new Error('invalid token payload',{cause:404}))
        } else {

            let user = await userModel.findByIdAndUpdate(
                { _id: decoded.id, confirmEmail: false },
                { confirmEmail: true }
            );
            res.status(200).json({ message: 'your email is confirmed' });
        }


}

const refreshToken = async (req, res,next) => {
     
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.REFRESHTOKENEMAIL);

        if (!decoded) {
            return next(new Error('invalid token payload',{cause:404}))
        } else {
            const user = await userModel.findById(decoded.id).select('email');
            if (!user) {
                return next(new Error('not registered account',{cause:404}))
            } else {
                let token = await jwt.sign({ id: user._id }, process.env.CONFIRMEMAILTOKEN, { expiresIn: 60 * 5 });
                const url = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
                let message = await getConfirmMessage(url, null);
                await sendEmail(user.email, 'Confirm Email', message);
                res.status(201).json({ message: "success" });
            }
        }


}

const signin = async (req, res,next) => {
     
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                if (user.confirmEmail) {
                    if (user.blocked) {
                        return next(new Error('blocked account',{cause:404}))
                    } else {
                        const token = jwt.sign({ id: user._id }, process.env.LOGINTOKEN, { expiresIn: 60 * 60 * 24 });
                        res.status(200).json({ message: "success", token });
                    }
                } else {
                    return next(new Error('please verify your email',{cause:404}))
                }
            } else {
                return next(new Error('invalid account',{cause:404}))
            }

        } else {
           return next(new Error('invalid account',{cause:404}))
        }


}

const sendCode = async (req, res,next) => {
        const { email } = req.body;
        const user = await userModel.findOne({ email: email }).select('email');
        if (user) {

            const code = nanoid();
            await sendEmail(email, 'Forget Password', `Verify Code : ${code}`);
            updateUser = await userModel.updateOne({ _id: user._id }, { sendCode: code });
            if (updateUser) {
                res.status(200).json({ message: "send data" });
            } else {
                return next(new Error('invalid',{cause:404}))
            }
        } else {
            return next(new Error('invalid account',{cause:404}))
        }
}

const forgetPassword = async (req, res,next) => {
     
        const { code, email, newPassword } = req.body;
        if (code) {
            const hash = await bcrypt.hash(newPassword, parseInt(process.env.SaltRound));
            const user = await userModel.findOneAndUpdate({ email: email, sendCode: code }, { password: hash, sendCode: null });
            if (user) {
                res.status(200).json({ message: "success" });
            } else {
                return next(new Error('invalid',{cause:404}))
            }
        } else {
            return next(new Error('fail',{cause:404}))
        }

}


module.exports = { signup, confirmEmail, signin, sendCode, forgetPassword, refreshToken };