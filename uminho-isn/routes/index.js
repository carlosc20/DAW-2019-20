var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
const lhost = require('../config/env').host;

/* GET home page. */
router.get('/', checkAuth, function(req, res) {
  console.log("ola")
  axios.get(lhost)
    .then(dados => res.render('index', {lista: dados.data}))
    .catch(e => res.render('error', {error: e}))
});

router.get('/eventos/:id', checkAuth, function(req, res) {
  axios.get(lhost + req.params.id)
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

function checkAuth(req,res,next) {
  console.log("Autenticado:", req.isAuthenticated())
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
