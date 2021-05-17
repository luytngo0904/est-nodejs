var express = require('express');
var router = express.Router();
var ListModel = require('../models/list.model');


var {validationResult} = require('express-validator');
const validator = require("../middlewares/validator");


// get all list 
router.get("/",async function(req, res,next){
    try {
        const lists = await ListModel.find();
        res.status(200).json({
            data:lists,
            message:"get all list successfully!"
        })
    } catch (error) {
        console.log("Error: ",error);
        res.status(500).json({
            error,
            message:"get all list fail!"
        })
        
    }
})
// get list by id
router.get("/:id",async function(req, res, next){
    try {
        const id = req.params.id;
        const  list = await ListModel.findById(id);
        // .populate({path:"board_id"});
        res.status(200).json({
            data:list,
            message:"get list by id successfully!"
        })
    } catch (error) {
        console.log("Error: ",error);
        res.status(500).json({
            error,
            message:"get list by id fail!"
        })
    }
})
// create list
router.post("/", validator.validateBoard(), async function(req, res, next){
    try {
        const errors = validationResult(res);
        console.log("create error:",errors);
        if(!errors.isEmpty()){
            res.status(422).json({ errors: errors.array() });
            return;
        }
        const list = await ListModel.create(req.body)
        res.status(200).json({
            data:list,
            message: "create list successfully!" 
        })
    } catch (error) {
        console.log("Error: ",error);
        res.status(500).json({
            error,
            message:"create list fail!"
        })
    }
})

//update list
router.put("/:id", validator.validateList(),async function(req, res,next){
    try {
        const errors = validationResult(req);
        console.log("update error:",errors);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        const id = req.params.id;
        const updateList = req.body; 
        const list = await ListModel.findByIdAndUpdate(
            {_id:id},
            {$set:updateList}
            // {new:true}
        );
        res.status(200).json({
            data:list,
            message: "update list successfully!"
        })
    } catch (error) {
        console.log("Error: ",error);
        res.status(500).json({
            error,
            message: "update list fail!"
        })
        
    }
})

router.delete("/:id",async function(req, res, next){
    try {
        const id = req.params.id;
        const deleteList = await ListModel.findByIdAndRemove(id);
        res.status(200).json({
            message: "delete list successfully!"
        })
    } catch (error) {
        console.log("Error: ",error);
        res.status(500).json({
            error,
            message: "delete list fail!"
        })
    }
})

module.exports = router