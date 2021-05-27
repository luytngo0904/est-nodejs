const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next)=>{
    const authHeader = req.header("Authorization")
    const token = authHeader && authHeader.split(" ")[1]
    console.log(token);

    if(!token) return res.status(401).json({
        message : "did not receive token!",
    })
    
    try {
       const decode =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decode);
        next();
    } catch (error) {
        console.log("error", error);
        res.status(403).json({
            error,
            message : "token is not valid!",
        })        
    }


}
module.exports = verifyToken;