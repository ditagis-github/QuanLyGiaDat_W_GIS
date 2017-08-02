var express = require('express');
var router = express.Router();
var TraCuuDB = require('../modules/tracuudb');
var tracuudb = new TraCuuDB();

/* GET home page. */
router.get('/', function (req, res, next) {
  var district = tracuudb.getAllDistrict();
  var position = tracuudb.getAllPosition();
  Promise.all([district, position]).then(results => {
    let districts = [];
    for (let r of results[0]) {
      districts.push({
        tenhuyen: r.name,
        mahuyen: r.ma_huyen
      });
    }
    var positions = results[1];
    res.render('tracuu', {
      title: 'Hệ thống Tra cứu Giá đất tỉnh Bình Dương', districts: districts, positions: positions
    });
  })
});
router.post('/get_phuongxa', function (req, res) {
  tracuudb.getWardByDistrictId(req.body.mahuyen).then(rows => {
    res.status(200).send(rows);
  })

});
router.post('/cbo_chonxa', function (req, res) {
  tracuudb.getAllStreetNameByLocal(req.body.xa, req.body.duong).then(rows => {
    res.status(200).send(rows);
  })
})
router.post('/viewdetail', function (req, res) {
  tracuudb.getDetails(req.body.id, req.body.vitri,req.body.sonam).then(rows => {
    res.status(200).send(rows);
  })
})
module.exports = router;