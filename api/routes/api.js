var express = require('express');
var post = require('../controllers/post')
const Post = require('../models/post')
var router = express.Router();


/* POST a post */
router.post('/post', function(req, res, next) {
    var post = new Post(req.body.title)
    post.save()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});

/* GET a post by ID. */
router.get('/post/:id', function(req, res, next) {
    post.getById(req.params.id)
        .then(dados => { res.jsonp(dados) })
        .catch(erro => { res.status(500).jsonp(erro) })
  });

/* GET all posts. */
router.get('/posts', function(req, res, next) {
    console.log('At api /posts')
    post.list()
        .then(dados => { console.log(dados);res.jsonp(dados) })
        .catch(erro => { res.status(500).jsonp(erro) })
});

/* GET all posts by a tag */
router.get('/posts/:tag', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
  


module.exports = router;
