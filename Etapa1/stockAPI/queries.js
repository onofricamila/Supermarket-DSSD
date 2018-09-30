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


// try w this url: http://localhost:3000/api/products
function getAllProductsV0(req, res, next) {
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



/* 
Simpler url: http://localhost:3000/api/products

Testing JSON: http://localhost:3000/api/products?json={%22name%22:%22John%22,%22age%22:32}

Pretending to sort: http://localhost:3000/api/products?sort={%22first%22:{%22field%22:%22name%22,%22mode%22:%22ASC%22}}
    or sorting by multiple fields: http://localhost:3000/api/products?sort={%22first%22:{%22field%22:%22saleprice%22,%22mode%22:%22ASC%22},%22second%22:{%22field%22:%22name%22,%22mode%22:%22ASC%22}} 

Pretending to filter: http://localhost:3000/api/products?filter={%22first%22:{%22field%22:%22saleprice%22,%22operator%22:%22=%22,%22value%22:15}}
    or filtering by multiple fields: http://localhost:3000/api/products?filter={%22first%22:{%22field%22:%22costprice%22,%22operator%22:%22%3C%22,%22value%22:5},%22second%22:{%22field%22:%22name%22,%22operator%22:%22LIKE%22,%22value%22:%22o%25%22}}



Visit the following link when trying to encode url --> http://www.december.com/html/spec/esccodes.html
*/
function getAllProductsV2(req, res, next) {
  // testing json
  if(req.query.json){
    console.log(req.query.json);
    var param = JSON.parse(req.query.json);
    console.log(param);
    for (var key in param) {
      console.log(key, param[key]);
    }
  }


  var sql = 'SELECT * FROM products';
  var sort = req.query.sort;
  var filter = req.query.filter;
  var pagination = req.query.pagination;
  
   // let's filter
   if (filter){ 
    console.log('hay param filter');
    sql += ` WHERE`;
    filter = JSON.parse(filter);
    for (var f in filter) {
      console.log(f, filter[f]);
      sql += ` ${filter[f]["field"]} ${filter[f].operator} '${filter[f].value}' AND`;
    }
    sql = sql.substring(0, sql.length -3);
    console.log(sql);
  }


  // let's sort
  if (sort){ 
    console.log('hay param sort');
    sql += ` ORDER BY`;
    sort = JSON.parse(sort);
    for (var s in sort) {
      console.log(s, sort[s]);
      sql += ` ${sort[s]["field"]}  ${sort[s].mode},`;
    }
    sql = sql.substring(0, sql.length -1);
    console.log(sql);
  }

  // query the db
  db.any(sql)
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



/* try w this url: http://localhost:3000/api/products?productType=galletitas
or: http://localhost:3000/api/products?sort=asaleprice
or: http://localhost:3000/api/products?sort=dsaleprice&productType=galletitas
or the generic one: http://localhost:3000/api/products */
function getAllProductsV1(req, res, next) {
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




// try: http://localhost:3000/api/products/1/marginInfo
function getSingleProductMarginInfo(req, res, next) {
  var id = parseInt(req.params.id);
  var finalData = {}
  var salePriceTenPercentSql= `select (salePrice * 0.1) as TenPercentValue from products where id = $1`;
  var marginSql = `select (salePrice - costprice) as margin from products where id = $1`;
  var marginGt10PercentSql = `SELECT CAST(COUNT(1) AS BIT) as boolean
                              FROM products
                              WHERE id = $1 
                                AND (${marginSql}) > (${salePriceTenPercentSql})`;
  db.one(marginSql, id)
    .then(function (data) {
        finalData.margin = data.margin;
        db.one(marginGt10PercentSql, id)
          .then(function (data) {
            finalData.marginGt10PercentValue = data.boolean;
            res.status(200)
              .json({
                status: 'success',
                data: finalData,
                message: `Retrieving product margin and [0 | 1] representing the fact of product margin surpassing product sale price 10 percent or not (boolean)`
              });
        })
    })
    .catch(function (err) {
      return next(err);
    });
}




// try: http://localhost:3000/api/products/1/isElectroValue 
function getSingleProductIsElectroValue(req, res, next) {
  var id = parseInt(req.params.id);
  var sql = `SELECT CAST(COUNT(1) AS BIT) as boolean
             FROM products 
             WHERE id = $1 AND productType = (SELECT id FROM productTypes WHERE description = 'electro')`;
  db.one(sql, id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data.boolean,
          message: `Rtrieved [0 | 1] representing the fact of a product being electric or not (boolean)`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}



module.exports = {
  getAllProductsV0: getAllProductsV0,
  getAllProductsV1: getAllProductsV1,
  getAllProductsV2: getAllProductsV2,
  getSingleProduct: getSingleProduct,
  getSingleProductMarginInfo: getSingleProductMarginInfo,
  getSingleProductIsElectroValue: getSingleProductIsElectroValue,
};


