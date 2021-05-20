const jwt_decode = require("jwt-decode");
const Board = require("../models/board.model");
module.exports.checkPermission = (arrRole) => async (req, res, next) => {
    let flag = false;
    const { _id } = jwt_decode(req.headers.authorization.split(" ")[1]);
    const result = await Board.findOne({"role_in_board.userID" : _id});
    result.role_in_board.map( val => {
        if(arrRole.includes(val.role)){
            flag = true;
            next();
        }
    })
    if(!_id || flag === false){
        res.status(400).json({
            error : "",
            message : "not allowed"
        })
    }
}