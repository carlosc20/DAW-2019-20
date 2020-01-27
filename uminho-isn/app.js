var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var apiHost = require('./config/env').apiHost;
var request = require('request');

var apiReq = require('./utils/api');
var tokenGen = require('./utils/token')


// Módulos de suporte à autenticação
var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session)


// passport
var passport = require('passport')
var googleStrategy = require('./strategies/google').strategy;
var localStrategy = require('./strategies/local').strategy;

passport.use(googleStrategy);
passport.use(localStrategy);

passport.serializeUser((user,done) => {
  console.log('Vou serializar o user: ' + JSON.stringify(user))
  done(null, user.email)
})

passport.deserializeUser((email, done) => {
  console.log('Vou desserializar o utilizador: ' + email)
  apiReq.get('/users/' + email)
  .then(dados => done(null, dados.data))
  .catch(erro => done(erro, false))
})

// routers
var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  genid: req => {
    console.log('Dentro do middleware da sessão...')
    console.log(req.sessionID)
    return uuid()
  },
  store: new FileStore(),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Middleware que devolve os pedidos dos ficheiros
app.use((req, res, next) =>{
  console.log(`Bearer ${tokenGen.genToken()}`)
  if(req.path.startsWith('/ficheiros') || req.path.startsWith('/usersImg')){
    let options = {
      url: apiHost + req.path,
      headers: {
        'User-Agent': 'request',
        'Authorization' : `Bearer ${tokenGen.genToken()}` 
      }
    };
    request.get(options).pipe(res);
  } else if(req.path.startsWith('/download')){  
    let options = {
      url: apiHost + '/api' + req.path,
      headers: {
        'User-Agent': 'request',
        'Authorization' : `Bearer ${tokenGen.genToken()}` 
      }
    };
    request.get(options).pipe(res)
  } else 
    next();
})  
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/post', postRouter);

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