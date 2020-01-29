var express = require('express');
var router = express.Router();
var Posts = require('../controllers/posts');
var Users = require('../controllers/users');
var Tags = require('../controllers/identifiers');
const fs = require('fs')
var mkdirp = require('mkdirp');

var multer = require('multer')
var upload = multer({dest: 'uploads/'})

router.get('/', function(req, res) {
  Users.getAll()
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

//para sair
router.get('/teste/:name',function(req, res) {
  Users.getByName(req.params.name)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.get('/:email/subscriptions', function(req, res) {
  Users.getSubscriptions(req.params.email)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

/* Get all posts by user tags */
router.get('/:email/posts', function(req, res){
  Users.getSubscriptions(req.params.email)
  .then(user => {
    Promise.all(user.subscriptions.map(Posts.getByTag))
      .then(result => 
        res.jsonp([].concat(...result).sort(function(a,b){
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })))})
  .catch(e => res.status(500).jsonp(e))
})

router.get('/mentions/:name', function(req, res){
  Users.getByName(req.params.name)
    .then(user => {
      Promise.all(user.mentions.map(Posts.getByIdForMentions))
        .then(result => {
          let filtered = result.filter(function(value, index, arr){
            return value != null
          })
          res.jsonp(filtered)})
        .catch(e => res.status(500).jsonp(e))
    })
    .catch(e => res.status(500).jsonp(e))
})

router.get('/name/:name', function(req, res) {
  Users.getByName(req.params.name)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.get('/:email', function(req, res) {
  Users.get(req.params.email)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/', function(req, res) {
  console.log('AT /users')
  console.log(req.body)
  let email = ""
  // in case its a post from google api
  if(req.body.email && req.body.email.value && req.body.email.verified){
    email = req.body.email.value
  } else if(req.body.email && req.body.email.value && !req.body.email.verified) {
    res.status(400).jsonp({erro:"Google authentication failed"})
  } else {
    email = req.body.email
  }
  console.log('email', email, req.body.email )
  Users.get(email)
    .then(user => {
      console.log(user)
      if(user != null)
        res.status(400).jsonp({erro: "email"})
      else{
        Users.getByName(req.body.name)
        .then(user => {
          console.log(user)
          if(user != null)
            res.status(400).jsonp({erro:"nome"})
          else {
            let user = JSON.parse(JSON.stringify(req.body))
            user.email = email
            Users.insert(user)
            .then(data => res.jsonp(data))
            .catch(e => {console.log("1"); res.status(500).jsonp(e)})
          }
        }).catch(e => {console.log("2");res.status(500).jsonp(e)})
      }
    }).catch(e => {console.log("3"); res.status(500).jsonp(e)})
});


router.post('/group/:name/tag/:tag', function(req, res) {
  let name = req.params.name
  let identifier = {
    tag: req.params.tag,
    public: false,
    owner: name
  }
  Tags.get(identifier.tag)
    .then(r => {
      if(r == null){
        console.log("no group with that tag")
        Tags.insert(identifier)
          .then(r => {
            Users.subscribe(name, identifier)
              .then(data => res.jsonp(data))
              .catch(e => {console.log("1");res.status(500).jsonp(e)})
          }).catch(e => {console.log("2");res.status(500).jsonp(e)})
        }
      else
        res.status(400).jsonp({erro: "tag não disponível"})
    }).catch(e => {console.log("3");res.status(500).jsonp(e)})
});

router.delete('/:name/request/:requester/:tag', function(req, res){
  Users.removeRequest(req.params.name, req.params.requester, req.params.tag)
    .then(r => res.jsonp(r))
    .catch(e => res.status(500).jsonp(e))
})

router.post('/:name/subscription/request/:tag', function(req, res){
  let name = req.params.name
  let tag = req.params.tag
  Users.getByName(name)
    .then(found => {
      let b = false
      for(var i = 0; i < found.subscriptions.length; i++){
          let sub = found.subscriptions[i]
          console.log(sub)
            if(tag == sub.tag){
              b = true
            }
          }
      if(b){
        console.log("boolean " + b)
        res.status(406).jsonp({erro: "Subscrição já foi feita"})
      }
      else{
        console.log("boolean " +b)
        Tags.get(tag)
        .then(identifier => {
          console.log(identifier)
          if(identifier == null)
            res.status(400).jsonp({erro: "Essa tag não existe"})
          else{
            let owner = identifier.owner
            let request = {
              requester: name,
              tag: tag
            }
            Users.checkRequest(owner, name, tag)
              .then(data => {
              if(data == null){
                Users.insertRequest(owner, request)
                  .then(data => res.jsonp(data))
                  .catch(e => res.status(500).jsonp(e))
                }
              else
                res.status(406).jsonp({erro: "Pedido já foi efetuado"}) 
              }).catch(e => res.status(500).jsonp(e))
          }
        }).catch(e => res.status(500).jsonp(e))
      }
    }).catch(e => res.status(500).jsonp(e))
})

//deixar adicionar se não existir?
router.post('/:name/subscription/:tag', function(req, res){
  let name = req.params.name
  let tag = req.params.tag
  Tags.get(tag)
    .then(identifier => {
      if(identifier == null){
        console.log("oi")
        res.status(400).jsonp({name: tag})
      }
      else{
        Users.subscribe(name, identifier)
          .then(data => res.json(data))
          .catch(e => res.status(500).json(e))
      }
    }).catch(e => res.status(500).jsonp(e))
});


router.delete('/:name/subscription/:sub', function(req, res){
  Users.unsubscribe(req.params.name, req.params.sub)
    .then(data => res.json(data))
    .catch(e => res.status(500).json(e))
});


router.post('/userImg/:name', upload.single('img'), function(req,res){
  console.log(req.file.path)
  if(/image\/.+/.test(req.file.mimetype)){
    let userName = req.params.name 
    let oldPath = __dirname + '/../' + req.file.path
    let newDir = __dirname + '/../public/usersImg/' + userName
    let newPath = newDir + '/' + req.file.originalname

    let novaImg = {
      name: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
    
    Users.insertImage(userName, novaImg)
      .then(r => {
        console.log(r)
        mkdirp(newDir, function(err) {
          if(err){
            res.status(500).jsonp()
            console.log("cant make dir")
            throw err
          }
          else{
            fs.rename(oldPath, newPath, function (err){
              if (err){ 
                console.log("cant rename")
                throw err}
              console.log("img: " + novaImg.name, "; user name: " + userName)
              console.log("Saved img at: "+  newPath)
            })
          }
      })
      res.jsonp(r)
    })
      .catch(erro => {console.log(erro); res.status(500).jsonp(erro)})
  }
  else
    res.status(406).jsonp({erro: "wrong mimetype"})
})

router.get('/:name/image', function(req,res){
  Users.getByName(req.params.name)
    .then(user => {
      fs.readFile('public/usersImg/' + user.name + '/' + user.image.name, (err, data) =>{
        if(!err)
          res.end(data)
        else {
          console.log(err)
          res.status(500).end()
        }
      })
    })
    .catch(e => res.status(500).json(e))
})


module.exports = router;
