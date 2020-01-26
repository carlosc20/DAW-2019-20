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

module.exports = router;
