// const jwt_decode = require("jwt-decode");
const Board = require("../models/board.model");
const jwt = require("jsonwebtoken");
module.exports.checkPermission = (arrRole) => async (req, res, next) => {
    let flag = false;
    const token = req.headers.authorization.split(" ")[1];
    const jwt_decode =  jwt.verify(token, process.env.JWT_SECRET);
    const userID = jwt_decode._id;
    const board = await Board.findById(req.params.id);
    board.role_in_board.map( el => {
        if(el.userID.toString() === userID.toString()){
            if(arrRole.some(value => value === el.role)){
                flag = true;
                next();            
            }
        }
    })
    if(!userID || flag === false){
        res.status(400).json({
            error : "",
            message : "not allowed"
        })
    }
}