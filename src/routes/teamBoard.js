var express = require("express");
var router = express.Router();
const TeamBoard = require("../models/teamBoard.model");
const {validationResult} = require('express-validator');
const validator = require("../middlewares/validator");
const permission = require("../middlewares/permission");
router.get("/", async function (req, res, next) {
    try {
        const teamBoards = await TeamBoard.find()
        res.status(200).json({
            data : teamBoards,
            message : "get all team successfully"
        })
    } catch (error) {
        console.log(error, '[error]');
        res.status(400).json({
            error,
            message : "get all team fail"
        })
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const teamBoardID = req.params.id;
        const teamBoard = await TeamBoard.findById(teamBoardID)
        res.status(200).json({
            data : teamBoard,
            message : "get all team successfully"
        })
    } catch (error) {
        console.log(error, '[error]');
        res.status(400).json({
            error,
            message : "get all team fail"
        })
    }
});

router.post("/", validator.validateTeamBoard() , async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const teamBoard = await TeamBoard.create({
            name : req.body.name,
            member : [
                {
                    userID : req.decode.sub,
                    role : "owner"
                }
            ]
        });
        await
        res.status(200).json({
            data: teamBoard,
            message : "created team successfully !",
        })
    } catch (error) {
        console.log(error, '[error]');
        res.status(400).json({
            error,
            message : "create team fail"
        })
    }
});

router.put("/:id",permission.hasOwnerBoard, validator.validateTeamBoard(), async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const teamBoardID = req.params.id;
        const teamBoardUpdate = req.body;
        const teamBoard = await TeamBoard.findOneAndUpdate({_id : teamBoardID}, {$set : teamBoardUpdate})
        res.status(200).json({
            data : teamBoard,
            message : "update team successfully"
        })
    } catch (error) {
        console.log(error, '[error]');
        res.status(400).json({
            error,
            message : "update team fail"
        })
    }
});

router.delete("/:id", permission.hasOwnerBoard, validator.validateTeamBoard(), async (req, res, next ) => {
    try {
        const teamBoardID = req.params.id;
        await TeamBoard.findByIdAndDelete(teamBoardID);
        res.status(200).json({
            data : "",
            message : "delete team successfully"
        })
    } catch (error) {
        console.log(error, '[error]');
        res.status(400).json({
            error,
            message : "delete team fail"
        })
    }
})

router.post("/invite", permission.hasAdminBoard ,async (req, res, next) => {
    try {
        const { userID ,teamBoardID } = req.body;
        const teamBoard = await TeamBoard.findOne({_id : teamBoardID});
        const checkMemberExists = teamBoard.member.find((el) => el.userID === parseInt(userID));
        if(checkMemberExists){
            return res.status(400).json({
                error : "",
                message : "member already exists"
            })
        }
        await TeamBoard.findOneAndUpdate({_id : teamBoardID}, {
            $push : {
                member : {
                    userID
                }
            }
        })
        res.status(200).json({
            data : "",
            message : "invite member successfully"
        })
      
    } catch (error) {
        console.log(error, '[error]');
        res.status(400).json({
            error,
            message : "invite member fail"
        })
    }
});

router.post("/remove", permission.hasAdminBoard, async (req, res, next) => {
    try {
        const { userID, teamBoardID } = req.body;
        const teamBoard = await TeamBoard.findOne({_id : teamBoardID});
        const checkMemberExists = teamBoard.member.find((el) => el.userID === parseInt(userID));
        if(!checkMemberExists){
            return res.status(400).json({
                error : "",
                message : "member does not exist"
            })
        }
        await TeamBoard.findOneAndUpdate({_id : teamBoardID}, {
            $pull : {
                member : {
                    userID
                }
            }
        })
        res.status(200).json({
            data : "",
            message : "remove member successfully"
        })
    } catch (error) {
        console.log(error, '[error]');
        res.status(400).json({
            error,
            message : "remove member fail"
        })
    }
});

module.exports = router;
