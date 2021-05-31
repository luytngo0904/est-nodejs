const Board = require("../models/board.model");

const hasOwnerBoard =  async (req, res, next) => {
    const userID = req.decode.sub;
    const board = await Board.findOne({
        _id : req.params.id,
        "role_in_board.userID" : userID,
        "role_in_board.role" : "owner"
    });
    if(board === null) {
        return  res.status(400).json({
            error : "",
            message : "not allowed"
        })
    }
    next();
}

const hasAdminBoard = async (req, res, next) => {
    const userID = req.decode.sub;
    const board = await Board.findOne({
        _id : req.params.id,
        "role_in_board.userID" : userID,
        "role_in_board.role" : {
            $in : ["owner","admin"]
        }
    });
    if(board === null) {
        return  res.status(400).json({
            error : "",
            message : "not allowed"
        })
    }
    next();
}

module.exports = {
    hasOwnerBoard,
    hasAdminBoard
}