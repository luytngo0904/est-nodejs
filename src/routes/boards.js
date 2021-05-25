const express = require('express');
const Board = require("../models/board.model");
const User = require("../models/user.model");
const router = express.Router();
const {validationResult, check} = require('express-validator');
const validator = require("../middlewares/validator");
const permissionBoard = require("../middlewares/permission");
//get all board
router.get('/', async function(req, res, next) {
    try {
        const boards = await Board.find()
        .populate({ path : "created_by" })
        .populate({ path : "role_in_board", populate : { path : "userID"}})
        res.status(200).json({
            data: boards,
            message : "get all board successfully !",
        }) 
    } catch (error) {
        res.status(400).json({
            error,
            message : "get all board fail !",
        })
    }
});

//get board by id
router.get('/:id', async function(req, res, next){
    try {
        const boardID = req.params.id;
        const board = await Board.findById(boardID)
        .populate({ path : "created_by" })
        .populate({ path : "role_in_board", populate : { path : "userID"}})
        res.status(200).json({
            data: board,
            message : "get board details successfully !",
        })
    } catch (error) {
        res.status(400).json({
            error,
            message : "get board details fail !",
        })
    }
});

//create board 
router.post('/', validator.validateBoard() ,async function(req, res, next){
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        const board = await Board.create(req.body);
        res.status(200).json({
            data: board,
            message : "created board successfully !",
        })
    } catch (error) {
        res.status(400).json({
            error,
            message : "created board fail !",
        })
    }
});

//update board 
router.put("/:id", permissionBoard.checkPermission(["owner"]) , validator.validateBoard(), async function(req, res, next){
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        const boardID = req.params.id;
        const boardUpdate = req.body;
        const board = await Board.findOneAndUpdate({ _id: boardID }, {$set : boardUpdate});
        res.status(200).json({
            data : board,
            message : "update board successfully !"
        });
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

//delete board
router.delete("/:id", permissionBoard.checkPermission(["owner"]), async function(req, res, next){
    try {
        let boardID = req.params.id;
        await Board.findByIdAndDelete({_id : boardID});
        res.status(200).json({
            message : "deleted board successfully !"
        })
    } catch (error) {
        res.status(400).json({
            message : "deleted board fail !",
        })
    }
})

router.post("/invite",  permissionBoard.checkPermission(["owner", "admin"]), async (req, res, next) => {
    try {
        const { email, boardID } = req.body;
        const user = await User.findOne({email});
        const board = await Board.findOne({_id : boardID});
        const checkMemberExists = board.role_in_board.find((el) => el.userID.toString() === user._id.toString());
        if(checkMemberExists){
            return res.status(400).json({
                error : "",
                message : "member already exists"
            })
        }
        await Board.findOneAndUpdate({_id : boardID}, {
            $push : {
                role_in_board : {
                    userID : user._id
                }
            }
        })
        res.status(200).json({
            data : "",
            message : "invite member successfully"
        })
      
    } catch (error) {
        res.status(400).json({
            error,
            message : "invite member fail or member already exists"
        })
    }
})

module.exports = router;
