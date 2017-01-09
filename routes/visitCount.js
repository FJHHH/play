var express = require('express');
var router = express.Router();
var path = require('path');
var media = path.join(__dirname, '../public/media');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('visit/index', { title: 'visit'});
});

router.get('/addVisitRecord', function(req, res, next) {
    res.render('visit/index', { title: 'addVisitRecord'});
});

module.exports = router;