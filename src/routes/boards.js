const express = require("express");

const router = express.Router();
const { validationResult } = require("express-validator");
const Board = require("../models/board.model");

const validator = require("../middlewares/validator");
// get all board
router.get("/", async (req, res) => {
  try {
    const boards = await Board.find().populate({ path: "created_by" });
    return res.status(200).json({
      data: boards,
      message: "get all board successfully !",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: "get all board fail !",
    });
  }
});

// get board by id
router.get("/:id", async (req, res) => {
  try {
    const boardID = req.params.id;
    const board = await Board.findById(boardID).populate({
      path: "created_by",
    });
    return res.status(200).json({
      data: board,
      message: "get board details successfully !",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: "get board details fail !",
    });
  }
});

// create board
router.post("/", validator.validateBoard(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const board = await Board.create(req.body);
    return res.status(200).json({
      data: board,
      message: "created board successfully !",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: "created board fail !",
    });
  }
});

// update board
router.put("/:id", validator.validateBoard(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const boardID = req.params.id;
    const boardUpdate = req.body;
    const board = await Board.findOneAndUpdate(
      { _id: boardID },
      { $set: boardUpdate }
    );
    return res.status(200).json({
      data: board,
      message: "update board successfully !",
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

// delete board
router.delete("/:id", async (req, res) => {
  try {
    const boardID = req.params.id;
    await Board.findByIdAndDelete({ _id: boardID });
    return res.status(200).json({
      message: "deleted board successfully !",
    });
  } catch (error) {
    return res.status(400).json({
      message: "deleted board fail !",
    });
  }
});

module.exports = router;
