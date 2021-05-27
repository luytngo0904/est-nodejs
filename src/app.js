var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");
var pathFs = require("path");

var indexRouter = require("./routes/index");
var testRouter = require("./routes/test");
var routerList = require("./routes/lists")
var routerTask = require("./routes/tasks")

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/token", tokenRouter);
app.use("/api/test", testRouter);
app.use("/api/boards", boardRouter);
app.use("/api/lists", routerList);
app.use("/api/tasks", routerTask);

var models_path = pathFs.join(__dirname, "models");

var requiredFile = function (path, regex) {
  const files = fs.readdirSync(path);
  files.forEach((file) => {
    const newPath = path + '/' + file;
    const stat = fs.statSync(newPath);
    if (stat.isFile()){
      if (regex.test(file)) {
        require(newPath);
      };
    };
  });
};

const reg = /(.*)\.(model)\.(js$)/;
requiredFile(models_path, reg);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
