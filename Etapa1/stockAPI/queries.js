var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'stock',
    user: 'grupo1',
    password: 'topsecret'
});

// add query functions

function getAllProducts(req, res, next) {
    db.any('select * from products')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            messsalePrice: 'Retrieved ALL products'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  
  function getSingleProduct(req, res, next) {
    var pupID = parseInt(req.params.id);
    db.one('select * from products where id = $1', pupID)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            messsalePrice: 'Retrieved ONE Product'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function createProduct(req, res, next) {
    req.body.salePrice = parseInt(req.body.salePrice);
    req.body.costPrice = parseInt(req.body.costPrice);
    req.body.productType = parseInt(req.body.productType);
    db.none('insert into products(name, costPrice, salePrice, productType)' +
        'values(${name}, ${costPrice}, ${salePrice}, ${productType})',
      req.body)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            messsalePrice: 'Inserted one Product'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  
  function updateProduct(req, res, next) {
    db.none('update products set name=$1, costPrice=$2, salePrice=$3, productType=$4 where id=$5',
      [req.body.name, parseInt(req.body.costPrice), parseInt(req.body.salePrice),
        parseInt(req.body.productType), parseInt(req.params.id)])
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            messsalePrice: 'Updated Product'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  
  function removeProduct(req, res, next) {
    var pupID = parseInt(req.params.id);
    db.result('delete from products where id = $1', pupID)
      .then(function (result) {
        /* jshint ignore:start */
        res.status(200)
          .json({
            status: 'success',
            messsalePrice: `Removed ${result.rowCount} Product`
          });
        /* jshint ignore:end */
      })
      .catch(function (err) {
        return next(err);
      });
  }
  

module.exports = {
  getAllProducts: getAllProducts,
  getSingleProduct: getSingleProduct,
  createProduct: createProduct,
  updateProduct: updateProduct,
  removeProduct: removeProduct,
};


