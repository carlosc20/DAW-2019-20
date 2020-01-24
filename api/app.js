var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var passport = require('passport');

mongoose.connect('mongodb://127.0.0.1:27017/uminho-isn', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Mongo: ready(' + mongoose.connection.readyState + ')'))
  .catch(() => console.log('Mongo: connection error(' + mongoose.connection.readyState + ')'));

var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

// auth
var passport = require('passport');
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;

var extractFromQS = function(req){
  return (req.query && req.query.token) ? req.query.token : null;
}

var extractFromBody = function(req){
  return (req.body && req.body.token) ? req.query.token : null;
}

passport.use(
  new JWTStrategy(
    {
    secretOrKey: 'daw2019',
    jwtFromRequest: ExtractJWT.fromExtractors([extractFromQS, extractFromBody])
    }, 
    async (payload, done) => {
      try{
        return done(null, payload)
      }
      catch(error){
        return done(error)
      }
    }
  )
)

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/api', apiRouter);

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
