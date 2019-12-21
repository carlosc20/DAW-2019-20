var express = require('express');
var post = require('../controllers/post')
var router = express.Router();
const fs = require('fs')

var multer = require('multer')
var upload = multer({dest: 'uploads/'})

/* POST a post */
router.post('/post', upload.array('files'), function(req, res, next) {
    console.log('A introduzir um post')
    let data = new Date()
    let newPost = req.body
    newPost.files = new Array
    newPost.date = data.toISOString()

    console.log("Ola 1")
    for(var i = 0; i < req.files.length; i++){
        let oldPath = __dirname + '/../' + req.files[i].path
        let newPath = __dirname + '/../public/ficheiros/' + req.files[i].originalname
        console.log("oldPath:" + oldPath + "\nnewPath: " + newPath)
        fs.rename(oldPath, newPath, function (err){
            if (err) {
                throw err
            }
        })
        console.log("Ola 2")
        let novoFicheiro = {
            name: req.files[i].originalname,
            mimetype: req.files[i].mimetype,
            size: req.files[i].size
        }
        newPost.files.push(novoFicheiro)
    }
    console.log("Ola 3")
    //por alguma razao há erro 500 aqui, mas os dados sao inseridos na base de dados
    post.insert(newPost)
        .then(dados => {console.log("Adding post " + newPost);res.jsonp(dados)})
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
