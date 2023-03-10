var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// IMPORTS
var indexRouter = require("./routes/index");
var customerRouter = require("./routes/customer");
var productRouter = require("./routes/product");
var employeeRouter = require("./routes/employee");
var categoriesRouter = require("./routes/categories");
var suppliersRouter = require("./routes/suppliers");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// REGISTER ROUTERS
app.use("/", indexRouter);
app.use("/customer", customerRouter);
app.use("/product", productRouter);
app.use("/employee", employeeRouter);
app.use("/categories", categoriesRouter);
app.use("/suppliers", suppliersRouter);

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
