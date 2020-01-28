var express = require('express');
var router = express.Router();
var apiReq = require('../utils/api')


router.get('/:id', function(req, res){
    apiReq.get('/api/post/' + req.params.id)
        .then(dados => {res.render('post', {post: dados.data, user: req.user})})
        .catch(erro => res.render('error',  {error: erro}))
})

/**
 * A responder a um pedido feito pelo axios por parte do cliente
 */
router.post('/downvote/:idPost/:email', function(req, res){
    apiReq.post('/api/post/downvote/' + req.params.idPost + '/' + req.params.email)
        .then(dados => {res.jsonp(dados.data)})
        .catch(erro => res.status(500).jsonp(erro))
})

/**
 * A responder a um pedido feito pelo axios por parte do cliente
 */
router.post('/upvote/:idPost/:email', function(req, res){
    apiReq.post('/api/post/upvote/' + req.params.idPost + '/' + req.params.email)
        .then(dados => {res.jsonp(dados.data)})
        .catch(erro => res.status(500).jsonp(erro))
})
module.exports = router;
