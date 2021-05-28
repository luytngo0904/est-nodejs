const express = require("express");

const router = express.Router();
const { validationResult } = require("express-validator");
const ListModel = require("../models/list.model");

const validator = require("../middlewares/validator");

// get all list
router.get("/", async (req, res) => {
  try {
    const lists = await ListModel.find();
    res.status(200).json({
      data: lists,
      message: "get all list successfully!",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      error,
      message: "get all list fail!",
    });
  }
});
// get list by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const list = await ListModel.findById(id);
    // .populate({path:"board_id"});
    res.status(200).json({
      data: list,
      message: "get list by id successfully!",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      error,
      message: "get list by id fail!",
    });
  }
});
// create list
router.post("/", validator.validateBoard(), async (req, res) => {
  try {
    const errors = validationResult(res);
    console.log("create error:", errors);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const list = await ListModel.create(req.body);
    res.status(200).json({
      data: list,
      message: "create list successfully!",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      error,
      message: "create list fail!",
    });
  }
});

// update list
router.put("/:id", validator.validateList(), async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log("update error:", errors);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const updateList = req.body;
    const list = await ListModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateList }
      // {new:true}
    );
    res.status(200).json({
      data: list,
      message: "update list successfully!",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      error,
      message: "update list fail!",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const listID = req.params.id;
    await ListModel.findByIdAndRemove(listID);
    res.status(200).json({
      message: "delete list successfully!",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      error,
      message: "delete list fail!",
    });
  }
});

module.exports = router;
