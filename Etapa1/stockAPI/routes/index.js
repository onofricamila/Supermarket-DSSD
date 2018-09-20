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
router.post('/api/products', db.createProduct);
router.put('/api/products/:id', db.updateProduct);
router.delete('/api/products/:id', db.removeProduct);

/* productTypes endpoints */
router.get('/api/productTypes', db.getAllProductTypes);
router.get('/api/productTypes/:id', db.getSingleProductType);
router.post('/api/productTypes', db.createProductType);
router.put('/api/productTypes/:id', db.updateProductType);
router.delete('/api/productTypes/:id', db.removeProductType);

module.exports = router;
