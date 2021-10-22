var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//MongoDB Connection
var mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const Handlebars = require('handlebars')

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

var indexRouter = require('./routes/index');
var CountryRouter = require('./routes/country');
var usersRouter = require('./routes/users');
var CityRouter = require('./routes/city');
var CityapiRouter = require('./routes/cityapi');
var CountryapiRouter = require('./routes/countryapi');
var StateapiRouter = require('./routes/stateapi');


var StateRouter = require('./routes/state');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: "main",
  handlebars: allowInsecurePrototypeAccess(Handlebars)
  }));
  app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

//Db Connection Start 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@localhost:27017/admin', { useNewUrlParser: true })
.then(() => console.log('connection succesful'))
.catch((err) => console.error(err))
//DB Connection End


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/country', CountryRouter);
app.use('/state', StateRouter);
app.use('/city', CityRouter);
app.use('/cityapi', CityapiRouter);
app.use('/stateapi', StateapiRouter);
app.use('/countryapi', CountryapiRouter);
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
