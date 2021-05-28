const express = require("express");

const router = express.Router();
const { validationResult } = require("express-validator");
const validator = require("../middlewares/validator");

const TaskModel = require("../models/task.model");

// get all task
router.get("/", async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.status(200).json({
      data: tasks,
      statusCode: 200,
      message: "get all task successfully !",
    });
  } catch (error) {
    res.status(500).json({
      error,
      statusCode: 500,
      message: "get all task fail !",
    });
  }
});

// get task by id
router.get("/:id", async (req, res) => {
  try {
    const id = await TaskModel.findById(req.params.id);
    res.status(200).json({
      data: id,
      statusCode: 200,
      message: "get task by id successfully !",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      statusCode: 500,
    });
  }
});
// create task
router.post("/", validator.validateTask(), async (req, res) => {
  try {
    const errors = validationResult(res);
    console.log("create error:", errors);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const task = await TaskModel.create(req.body);
    res.status(200).json({
      data: task,
      statusCode: 200,
      message: "post task successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});
// delete task
router.delete("/:id", async (req, res) => {
  try {
    const taskID = req.params.id;
    await TaskModel.findBytAndRemove(taskID);
    res.status(200).json({
      statusCode: 200,
      message: "delete task successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      statusCode: 500,
    });
  }
});

// update task
router.put("/:id", validator.validateTask(), async (req, res) => {
  try {
    const errors = validationResult(res);
    console.log("update error:", errors);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const updateTask = req.body;
    console.log(updateTask);
    const task = await TaskModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateTask }
    );
    res.status(200).json({
      data: task,
      statusCode: 200,
      message: "update task successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      statusCode: 500,
    });
  }
});
module.exports = router;
