const express = require('express');
const router = express.Router();
const validator = require("../middlewares/validator");
const User = require('../models/user.model');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
var { validationResult } = require('express-validator');

router.put("/forgot-password", async function(req, res, next){
    try {
        const email = req.body.email;
        await User.findOne({email}, (err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error : err,
                    message : "User with this email dose not exist."
                })
            }
            const token = jwt.sign({_id : user._id}, process.env.RESET_PASSWORD_KEY, {expiresIn : "20m"});
            const transporter = nodemailer.createTransport({
                host : 'smtp.gmail.com',
                port : 587,
                secure : false,
                auth : {
                    user : "nguyenquangtien9787@gmail.com",
                    pass : "quangtien2212" 
                },
                tls : {
                    rejectUnauthorized: false
                }
            })
            const contentEmail = {
                from : "nguyenquangtien9787@gmail.com",
                to : email,
                subject : "Account Activation Link",
                html : `
                    <h2>please click on given link to reset your password</h2>
                    <p>${process.env.CLIENT_URL}/reset-password/${token}</p>                
                `
            }
            transporter.sendMail(contentEmail, (err, info) => {
                if(err || !info) {
                    res.status(400).json({
                        error : err,
                        message : "send mail fail."
                    })
                }else{
                    res.status(200).json({
                        data : info,
                        message : "send mail successfully"
                    })
                }
            })
            res.status(200).json({
                data : user,
                message : "forgot password"
            })
        })
    } catch (error) {
        res.status(400).json({
            error,
            message : "User with this email dose not exist"
        })
    }
})

router.put("/reset-password", validator.validateAuth(), async function(req, res, next){
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        let {newpass, email} = req.body;
        let user = await User.findOneAndUpdate({email},{$set : {password : newpass}});
        res.status(200).json({
            data : user,
            message : "reset password successfully"
        })
    } catch (error) {
        res.status(400).json({
            error,
            message : "reset password fail"
        })
    }
    
})

module.exports = router;