var express = require('express');
var router = express.Router();
var Posts = require('../controllers/posts');
var Users = require('../controllers/users');

var passport = require('passport');


router.get('/', function(req, res) {
  Users.getAll()
    .then(data => {
    //let regex = /\@[^\ ]+/;
    //let str = '@MarcoDantas e por fim @CésarBorges';
    //let mentions = [...str.matchAll(regex)];
    //console.log(mentions)
      res.jsonp(data)})
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
  .then(obj => {
    Promise.all(obj.subscriptions.map(Posts.getByTag))
      .then(result => {
        res.jsonp([].concat(...result).sort(function(a,b){
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        }))})})
  .catch(e => res.status(500).jsonp(e))
})


router.get('/:email', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.get(req.params.email)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});


router.post('/', function(req, res) {
  Users.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/:email/subscription/:sub', function(req, res){
  Users.subscribe(req.params.email, req.params.sub)
    .then(data => res.json(data))
    .catch(e => res.status(500).json(e))
});

router.delete('/:email/subscription/:sub', function(req, res){
  Users.unsubscribe(req.params.email, req.params.sub)
    .then(data => res.json(data))
    .catch(e => res.status(500).json(e))
});
module.exports = router;
