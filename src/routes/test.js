var express = require("express");
var router = express.Router();
const Test = require("../model/test.model");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const results = await Test.find();
  res.status(200).send({ data: results, statusCode: 200 });
});
router.get("/:id", async function (req, res, next) {
  const result = await Test.findById(req.params.id);
  res.status(200).send({ data: result, statusCode: 200 });
});

module.exports = router;
