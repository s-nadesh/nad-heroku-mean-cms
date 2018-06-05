var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('*', function(request, response) {
    console.log(path.resolve('public/index.html'));
    response.sendFile(path.resolve('public/index.html'));
});

module.exports = router;
