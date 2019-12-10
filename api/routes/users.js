var express = require('express');
var router = express.Router();
var Users = require('../controllers/users');

router.get('/', function(req, res) {
  Users.getAll()
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.get('/:email', function(req, res) {
  Users.get(req.params.email)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/', function(req, res) {
  Users.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

module.exports = router;
