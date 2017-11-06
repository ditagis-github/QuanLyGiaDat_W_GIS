var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hệ thống Giá đất tỉnh Bình Dương' });
});

module.exports = router;
