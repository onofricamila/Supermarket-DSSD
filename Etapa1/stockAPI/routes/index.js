var express = require('express');
var router = express.Router();
var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Stock API' });
});

/* products endpoints */
router.get('/api/products', db.getAllProducts);
router.get('/api/products/:id', db.getSingleProduct);
router.get('/api/products/:id/margin', db.getSingleProductMargin);
router.get('/api/products/:id/marginGtTenPercentValue', db.getSingleProductMarginGtTenPercentValue);
router.get('/api/products/:id/isElectroValue', db.getSingleProductIsElectroValue);


module.exports = router;
