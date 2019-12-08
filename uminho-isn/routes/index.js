var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
const apiHost = require('../config/env').apiHost;

/* GET home page. */
router.get('/', checkAuth, function(req, res) {
  console.log(apiHost + '/api/posts')
  axios.get(apiHost + '/api/posts')
    .then(dados => {console.log(dados.data); res.render('index', {lista: dados.data})})
    .catch(e => res.render('error', {error: e}))
});

router.post('/', function(req, res){
  console.dir('LOGIN TEST: ' + req.body)
  res.redirect('/login')
})


router.get('/eventos/:id', checkAuth, function(req, res) {
  axios.get(apiHost + req.params.id)
    .then(dados => res.render('evento', {evento: dados.data}))
    .catch(e => res.render('error', {error: e}))
});

router.get('/login', function(req, res) {
  res.render('login');
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
  var user = req.body;
  axios.post(apiHost + '/users', user)
    .then(dados => {res.redirect('/login') })
    .catch(erro => res.status(500).render('error', {error: erro}))
})

router.get('/publish', checkAuth, function(req, res){
  res.render('publish')
})

router.post('/publish', checkAuth, function(req, res){
  var post = req.body;
  axios.post(apiHost + '/api/post', post)
    .then(dados => res.redirect('/'))
    .catch(erro => res.status(500).render('error', {error: erro}))
})

function checkAuth(req,res,next) {
  console.log("Autenticado:", req.isAuthenticated())
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
