var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs =require('express-handlebars');
var mongoose = require('mongoose');
// var session = require('express-session');
const fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@localhost:27017/admin')
// mongoose.connect('mongodb://username:password@host:port/database?options...');
.then(()=>console.log("Connection open"))
.catch(()=>console.log("Error"))

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',exphbs({
  defaultLayout:"main",
}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
