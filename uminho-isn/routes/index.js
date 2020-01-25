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
var urltoken = require('../utils/token');

/* GET home page. */
router.get('/', checkAuth, function(req, res) {
  let tag = req.query.tag
  let user = req.user
  console.dir(user)
  if(tag){
    axios.get((apiHost + '/api/posts/tag/'+ tag))
      .then(dados => {console.log(dados.data); res.render('index', {lista: dados.data, user: user})})
      .catch(e => res.render('error', {error: e}))
  }else{
    axios.get(apiHost + '/api/posts')
      .then(dados => {console.log(dados.data); res.render('index', {lista: dados.data, user: user})})
      .catch(e => res.render('error', {error: e}))
  }
 
});


// login
router.post('/', function(req, res){
  console.log(req)
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

router.get('/profile/:email', checkAuth, function(req, res){
  console.log("I AM HERE")
  axios.get(urltoken.getUrlWithToken(apiHost + '/users/' + req.params.email))
    .then(user => {console.log(user.data);res.render('user', {user: user.data})})
    .catch(erro => res.status(500).render('error', {error: erro}) )
})

// register
router.get('/register', function(req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  let hash = bcrypt.hashSync(req.body.password, 10);
  axios.post(apiHost + '/users', {
    email: req.body.email,
    password: hash,
    name: req.body.name
  })
  .then(_ => res.redirect('/login') )
  .catch(erro => res.status(500).render('error', {error: erro}) )
})

//profile
router.get('/profile/:name', checkAuth, function(req, res){
  axios.get(apiHost + '/users/teste/' + req.params.name)
    .then(user => res.render('user', {user: user.data}))
    .catch(erro => res.status(500).render('error', {error: erro}) )
})


router.get('/subscription/:name/:tag'), /*checkAuth,*/ function(req, res){
  console.log(apiHost + '/api/posts/tag/'+ req.params.tag)
  axios.get(apiHost + '/api/posts/tag/'+ req.params.tag)
      .then(dados => {console.log(dados.data); res.jsonp(dados.data)})
      .catch(e => res.render('error', {error: e}))
}

router.post('/subscription/:name', /*checkAuth,*/ function(req, res){
  console.log(req.body.text)
  axios.post(apiHost + '/users/' + req.params.name + '/subscription/' + req.body.text)
    .then(user => res.redirect('/profile/'+ req.params.name))
    .catch(erro => res.status(500).render('error', {error: erro}) )
})


router.delete('/subscription/:name/:sub', /*checkAuth,*/ function(req, res){
  axios.delete(apiHost + '/users/' + req.params.name + '/subscription/' + req.params.sub)
    .then(user => res.redirect('/profile/'+ req.params.name))
    .catch(erro => res.status(500).render('error', {error: erro}) )
})

// publish
router.get('/publish', checkAuth, function(req, res){
  let user = req.user
  res.render('publish', {user: user})
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

router.get('/logout', function(req,res){
  req.logout()
  res.redirect('/')
})

module.exports = router;
