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
}); // BUG -> user and psswd shouldnt be visible

// configurable query functions

function getAll(res, next,tableName){
  db.any(`select * from ${tableName}`)
  .then(function (data) {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: `Retrieved ALL ${tableName}`
      });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getSingle(res, next, tableName, id) {
  db.one(`select * from ${tableName} where id = $1`, id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: `Retrieved ONE element from ${tableName}`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function remove(res, next, tableName, id) {
  db.result(`delete from ${tableName} where id = $1`, id)
   .then(function (result) {
     /* jshint ignore:start */
     res.status(200)
       .json({
         status: 'success',
         message: `Removed ${result.rowCount} element from ${tableName}`
       });
     /* jshint ignore:end */
   })
   .catch(function (err) {
     return next(err);
   });
}

// products query functions

function getAllProducts(req, res, next) {
  return getAll(res, next, 'products');
}
  
function getSingleProduct(req, res, next) {
  var id = parseInt(req.params.id);
  return getSingle(res, next, 'products', id);
}
  
function removeProduct(req, res, next) {
  var id = parseInt(req.params.id);
  return remove(res, next, 'products', id);
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
          message: 'Inserted one Product'
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
          message: 'Updated Product'
        });
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


