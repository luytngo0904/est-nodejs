var express = require('express');
var router = express.Router();
var ListModel = require('../model/list.model');

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
router.post("/", async function(req, res, next){
    try {
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
router.put("/:id",async function(req, res,next){
    try {
        const id = req.params.id;
        const updateList = req.body; 
        const list = await ListModel.findByIdAndUpdate(
            {_id:id},
            updateList,
            {new:true}
        )
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