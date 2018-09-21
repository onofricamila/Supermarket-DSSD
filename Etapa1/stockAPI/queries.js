var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,       
    password: process.env.DB_PASS      
}); 

// configurable query functions ---------------------------------------------------------------------

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

// products query functions ---------------------------------------------------------------------

function getAllProducts(req, res, next) {
  return getAll(res, next, 'products');
}
  
function getSingleProduct(req, res, next) {
  var id = parseInt(req.params.id);
  return getSingle(res, next, 'products', id);
}

// via terminal: curl -X DELETE http://127.0.0.1:3000/api/product/6
function removeProduct(req, res, next) {
  var id = parseInt(req.params.id);
  return remove(res, next, 'products', id);
}

// via terminal: curl --data "name=tst&costPrice=5&salePrice=10&productType=7" http://127.0.0.1:3000/api/products
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

// via terminal: curl -X PUT --data "name=tstV2&costPrice=5&salePrice=10&productType=7" http://127.0.0.1:3000/api/products/7
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
  
// productTypes query functions ---------------------------------------------------------------------

function getAllProductTypes(req, res, next) {
  return getAll(res, next, 'productTypes');
}
  
function getSingleProductType(req, res, next) {
  var id = parseInt(req.params.id);
  return getSingle(res, next, 'productTypes', id);
}

// via terminal: curl -X DELETE http://127.0.0.1:3000/api/productTypes/6
function removeProductType(req, res, next) {
  var id = parseInt(req.params.id);
  return remove(res, next, 'productTypes', id);
}

// via terminal: curl --data "initials=tst&description=test" http://127.0.0.1:3000/api/productType
function createProductType(req, res, next) {
  db.none('insert into productTypes(initials, description)' +
      'values(${initials}, ${description})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one ProductType'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// via terminal: curl -X PUT --data "initials=tstV2&description=test version 2" http://127.0.0.1:3000/api/productTypes/7
function updateProductType(req, res, next) {
  db.none('update productTypes set initials=$1, description=$2 where id=$3',
    [req.body.initials, req.body.description, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated ProductType'
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

  getAllProductTypes: getAllProductTypes,
  getSingleProductType: getSingleProductType,
  createProductType: createProductType,
  updateProductType: updateProductType,
  removeProductType: removeProductType,
};


