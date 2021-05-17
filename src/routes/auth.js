const express = require('express');
const router = express.Router();
const validator = require("../middlewares/validator");
const User = require('../models/user.model');
const Token = require('../models/token.model');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
var { validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const bcrypt_salt = process.env.BCRYPT_SALT;

router.post("/forgot-password", async function(req, res, next){
    try {
        const email = req.body.email;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({
                error : err,
                message : "User with this email dose not exist."
            });
        }

        let token = await Token.findOne({ userID: user._id });
        if (token) await token.deleteOne();

        const resetToken = jwt.sign({_id : user._id}, process.env.RESET_PASSWORD_KEY, {expiresIn : "20m"});
        const hash = await bcrypt.hash(resetToken, Number(bcrypt_salt));
        await new Token({
            userID : user._id,
            token : hash
        }).save();

        const transporter = nodemailer.createTransport({
            host : process.env.HOST_TRANSPORTER,
            port : process.env.PORT_TRANSPORTER,
            secure : false,
            auth : {
                user : process.env.USER_TRANSPORTER,
                pass : process.env.PASS_TRANSPORTER
            },
            tls : {
                rejectUnauthorized: false
            }
        })

        const contentEmail = {
            from : process.env.USER_TRANSPORTER,
            to : email,
            subject : "Account Activation Link",
            html : `
                <h2>please click on given link to reset your password</h2>
                <p>${process.env.CLIENT_URL}/reset-password/${resetToken}</p>                
            `
        }

        transporter.sendMail(contentEmail, (err, info) => {
            if(err || !info) {
                console.log(err, '[err]');
                res.status(400).json({
                    error : err,
                    message : "send mail fail."
                })
            }
            res.status(200).json({
                data : info,
                message : "send mail successfully"
            })
        })

        res.status(200).json({
            data : user,
            message : "forgot password"
        })
    } catch (error) {
        console.log(error, '[error]');
        res.status(400).json({
            error,
            message : "User with this email dose not exist"
        })
    }
})

router.post("/reset-password", validator.validateAuth(), async function(req, res, next){
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const {password, email} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            res.status(400).json({
                error : "",
                message : "User does not exist"
            })
        }

        const passwordResetToken = await Token.findOne({userID : user._id});
        if (!passwordResetToken) {
            res.status(400).json({
                error : "",
                message : "Invalid or expired password reset token"
            })
        }

        const hash = await bcrypt.hash(password, Number(bcrypt_salt));
        if(req.body.password !== req.body.confirmPassword){
            res.status(400).json({
                error,
                message : "reset password fail"
            })
        }

        await User.findOneAndUpdate(
            { _id: user._id},
            {   
                $set: { 
                    password: hash,
                }
            },
        );

        await Token.findOneAndUpdate(
            {userID: user._id},
            {
                $set : {
                    deletedAt : Date.now()
                }
            }
        )
        
        res.status(200).json({
            data : user,
            message : "reset password successfully"
        })
    } catch (error) {
        console.log(error, '[error]');
        res.status(400).json({
            error,
            message : "reset password fail"
        })
    }
    
})

module.exports = router;