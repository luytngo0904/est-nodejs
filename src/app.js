/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fs = require("fs");
const pathFs = require("path");

<<<<<<< HEAD
var indexRouter = require("./routes/index");
var testRouter = require("./routes/test");
var boardRouter = require("./routes/boards")
var tokenRouter = require("./routes/token");
=======
const indexRouter = require("./routes/index");
const boardRouter = require("./routes/boards");
>>>>>>> master
const verifyToken = require("./middlewares/auth");

const app = express();

// view engine setup
app.set("views", pathFs.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(pathFs.join(__dirname, "public")));

app.use("/", verifyToken, indexRouter);
app.use("/api/boards", verifyToken, boardRouter);

// eslint-disable-next-line camelcase
const models_path = pathFs.join(__dirname, "models");

const requiredFile = (path, regex) => {
  const files = fs.readdirSync(path);
  files.forEach((file) => {
    const newPath = `${path}/${file}`;
    const stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (regex.test(file)) {
        require(newPath);
      }
    }
  });
};

const reg = /(.*)\.(model)\.(js$)/;
requiredFile(models_path, reg);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
