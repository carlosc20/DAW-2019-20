var express = require('express');
var router = express.Router();
var passport = require('passport');
var apiReq = require('../utils/api');

/* To handle multipat/form-data requests */
const FormData = require('form-data');
const multer = require('multer');
const upload = multer();
var bcrypt = require('bcryptjs');


function checkAuth(req,res,next) {
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect("/login");
  }
}


router.post('/login', passport.authenticate('local', {  
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/login', function(req, res) {
  res.render('login');
});

/* GET home page. */
router.get('/', checkAuth, function(req, res) {
  let tag = req.query.tag 
  let user = req.user
  let search = req.query.search
  let page = parseInt(req.query.page) || 0

  if(search && search != null && search != ''){
      let match = search.match(/(.+):(.+)/)
      if(match){
          apiReq.get('/api/post/fuzzy/' + match[1] + '/' + match[2] + '?page=' + page)
              .then(dados => {res.render('index', {lista: dados.data, user: user, page: page, search: search})})
              .catch(erro => res.render('error', {error: e}))
      }else{
          apiReq.get('/api/post/fuzzy/title/' + search + '?page=' + page)
              .then(dados => {res.render('index', {lista: dados.data, user: user, page: page, search: search})})
              .catch(erro => res.render('error', {error: e}))
      }
  } else if(tag){
    apiReq.get('/api/posts/tag/'+ tag + '?page=' + page)
      .then(dados => { res.render('index', {lista: dados.data, user: user, page: page})})
      .catch(e => res.render('error', {error: e}))
  } else {
    apiReq.get('/api/posts' + '?page=' + page)
      .then(dados => { res.render('index', {lista: dados.data, user: user, page: page})})
      .catch(e => res.render('error', {error: e}))
  }
});


router.get('/profile/:name', checkAuth, function(req, res){
  apiReq.get('/users/name/' + req.params.name)
    .then(user => {
      apiReq.get('/users/mentions/' + req.params.name)
        .then(result => {
          res.render('user', {user: req.user, userProfile: user.data, mentions: result.data})
        }).catch(erro => res.status(500).render('error', {error: erro}))
    })
    .catch(erro => res.status(500).render('error', {error: erro}))
})


router.get('/subscriptions', checkAuth, function(req, res){
  apiReq.get('/tags')
    .then(response =>{res.render('subscriptions', {user: req.user, tags: response.data})})
    .catch(e => res.status(500).render('error', {error: erro}))
})


// register
router.get('/register', function(req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  let hash = bcrypt.hashSync(req.body.password, 10);
  apiReq.post('/users', {
    email: req.body.email,
    password: hash,
    name: req.body.name,
    type: "local"
  })
  .then(_ => res.redirect('/login') )
  .catch(erro => {
    if(erro.response.data.erro == 'email' || erro.response.data.erro == 'name')
      res.render('register', {erro: erro.response.data.erro})
    else
      res.status(500).render('error', {error: erro})})
})

router.post('/answer/:ans/request/:tag/:requester', checkAuth, function(req, res){
  if(req.params.ans == "true"){
    console.log("accepting request")
    console.log(req.params.requester)
    console.log(req.params.ans)
    apiReq.post('/users/' + req.params.requester + '/subscription/' + req.params.tag)
      .then(dados => {
        apiReq.delete('/users/' + req.user.name + '/request/' + req.params.requester + '/' + req.params.tag)
          .then(dados => res.jsonp())
          .catch(erro => res.status(500).render('error', {error: erro}))
      })
      .catch(erro => res.status(500).render('error', {error: erro}))
  }
  else{
    console.log("declining request")
    apiReq.delete('/users/' + req.user.name + '/request/' + req.params.requester + '/' + req.params.tag)
      .then(dados => res.jsonp())
      .catch(erro => res.status(500).render('error', {error: erro}))
  }
})


router.post('/subscription/group', checkAuth, function(req, res){
  apiReq.post('/users/group/' + req.user.name + '/tag/' + req.body.text)
    .then(dados => res.redirect('/subscriptions'))
    .catch(erro => res.status(500).render('error', {error: erro}))
})

router.post('/subscription/request/:tag', checkAuth, function(req, res){
  let tag = req.params.tag
  let name = req.user.name
  apiReq.post('/users/' + name + '/subscription/request/' + tag)
    .then(user => res.redirect('/profile/'+ name))
    .catch(erro => {
      console.log(erro)
        res.status(500).jsonp(erro.response.data)
    })
})


// outros
router.post('/subscription/public/:tag', checkAuth, function(req, res){
  let tag = req.params.tag
  let array = req.user.subscriptions
  let name = req.user.name
  let b = true
  for(var i = 0; i<array.length; i++){
    if(array[i].tag == tag){
      b = false
    }
  }
  if(b){
    apiReq.post('/users/' + name + '/subscription/' + tag)
      .then(user => res.redirect('/profile/'+ name))
      .catch(erro => res.status(500).render('error', {error: erro}))     
  }
  else
    res.status(500).jsonp({erro: "Subscrição já foi feita"})
})

router.post('/profile/:name/image', upload.single('img'), checkAuth, function(req, res){
  let form = new FormData()
  let name = req.params.name
  form.append('img', req.file.buffer, req.file.originalname)
  apiReq.post('/users/userImg/' + name, form,{
    headers: {
      'Content-Type': 'multipart/form-data; boundary='+form._boundary
    }
  })
    .then(user => res.redirect('/profile/'+ name))
    .catch(erro => res.status(500).render('error', {error: erro}))
})


router.get('/profile/:name/image', checkAuth, function(req, res){
  apiReq.get_bin('/users/' + req.params.name + '/image').pipe(res)
})

router.delete('/subscription/:name/tag/:sub', checkAuth, function(req, res){
  apiReq.delete('/users/' + req.params.name + '/subscription/' + req.params.sub)
    .then(user => res.jsonp(user.email))
    .catch(erro => res.status(500).render('error', {error: erro}) )
})

// publish
router.get('/publish', checkAuth, function(req, res){
  let user = req.user
  apiReq.get('/tags')
    .then(tags =>{console.dir(tags.data); res.render('publish', {user: user, tags: tags.data})})
    .catch(erro => res.status(500).render('error', {error: erro}))
})

router.post('/publish',  checkAuth, upload.array('files'), function(req, res){
  console.dir(req.body)
  let form = new FormData()
  form.append('title', req.body.title)
  form.append('description', req.body.description)
  console.log(req.body)
  form.append('poster', req.user.name)
  if(req.body.tags && Array.isArray(req.body.tags)){
    for(let i = 0; i < req.body.tags.length; i++){
      console.log('tags', req.body.tags[i])
      form.append('tags', req.body.tags[i]) 
      
    }
  } else if(req.body.tags){
    console.log('tags', req.body.tags) 
    form.append('tags', req.body.tags)
    
  }
  if(req.files)
    req.files.forEach(file => {
      console.log(file.buffer)
      form.append('files' , file.buffer, file.originalname)
    })
  apiReq.post('/api/post', form, {
    headers: {
      'Content-Type': 'multipart/form-data; boundary='+form._boundary
    }
  })
  .then(dados => res.redirect('/'))
  .catch(erro => res.status(500).render('error', {error: erro}))
})

router.post('/comment/:idPost/:email', checkAuth, function(req,res){
  req.body.owner = req.params.email
  apiReq.post('/api/comment/' + req.params.idPost, req.body)
    .then(dados => res.redirect('/post/' + req.params.idPost))
    .catch(erro => res.status(500).render('error', {error: erro}))
})

/**
 * Respondes to axios in client side
 */
router.post('/comment/upvote/:idComment/:email', checkAuth, function(req, res){
  apiReq.post('/api/comment/upvote/' + req.params.idComment +'/' + req.params.email)
    .then(dados => { res.jsonp(dados.data)})
    .catch(erro => { res.status(500).render('error', {error: erro})})
})

/**
 * Respondes to axios in client side
 */
router.post('/comment/downvote/:idComment/:email', checkAuth, function(req, res){
  apiReq.post('/api/comment/downvote/' + req.params.idComment +'/' + req.params.email)
    .then(dados => { res.jsonp(dados.data)})
    .catch(erro => res.status(500).render('error', {error: erro}))
})

router.get('/logout', function(req,res){
  req.logout()
  res.redirect('/')
})


module.exports = router;
