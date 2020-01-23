"use strict";

var express = require('express');
var post = require('../controllers/posts')
var router = express.Router();
const fs = require('fs')


var passport = require('passport');


var multer = require('multer')
var upload = multer({dest: 'uploads/'})

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
        .then(dados => {console.log("Adding post " + dados);
                        let regex = /@[^\ ]+/g;
                        let str = dados.description;
                        let mentions = str.match(regex).map(substr(1));
                        console.log(mentions)
                        res.jsonp(dados)
                    })
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
    post.list()
        .then(dados => {let result = dados.map(post => {
                let newPost = JSON.parse(JSON.stringify(post))
                let timeSwap = Math.floor(Math.abs(new Date() - new Date(post.date))/1000/60); 
                if(timeSwap == 0) newPost.timeSwap = 'agora'
                else if(timeSwap < 60) newPost.timeSwap = timeSwap + ' mins'
                else if(timeSwap < 3600) newPost.timeSwap = Math.floor(timeSwap/60) + ' horas'
                else if(timeSwap < 24*3600) newPost.timeSwap = Math.floor(timeSwap/(24*60)) + ' dias'
                else if(timeSwap < 24*3600*30) newPost.timeSwap = Math.floor(timeSwap/(60*24*30)) + ' meses'
                else newPost.timeSwap = Math.floor(timeSwap/(365*60*24*30)) + ' anos'
                return newPost
            })
            res.jsonp(result) 
        })
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
