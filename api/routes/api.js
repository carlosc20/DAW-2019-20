var express = require('express');
var post = require('../controllers/post')
var router = express.Router();

var multer = require('multer')
var upload = multer({dest: 'uploads/'})

/* POST a post */
router.post('/post', upload.array('files'), function(req, res, next) {
    let data = new Date()
    let novoPost = req.body
    novoPost.files = new Array
    novoPost.date = data.toISOString()
    console.dir(novoPost)
    for(var i = 0; i < req.files.length; i++){
        let oldPath = __dirname + '/../' + req.files[i].path
        let newPath = __dirname + '/../public/ficheiros/' + req.files[i].originalname
        fs.rename(oldPath, newPath, function (err){
            if (err) throw err
        })

        let novoFicheiro = {
            name: req.files[i].originalname,
            mimetype: req.files[i].mimetype,
            size: req.files[i].size
        }
        novoPost.files.push(novoFicheiro)
    }
    post.insert(novoPost)
        .then(dados => {console.log("Adding post " + novoPost);res.jsonp(dados)})
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
