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

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var flash = require('connect-flash')

var bcrypt = require('bcryptjs')

//-----------------------------------


// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'email'}, (email, password, done) => {
    apiReq.get('/users/' + email)
      .then(dados => {
        const user = dados.data
        console.dir(user)
        if(!user) {
          return done(null, false, {message: 'Utilizador inexistente!\n'})
        }
        if(!bcrypt.compareSync(password, user.password)) {
          return done(null, false, {message: 'Password inválida!\n'})
        }
        return done(null, user)
      })
      .catch(erro => done(erro))
}))


passport.serializeUser((user,done) => {
  done(null, user.email)
})

passport.deserializeUser((email, done) => {
  apiReq.get('/users/' + email)
  .then(dados => done(null, dados.data))
  .catch(erro => done(erro, false))
})



var indexRouter = require('./routes/index');
var postIndex = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  genid: req => {
    return uuid()
  },
  store: new FileStore(),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
  
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Middleware que devolve os pedidos dos ficheiros
app.use((req, res, next) =>{
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
app.use('/post', postIndex);

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