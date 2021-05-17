require("dotenv").config();

const express = require("express")
const router = express()
router.use(express.json())
const jwt =require("jsonwebtoken");
const verifyToken = require("../middlewares/auth");

const users = [
    {
        id:1,
        username:"huy"
    }

]


router.get('/',verifyToken,(req, res, next)=>{
    res.json({posts:"hello"})
})
router.post('/',(req, res)=>{
    const inputUsername = req.body.username;
    const user = users.find(user => user.username===inputUsername);
    console.log(user);
    if(!user) return res.sendStatus(401)

    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET
    //     {
    //     expiresIn:"60s"
    // }
    )
    res.json({accessToken})
    
} )
module.exports = router;
