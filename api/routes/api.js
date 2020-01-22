var express = require('express');
var post = require('../controllers/post')
var router = express.Router();
const fs = require('fs')

var multer = require('multer')
var upload = multer({dest: 'uploads/'})

var passport = require('passport');

/* POST a post */
router.post('/post', upload.array('files'), function(req, res, next) {
    console.log('A introduzir um post')
    let newPost = req.body
    if(newPost.files == undefined)
        newPost.files = []
    newPost.date = new Date().toISOString()

    for(var i = 0; i < req.files.length; i++){
        let oldPath = __dirname + '/../' + req.files[i].path
        let newPath = __dirname + '/../public/ficheiros/' + req.files[i].originalname
        console.log("oldPath:" + oldPath + "\newPath: " + newPath)
        fs.rename(oldPath, newPath, function (err){
            if (err) {
                throw err
            }
        })
        let novoFicheiro = {
            name: req.files[i].originalname,
            mimetype: req.files[i].mimetype,
            size: req.files[i].size
        }
        newPost.files.push(novoFicheiro)
    }
    post.insert(newPost)
        .then(dados => {console.log("Adding post " + dados); res.jsonp(dados)})
        .catch(erro => {console.log('Erro ' + erro); res.status(500).jsonp(erro)})
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
router.get('/posts/tag/:tag', function(req, res, next) {
    post.getByTag(req.params.tag)
        .then(dados => { console.log(dados);res.jsonp(dados) })
        .catch(erro => { res.status(500).jsonp(erro) })
})

/* GET all posts sorted by date */
router.get('/posts/sorted', function(req,res){
    post.sortedList()
        .then(dados => { console.log(dados);res.jsonp(dados) })
        .catch(erro => { res.status(500).jsonp(erro) })
})

/* GET all posts by its owner*/
router.get('/posts/poster/:poster', function(req, res, next){
    post.getByPoster(req.params.poster)
        .then(dados => { console.log(dados);res.jsonp(dados) })
        .catch(erro => { res.status(500).jsonp(erro) })	
})

router.get('download/:fnome', function(req, res){
    res.download( __dirname + '/../public/ficheiros' + req.params.fnome)
})

router.post('/comment/:idPost', function(req,res){
    console.log(req.params.idPost)
    console.dir(req.body)
    post.addComment(req.params.idPost, req.body)
        .then(dados => { console.log(dados);res.jsonp(dados) })
        .catch(erro => { res.status(500).jsonp(erro) })
})


module.exports = router;
