"use strict";

var express = require('express');
var Posts = require('../controllers/posts')
var Users = require('../controllers/users')
var router = express.Router();
const fs = require('fs')
var mkdirp = require('mkdirp');

var passport = require('passport');

var multer = require('multer')
var upload = multer({dest: 'uploads/'})

var filePath = require('../utils/filePath')

/* POST a post */
router.post('/post', upload.array('files'), function(req, res, next) {
    let newPost = req.body
    if(newPost.files == undefined)
        newPost.files = []
    newPost.date = new Date().toISOString()

    for(let i = 0; i < req.files.length; i++){
        let novoFicheiro = {
            name: req.files[i].originalname,
            mimetype: req.files[i].mimetype,
            size: req.files[i].size
        }
        newPost.files.push(novoFicheiro)
    }
    Posts.insert(newPost)
        .then(dados => {
            for(let i = 0; i < dados.files.length;  i++){
                let oldPath = __dirname + '/../' + req.files[i].path
                mkdirp(filePath.getFilePath(dados._id, dados.files[i].name), function(err) { 
                    if(err){
                        Posts.delete(dados._id)
                        throw err
                    } 
                    else {
                        fs.rename(oldPath, filePath.getFile(dados._id, dados.files[i].name), function (err){
                            if (err) {
                                Posts.delete(dados._id)
                                throw err
                            }
                            console.log("file: " + dados.files[i].name, "; post id: " + dados._id)
                            console.log("Saved file at: "+  filePath.getFile(dados._id, dados.files[i].name))
                        })
                    }
                });
            }
            res.jsonp(dados)
        })
        .catch(erro => {console.log('Erro ' + erro); res.status(500).jsonp(erro)})
});


/* GET a post by ID. */
router.get('/post/:id', function(req, res, next) {
    Posts.getById(req.params.id)
        .then(dados => { res.jsonp(dados) })
        .catch(erro => { res.status(500).jsonp(erro) })
  });

/* GET all posts. */
router.get('/posts', function(req, res, next) {
    Posts.list()
        .then(dados => {
            let result = addTimeSwapToPostList(dados)
            res.jsonp(result)
        })
        .catch(erro => { res.status(500).jsonp(erro) })
});

function addTimeSwapToPostList(lista){
    var nowDate = new Date()
    return lista.map(post => {
        console.log(post)
        let newPost = JSON.parse(JSON.stringify(post))
        let timeSwap = Math.floor(Math.abs(nowDate - new Date(post.date))/1000/60); 
        console.log("timeSwap " + timeSwap)
        if(timeSwap == 0) newPost.timeSwap = 'agora'
        else if(timeSwap < 60) newPost.timeSwap = timeSwap + ' mins'
        else if(timeSwap < 1440) newPost.timeSwap = Math.floor(timeSwap/60) + ' horas'
        else if(timeSwap < 30*1440) newPost.timeSwap = Math.floor(timeSwap/(30*60)) + ' dias'
        else if(timeSwap < 24*1440*30) newPost.timeSwap = Math.floor(timeSwap/(60*24*30)) + ' meses'
        else newPost.timeSwap = Math.floor(timeSwap/(365*60*24*30)) + ' anos'
        return newPost
    })
}

/* GET all posts by a tag */
router.get('/posts/tag/:tag', function(req, res, next) {
    Posts.getByTag(req.params.tag)
        .then(dados => { 
            let result = addTimeSwapToPostList(dados)
            res.jsonp(result)
        })
        .catch(erro => { res.status(500).jsonp(erro) })
})

/* GET all posts sorted by date */
router.get('/posts/sorted', function(req,res){
    Posts.sortedList()
        .then(dados => { 
            let result = addTimeSwapToPostList(dados)
            res.jsonp(result) })
        .catch(erro => { res.status(500).jsonp(erro) })
})

/* GET all posts by its owner*/
router.get('/posts/poster/:poster', function(req, res, next){
    Posts.getByPoster(req.params.poster)
        .then(dados => { 
            let result = addTimeSwapToPostList(dados)
            res.jsonp(result) })
        .catch(erro => { res.status(500).jsonp(erro) })	
})

router.get('/download/:fnome', function(req, res){
    console.log( __dirname + '/../public/ficheiros/' + req.params.fnome)
    res.download( __dirname + '/../public/ficheiros/' + req.params.fnome)
})

router.post('/comment/:idPost', function(req,res){
    //console.log(req.params.idPost)
    //console.dir(req.body)
    req.body.date = new Date().toISOString()
    let comment = req.body
    let regex = /@[^\ ]+/g;
    //let mentions = dados.comments.map(match(regex).map(substr(1)));
    //mentions.map(Users.insertMention)
    let mentions = (comment.text.match(regex))
    mentions.forEach(m => Users.insertMention(m.substr(1), req.params.idPost))
    Posts.addComment(req.params.idPost, req.body)
        .then(dados => { res.jsonp(dados) })
        .catch(erro => { res.status(500).jsonp(erro) })
})

module.exports = router;
