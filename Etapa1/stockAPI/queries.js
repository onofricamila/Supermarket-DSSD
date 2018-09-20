var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'supermarket',
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
            messsaleprice: 'Retrieved ALL products'
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
            messsaleprice: 'Retrieved ONE Product'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function createProduct(req, res, next) {
    req.body.saleprice = parseInt(req.body.saleprice);
    req.body.costprice = parseInt(req.body.costprice);
    req.body.producttype = parseInt(req.body.producttype);
    db.none('insert into products(name, costprice, saleprice, producttype)' +
        'values(${name}, ${costprice}, ${saleprice}, ${producttype})',
      req.body)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            messsaleprice: 'Inserted one Product'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  
  function updateProduct(req, res, next) {
    db.none('update products set name=$1, costprice=$2, saleprice=$3, producttype=$4 where id=$5',
      [req.body.name, parseInt(req.body.costprice), parseInt(req.body.saleprice),
        parseInt(req.body.producttype), parseInt(req.params.id)])
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            messsaleprice: 'Updated Product'
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
            messsaleprice: `Removed ${result.rowCount} Product`
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


