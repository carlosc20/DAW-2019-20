var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
const apiHost = require('../config/env').apiHost;

/* To handle multipat/form-data requests */
const FormData = require('form-data');
const multer = require('multer')
const upload = multer()
var bcrypt = require('bcryptjs')

/* GET home page. */
router.get('/', checkAuth, function(req, res) {
  console.log(apiHost + '/api/posts')
  axios.get(apiHost + '/api/posts')
    .then(dados => {console.log(dados.data); res.render('index', {lista: dados.data})})
    .catch(e => res.render('error', {error: e}))
});


// login
router.post('/', function(req, res){
  res.redirect('/login')
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


// register
router.get('/register', function(req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  let hash = bcrypt.hashSync(req.body.password, 10);
  axios.post(apiHost + '/users', {
    email: req.body.email,
    password: hash
  })
  .then(_ => res.redirect('/login') )
  .catch(erro => res.status(500).render('error', {error: erro}) )
})


// publish
router.get('/publish', checkAuth, function(req, res){
  res.render('publish')
})

router.post('/publish', upload.array('files'), /* checkAuth,*/ function(req, res){
  let form = new FormData()
  console.log(req.files)
  console.log(req.body.title)
  console.log(req.body.description)
  form.append('title', req.body.title)
  form.append('description', req.body.description)
  req.files.forEach(file => {
    form.append('files' , file.buffer, file.originalname)
    console.log(file.originalname)
  })
  console.dir(form)
  axios.post(apiHost + '/api/post', form, {
    headers: {
      'Content-Type': 'multipart/form-data; boundary='+form._boundary
    }
  })
    .then(dados => res.redirect('/'))
    .catch(erro => res.status(500).render('error', {error: erro}))
})

/*
router.get("/ficheiros/:name", function(req,res) {
  axios.get(apiHost + "/ficheiros/" + req.params.name)
    .then(dados => {console.dir(dados.data);res.send(dados.data)})
    .catch(erro => res.status(500).render('error', {error: erro}))
})
*/
function checkAuth(req,res,next) {
  console.log("Autenticado:", req.isAuthenticated())
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect("/login");
  }
}


module.exports = router;
