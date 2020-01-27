var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
const apiHost = require('../config/env').apiHost;

var urltoken = require('../utils/token').getUrlWithToken;

var multer = require('multer')
var upload = multer({dest: 'uploads/'})

router.get('/:id', function(req, res){
    axios.get(apiHost + '/api/post/' + req.params.id)
        .then(dados => {res.render('post', {post: dados.data, user: req.user})})
        .catch(erro => res.render('error',  {error: erro}))
})

/**
 * A responder a um pedido feito pelo axios por parte do cliente
 */
router.post('/downvote/:idPost/:email', function(req, res){
    axios.post(apiHost + '/api/post/downvote/' + req.params.idPost + '/' + req.params.email)
        .then(dados => {res.jsonp(dados.data)})
        .catch(erro => res.status(500).jsonp(erro))
})

/**
 * A responder a um pedido feito pelo axios por parte do cliente
 */
router.post('/upvote/:idPost/:email', function(req, res){
    axios.post(apiHost + '/api/post/upvote/' + req.params.idPost + '/' + req.params.email)
        .then(dados => {res.jsonp(dados.data)})
        .catch(erro => res.status(500).jsonp(erro))
})


router.post('/fuzzy/title/:postTitle', function(req, res){
    let search = req.body.search;
    let match = search.match(/(.+):(.+)/)
    if(match){
        
    }else{
        axios.post(apiHost + '/fuzzy/title' + search)
    }
})

module.exports = router;
