var express = require('express');
var router = express.Router();
var Posts = require('../controllers/posts');
var Users = require('../controllers/users');
const fs = require('fs')
var mkdirp = require('mkdirp');

var multer = require('multer')
var upload = multer({dest: 'uploads/'})

var passport = require('passport');


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

router.get('/:email/mentions', function(req, res){
  Users.get(req.params.email)
    .then(user => {
      Promise.all(user.mentions.map(Posts.getByIdForMentions))
        .then(result => res.jsonp(result))
    })
    .catch(e => res.status(500).jsonp(e))
})

router.get('/name/:name', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.getByName(req.params.name)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.get('/:email', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.get(req.params.email)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/', function(req, res) {
  console.log(req.body)
  Users.get(req.body.email)
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
            Users.insert(req.body)
            .then(data => res.jsonp(data))
            .catch(e => {console.log("1"); res.status(500).jsonp(e)})
          }
        }).catch(e => {console.log("2");res.status(500).jsonp(e)})
      }
    }).catch(e => {console.log("3"); res.status(500).jsonp(e)})
});


router.post('/group/:name/tag/:tag', function(req, res) {
  let group = {
    name: req.params.tag,
    owner: true
  }
  Users.createGroup(req.params.name, group)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/:name/subscription/private', function(req, res){
  let name = req.params.name
  let request = {
    requester: name,
    group: req.body.identifier.tag
  }
  
  Users.checkRequest(name)
    .then(data => {
      if(data == null){
        Users.insertRequest(req.body.identifier.owner, request)
          .then(data => res.jsonp(data))
          .catch(e => res.status(500).jsonp(e))
      }
      else
        res.status(400).jsonp(e)  
    }).catch(e => res.status(500).jsonp(e))
})




router.post('/:name/subscription/:sub', function(req, res){
  Users.subscribe(req.params.name, req.params.sub)
    .then(data => res.json(data))
    .catch(e => res.status(500).json(e))
});


router.post('/userImg/:name', upload.single('img'), function(req,res){
  console.log(req.file.path)
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
})

router.delete('/:name/subscription/:sub', function(req, res){
  Users.unsubscribe(req.params.name, req.params.sub)
    .then(data => res.json(data))
    .catch(e => res.status(500).json(e))
});
module.exports = router;
