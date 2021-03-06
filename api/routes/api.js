var express = require('express');
var Posts = require('../controllers/posts')
var Users = require('../controllers/users')
var Tags = require('../controllers/identifiers')
var router = express.Router();
const fs = require('fs')
var mkdirp = require('mkdirp');
var zip = require('express-zip');


var multer = require('multer')
var upload = multer({dest: 'uploads/'})

var filePath = require('../utils/filePath')
var tagComparer = require('../utils/tagComp')

/* POST a post */

router.post('/post', upload.array('files'), function(req, res, next) {
    let newPost = req.body
    let postTags = newPost.tags
    console.dir(newPost.tags)
    if(postTags == null || postTags == undefined)
        res.status(400).jsonp({erro: "no tag selected"})
    else{
    if(!Array.isArray(postTags))
        postTags = [postTags]
    Promise.all(postTags.map(Tags.get))
        .then(resultTags => {
            console.log('resultTags', resultTags)
            Users.getByName(newPost.poster)
                .then(user => {
                    console.log(user)
                    if(tagComparer.checkTags(resultTags, user.subscriptions)){
                        newPost.tags = resultTags
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
                                                console.log("Saved file at: " + filePath.getFile(dados._id, dados.files[i].name))
                                            })
                                        }
                                    });
                                }
                                res.jsonp(dados)
                            })
                            .catch(erro => {console.log('Erro ' + erro); res.status(500).jsonp(erro)})  
                        }
                    else
                        res.status(406).jsonp({erro: "permission denied"})
            }).catch(erro => {console.log('Erro ' + erro); res.status(500).jsonp(erro)})
    }).catch(erro => {console.log('Erro ' + erro); res.status(500).jsonp(erro)})
}
})

/* GET all posts by a tag */
router.get('/posts/tag/:tag/:name', function(req, res, next) {
    let page = req.params.page || 0
    Tags.get(req.params.tag)
        .then(ident => {
            if(ident.public){
                console.log("oioioioio")
                Posts.getByTag(req.params.tag, page)
                .then(dados => { 
                    let result = addTimeSwapToList(dados)
                    res.jsonp(result)
                })
                .catch(erro => { res.status(500).jsonp(erro) })
            }
            else{
                Users.getByName(req.params.name)
                .then(user => {
                    console.log(user)
                    let b = false
                    for(var i = 0; i < user.subscriptions.length; i++)
                        if(user.subscriptions[i].tag == req.params.tag)
                            b=true
                    if(b){
                        Posts.getByTag(req.params.tag, page)
                            .then(dados => { 
                                let result = addTimeSwapToList(dados)
                                res.jsonp(result)
                            })
                            .catch(erro => { res.status(500).jsonp(erro) })
                    }
                    else
                        res.status(406).jsonp({erro: "not authorized"}) 
                })
            }
        })   
})


/* GET a post by ID. */
router.get('/post/:id/:name', function(req, res, next) {
    Posts.getById(req.params.id)
        .then(dados => { 
            let resultTags = dados.tags
            Users.getByName(req.params.name)
                .then(user => {
                    if(tagComparer.checkTags(resultTags, user.subscriptions)){
                        let post = JSON.parse(JSON.stringify(dados));
                        post.comments = addTimeSwapToList(post.comments)
                        res.jsonp(post)
                    }
                    else{
                        res.status(406).jsonp({erro: "not authorized"})
                    }}).catch(erro => { res.status(500).jsonp(erro) })
            }).catch(erro => { res.status(500).jsonp(erro) })
  });

/* GET all posts. */
router.get('/posts/:name', function(req, res, next) {
    let page = 0
    if(req.query.page) page = req.query.page
    Posts.sortedList(page)
        .then(dados => {
            console.log("oiioio")
            Users.getByName(req.params.name)
                .then(user => {
                    console.log(user)
                    let filtered = dados.filter(function(value, index, arr){
                        if(tagComparer.checkTags(value.tags, user.subscriptions))
                            return value
                      })
                    console.log(filtered)
                    let result = addTimeSwapToList(filtered)
                    res.jsonp(result)
                })
        })
        .catch(erro => { res.status(500).jsonp(erro) })
});

