var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
const lhost = require('../config/env').host;
const apiHost = require('../config/env').apiHost;

/* GET home page. */
router.get('/', checkAuth, function(_, res) {
  axios.get(lhost)
    .then(dados => res.render('index', {lista: dados.data}))
    .catch(e => res.render('error', {error: e}))
});

router.post('/', function(req, res){
  console.dir('LOGIN TEST: ' + req.body)
  res.redirect('/login')
})


router.get('/eventos/:id', checkAuth, function(req, res) {
  axios.get(lhost + req.params.id)
    .then(dados => res.render('evento', {evento: dados.data}))
    .catch(e => res.render('error', {error: e}))
});

router.get('/login', function(req, res) {
  res.render('login')
});

router.post('/login', passport.authenticate('local', {  
    successRedirect: '/',
    successFlash: 'Utilizador autenticado com sucesso!',
    failureRedirect: '/login',
    failureFlash: 'Utilizador ou password inválido(s)...'
  })
);

router.get('/regist', function(req, res){
  res.render('regist');
})

router.post('/regist', function(req, res){
  console.log('I am at regist POST')
  var user = req.body;
  axios.post( apiHost + '/users', user)
    .then(dados => {res.redirect('/login') })
    .catch(erro => res.status(500).render('error', {error: erro}))
})

function checkAuth(req,res,next) {
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
