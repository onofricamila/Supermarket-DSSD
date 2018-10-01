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



/* 
Simpler url: http://localhost:3000/api/products

Pretending to sort: http://localhost:3000/api/products?sort={%22first%22:{%22field%22:%22name%22,%22mode%22:%22ASC%22}}
    or sorting by multiple fields: http://localhost:3000/api/products?sort={%22first%22:{%22field%22:%22saleprice%22,%22mode%22:%22ASC%22},%22second%22:{%22field%22:%22name%22,%22mode%22:%22ASC%22}} 

Pretending to filter: http://localhost:3000/api/products?filter={%22first%22:{%22field%22:%22saleprice%22,%22operator%22:%22=%22,%22value%22:15}}
    or filtering by multiple fields: http://localhost:3000/api/products?filter={%22first%22:{%22field%22:%22costprice%22,%22operator%22:%22%3C%22,%22value%22:5},%22second%22:{%22field%22:%22name%22,%22operator%22:%22LIKE%22,%22value%22:%22o%25%22}}

Mixing sorting and filtering: http://localhost:3000/api/products?sort={%22first%22:{%22field%22:%22name%22,%22mode%22:%22DESC%22}}&filter={%22first%22:{%22field%22:%22saleprice%22,%22operator%22:%22=%22,%22value%22:15}}

Pretending to pagiante sending only limit: http://localhost:3000/api/products?pagination={%22limit%22:3}
    or sending also offset: http://localhost:3000/api/products?pagination={%22offset%22:3,%22limit%22:3}

Visit the following link when trying to encode url --> http://www.december.com/html/spec/esccodes.html
*/

function getAllProductsV2(req, res, next) {

  var sql = 'SELECT * FROM products';
  var sort = req.query.sort;
  var filter = req.query.filter;
  var pagination = req.query.pagination;
  
   // let's filter
   if (filter){ 
    sql += ` WHERE`;
    filter = JSON.parse(filter);
    for (var f in filter) {
      sql += ` ${filter[f]["field"]} ${filter[f].operator} '${filter[f].value}' AND`;
    }
    sql = sql.substring(0, sql.length -3);
    console.log(sql);
  }


  // let's sort
  if (sort){ 
    sql += ` ORDER BY`;
    sort = JSON.parse(sort);
    for (var s in sort) {
      sql += ` ${sort[s]["field"]}  ${sort[s].mode},`;
    }
    sql = sql.substring(0, sql.length -1);
    console.log(sql);
  }

  // let's do some pagination
  if (pagination){ 
    pagination = JSON.parse(pagination);
    pagination.offset = pagination.offset || 0;
    sql += ` LIMIT ${pagination.limit} OFFSET ${pagination.offset}`;
    console.log(sql);
    var paginationData = {
          next: `pagination={%22offset%22:${pagination.offset + pagination.limit},%22limit%22:${pagination.limit}}`, // BUG -> we need to find a good way to determine when there are no more pages
          self: `pagination={%22offset%22:${pagination.offset},%22limit%22:${pagination.limit}}`,
          prev: pagination.offset != 0 ? `pagination={%22offset%22:${pagination.offset - pagination.limit},%22limit%22:${pagination.limit}}` : null,
    }
  }

  // query the db
  db.any(sql)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          messsage: 'Retrieved ALL products',
          paginationData: paginationData || null
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
                                AND ($2) > (${salePriceTenPercentSql})`;
  db.one(marginSql, id)
    .then(function (data) {
        finalData.margin = data.margin;
        db.one(marginGt10PercentSql, [id, finalData.margin])
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
  getAllProductsV2: getAllProductsV2,
  getSingleProduct: getSingleProduct,
  getSingleProductMarginInfo: getSingleProductMarginInfo,
  getSingleProductIsElectroValue: getSingleProductIsElectroValue,
};


