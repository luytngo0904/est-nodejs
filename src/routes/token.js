require("dotenv").config();

const express = require("express")
const router = express()
router.use(express.json())
const jwt =require("jsonwebtoken");
const verifyToken = require("../middlewares/auth");

// const users = [
//     {
//         id:1,
//         username:"huy"
//     }
// ]

router.get('/',verifyToken,(req, res, next)=>{
    
    res.json({posts:"chấp nhận token!"})
})
router.post('/',(req, res)=>{
    
    try {
        const inputUsername = req.body.username;
        const user = users.find(user => user.username===inputUsername);    
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
            console.log(user);
            res.status(200).json({accessToken})
    } catch (error) {
        log.error(error)
        res.status(401).json({
            error,
        })
    }
} )
module.exports = router;