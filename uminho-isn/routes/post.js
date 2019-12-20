var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
const apiHost = require('../config/env').apiHost;

var multer = require('multer')
var upload = multer({dest: 'uploads/'})

router.get('/:id', function(req, res){
    axios.get(apiHost + '/api/post/' + req.params.id)
        .then(dados => {console.log(dados.data);res.render('post', {post: dados.data})})
        .catch(erro => res.render('error',  {error: erro}))
})

module.exports = router;
