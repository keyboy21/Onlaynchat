var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Live ball chat' });
});


router.get('/getInv', function(req, res, next) {
  const envData = require('../cfg/config.json')[process.env.NODE_ENV || 'development']
  res.json(envData)
});

module.exports = router;
