var express = require('express');
var router = express.Router();
var moment = require('moment');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.hbs', { title: 'GU GROUP slack API' });
});



router.post('/posttosheets', function(req, res, next) {

  var challenge = req.body.challenge;


  res.send(challenge);
});

module.exports = router;
