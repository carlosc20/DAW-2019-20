var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var fs = require('fs');
var PDFImage = require("pdf-image").PDFImage;

var passport = require('passport');

var filePath = require('./utils/filePath')

mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Mongo: ready(' + mongoose.connection.readyState + ')'))
  .catch(() => console.log('Mongo: connection error(' + mongoose.connection.readyState + ')'));

var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var tagsRouter = require('./routes/tags')

// auth
var passport = require('passport');
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;


passport.use(
  new JWTStrategy(
    {
      secretOrKey: 'daw2019',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
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
app.use(function(req,res,next){
  let match = req.path.match(/\/ficheiros\/(.+)\/(.+)/)
  if(match){
    let mimeType = req.query.mimeType//match[2].match(/(.*)[.](.*)/)
    let file; 
    if(mimeType == 'application/pdf'){
      let pdfImage = new PDFImage(filePath.getFile(match[1], match[2]) ,{
        graphicsMagick: true,
      })
      pdfImage.convertPage(0)
        .then((imagePath) => {
          fs.readFile(imagePath, (err, data) =>{
            if(!err){
              res.setHeader('Content-type' , 'image/png')
              res.send(data)
            }
            else sendNotFoundImage(res, next)
          })
        })
        .catch(e => {sendNotFoundImage(res, next)})
    } else{
      file = filePath.getFile(match[1], match[2])
      fs.readFile(file, (err, data) =>{
        if(!err)
          res.send(data)
        else sendNotFoundImage(res, next)
      })
    }
  } else {
    next()
  }
})

sendNotFoundImage = (res, next) => {
  fs.readFile('/public/ficheiros/image-not-found.png', (err, data) =>{
    if(!err)
      res.send(data)
    else next()
  })
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.authenticate('jwt', {session: false}));
app.use('/tags', tagsRouter);
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
  res.end()
  //res.render('error');
});

module.exports = app;
