var express = require('express');
var router = express.Router();
var Tags = require('../controllers/identifiers');

router.get('/', function(req, res) {
  Tags.getAll()
    .then(data => res.jsonp(data))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/', function(req, res) {
    Tags.insert(req.body)
        .then(data => res.jsonp(data))
        .catch(e => res.status(500).jsonp(e))
});

module.exports = router;