const { check } = require("express-validator");

module.exports.validateBoard = () => [
  check("name", "name does not Empty").not().isEmpty(),
  check("created_by", "created_by dose not Empty").not().isEmpty(),
];

module.exports.validateList = () => [
  check("list_index", "list_index cannot Empty").not().isEmpty(),
  check("name", "name cannot Empty").not().isEmpty(),
  check("board_id", "board_id cannot Empty").not().isEmpty(),
];
module.exports.validateTask = () => [
  check("task_index", "task_index cannot Empty").not().isEmpty(),
  check("name", "name cannot Empty").not().isEmpty(),
  check("description", "description cannot Empty").not().isEmpty(),
  check("list_id", "list_id cannot Empty").not().isEmpty(),
];
