var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var apiHost = require('./config/env').apiHost;


// Módulos de suporte à autenticação
var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var axios = require('axios')
var flash = require('connect-flash')
//-----------------------------------

// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'email'}, (email, password, done) => {
    axios.get(apiHost + '/users/' + email)
      .then(dados => {
        const user = dados.data
        console.dir(user)
        if(!user) {
          return done(null, false, {message: 'Utilizador inexistente!\n'})
        }
        if(password != user.password) {
          return done(null, false, {message: 'Password inválida!\n'})
        }
        console.log('Autentificação feita com sucesso')
        return done(null, user)
      })
      .catch(erro => done(erro))
}))

passport.serializeUser((user,done) => {
  console.log('Vou serializar o user: ' + JSON.stringify(user))
  done(null, user.email)
})

passport.deserializeUser((email, done) => {
  console.log('Vou desserializar o utilizador: ' + email)
  axios.get(apiHost + '/users/' + email)
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
  
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
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