function addTimeSwapToList(lista){
    var nowDate = new Date()
    return lista.map(post => {
        let newPost = JSON.parse(JSON.stringify(post))
        let timeSwap = Math.floor(Math.abs(nowDate - new Date(post.date))/1000/60); 
        if(timeSwap == 0) newPost.timeSwap = 'agora'
        else if(timeSwap < 60) newPost.timeSwap = timeSwap + ' mins'
        else if(timeSwap < 1440) newPost.timeSwap = Math.floor(timeSwap/60) + ' horas'
        else if(timeSwap < 30*1440) newPost.timeSwap = Math.floor(timeSwap/(30*60)) + ' dias'
        else if(timeSwap < 24*1440*30) newPost.timeSwap = Math.floor(timeSwap/(60*24*30)) + ' meses'
        else newPost.timeSwap = Math.floor(timeSwap/(365*60*24*30)) + ' anos'
        return newPost
    })
}

/* GET all posts sorted by date */
router.get('/posts/sorted/:name', function(req,res){
    Posts.sortedList()
        .then(dados => { 
            Users.getByName(req.params.name)
                .then(user => {
                    let filtered = dados.filter(function(value, index, arr){
                        if(tagComparer.checkTags(value.tags, user.subscriptions))
                            return value
                      })
                    let result = addTimeSwapToList(filtered)
                    res.jsonp(result) }).catch(erro => { res.status(500).jsonp(erro) })
                }).catch(erro => { res.status(500).jsonp(erro) })
})

/* GET all posts by its owner*/
router.get('/posts/poster/:poster', function(req, res, next){
    Posts.getByPoster(req.params.poster)
        .then(dados => { 
            Users.getByName(req.params.name)
                .then(user => {
                    let filtered = dados.filter(function(value, index, arr){
                        if(tagComparer.checkTags(value.tags, user.subscriptions))
                            return value
                      })
                    let result = addTimeSwapToList(filtered)
                    res.jsonp(result) }).catch(erro => { res.status(500).jsonp(erro) })
                }).catch(erro => { res.status(500).jsonp(erro) })
})


router.get('/download/:idPost/:fnome', function(req, res){
    res.download(filePath.getFile(req.params.idPost, req.params.fnome))
})


router.get('/download/:idPost', function(req, res){
    let list = new Array
    Posts.getById(req.params.idPost)
        .then(post => {
            console.log(post)
            for(let i = 0; i < post.files.length; i++){
                console.log({path: filePath.getFile(req.params.idPost, post.files[i].name), name:  post.files[i].name})
                list.push({path: filePath.getFile(req.params.idPost, post.files[i].name), name:  post.files[i].name})
            }
            res.zip(list);
        })
        .catch(erro => { console.log(erro); res.status(500).jsonp(erro) })	
})

router.post('/comment/:idPost', function(req,res){
    req.body.date = new Date().toISOString()
    let comment = req.body
    comment.upVotes = []
    comment.downVotes = []
    let regex = /@[^\ ]+/g;
    //let mentions = dados.comments.map(match(regex).map(subs   tr(1)));
    //mentions.map(Users.insertMention)
    let mentions = (comment.text.match(regex))
    if(mentions) 
        mentions.forEach(m => Users.insertMention(m.substr(1), req.params.idPost))
    Posts.addComment(req.params.idPost, comment)
        .then(dados => { res.jsonp(dados) })
        .catch(erro => { res.status(500).jsonp(erro) })
})

router.post('/comment/upvote/:idComment/:email', function(req,res){
    Posts.upvoteComment(req.params.idComment, req.params.email)
        .then(dados => { res.jsonp({added: true}) })
        .catch(erro => { res.status(500).jsonp({added: false}) })
})

router.post('/comment/downvote/:idComment/:email', function(req,res){
    Posts.downvoteComment(req.params.idComment, req.params.email)
        .then(dados => { res.jsonp({added: true}) })
        .catch(erro => {  res.status(500).jsonp({added: false}) })
})

router.post('/post/downvote/:idPost/:email', function(req,res){
    Posts.downVotePost(req.params.idPost, req.params.email)
        .then(dados => { res.jsonp({added: true}) })
        .catch(erro => { ; res.status(500).jsonp({added: false}) })
})

router.post('/post/upvote/:idPost/:email', function(req,res){
    Posts.upVotePost(req.params.idPost, req.params.email)
        .then(dados => { res.jsonp({added: true}) })
        .catch(erro => { ; res.status(500).jsonp({added: false}) })
})

router.get('/post/fuzzy/title/:title/:name', function(req,res){
    Posts.fuzzySearchByTitle(req.params.title)
        .then(dados => {
            Users.getByName(req.params.name)
                .then(user => {
                    let filtered = dados.filter(function(value, index, arr){
                        if(tagComparer.checkTags(value.tags, user.subscriptions))
                            return true
                      })
                    res.jsonp(filtered)
                }).catch(erro => res.status(500).jsonp(erro))
        }).catch(erro => res.status(500).jsonp(erro))
})

module.exports = router;
