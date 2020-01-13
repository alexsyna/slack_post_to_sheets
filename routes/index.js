var express = require('express');
var router = express.Router();
var moment = require('moment');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('index', { title: 'Express' });





});



module.exports = router;
