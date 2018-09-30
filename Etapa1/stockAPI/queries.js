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

// Query functions ---------------------------------------------------------------------------------------

/* try w this url: http://localhost:3000/api/products?productType=galletitas
or: http://localhost:3000/api/products?sort=asaleprice
or: http://localhost:3000/api/products?sort=dsaleprice&productType=galletitas
or the generic one: http://localhost:3000/api/products */
function getAllProducts(req, res, next) {
  var productTypedValue = req.query.productType ? `(SELECT id FROM productTypes WHERE description = '${req.query.productType}')` : 1;
  var productTypeName = req.query.productType ? 'productType' : 1;
  var sortFieldName = req.query.sort ? req.query.sort.substring(1) : 'id';
  if (req.query.sort != null) {
    var sortMode = req.query.sort.charAt(0) == 'd' ? 'DESC' : 'ASC';
  }
  else{
    var sortMode = 'ASC';
  }
  db.any(`SELECT * FROM products WHERE ${productTypeName}=${productTypedValue} ORDER BY ${sortFieldName} ${sortMode}`)
  .then(function (data) {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: `Retrieved ALL products ${req.query.productType ? 'matching ' + req.query.productType : ''}`
      });
  })
  .catch(function (err) {
    return next(err);
  });
}
 


// try: http://localhost:3000/api/products/1 
function getSingleProduct(req, res, next) {
  var id = parseInt(req.params.id);
  db.one(`select * from products where id = $1`, id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: `Retrieved ONE element from products`
        });
    })
    .catch(function (err) {
      return next(err);
    });

}



// try: http://localhost:3000/api/products/1/margin
function getSingleProductMargin(req, res, next) {
  var id = parseInt(req.params.id);
  db.one(`select *, (salePrice - costprice) as margin from products where id = $1`, id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data.margin,
          message: `${data.name} margin`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



// try: http://localhost:3000/api/products/1/isElectroValue ||| BUG -> no prod w that id returns boolean 0
function getSingleProductIsElectroValue(req, res, next) {
  var id = parseInt(req.params.id);
  var sql = `SELECT CAST(COUNT(1) AS BIT) as iselectro
             FROM products 
             WHERE id = $1 AND productType = (SELECT id FROM productTypes WHERE description = 'electro')`;
  db.one(sql, id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data.iselectro,
          message: `Rtrieved [0 | 1] representing the fact of a product being electric or not (boolean)`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



module.exports = {
  getAllProducts: getAllProducts,
  getSingleProduct: getSingleProduct,
  getSingleProductMargin: getSingleProductMargin,
  getSingleProductIsElectroValue: getSingleProductIsElectroValue,

};


