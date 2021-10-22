var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session')

//db connection
mongoose.Promise = global.Promise
mongoose.connect("mongodb://admin:admin@localhost:27017/admin")
.then(() => console.log('connection established'))
.catch((err) => console.log(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var productRouter = require('./routes/product');
var categoryRouter = require('./routes/category');
var adminRouter = require('./routes/admin');
var categoryapiRouter = require('./routes/categoryapi');
var productapiRouter = require('./routes/productapi');
var adminapiRouter = require('./routes/adminapi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));
app.use('/categoryapi', categoryapiRouter);
app.use('/productapi', productapiRouter);
app.use('/product', productRouter);

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
