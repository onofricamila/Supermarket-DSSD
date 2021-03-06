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

Pretending to sort: http://localhost:3000/api/products?sort=[{%22field%22:%22name%22,%22mode%22:%22DESC%22}]
    or sorting by multiple fields: http://localhost:3000/api/products?sort=[{%22field%22:%22saleprice%22,%22mode%22:%22DESC%22},{%22field%22:%22name%22,%22mode%22:%22ASC%22}]

Pretending to filter: http://localhost:3000/api/products?filter=[{%22field%22:%22saleprice%22,%22operator%22:%22=%22,%22value%22:15}]
    or filtering by multiple fields: http://localhost:3000/api/products?filter=[{%22field%22:%22saleprice%22,%22operator%22:%22=%22,%22value%22:10},{%22field%22:%22costprice%22,%22operator%22:%22%3C%22,%22value%22:5}]

Mixing sorting and filtering: http://localhost:3000/api/products?sort=[{%22field%22:%22name%22,%22mode%22:%22DESC%22}]&filter=[{%22field%22:%22saleprice%22,%22operator%22:%22=%22,%22value%22:15}]

Pretending to pagiante sending only limit: http://localhost:3000/api/products?pagination={%22limit%22:3}
    or sending also offset: http://localhost:3000/api/products?pagination={%22offset%22:3,%22limit%22:3}

Visit the following link when trying to encode url --> http://www.december.com/html/spec/esccodes.html
*/

function getAllProducts(req, res, next) {
  var sql = 'SELECT * FROM products';
  var sort = req.query.sort;
  var filter = req.query.filter;
  var pagination = req.query.pagination;
  var paginationData;

  sql += filter ? filteringQuery(filter) : '';
  sql += sort ? sortingQuery(sort) : '';
  if (pagination) {
    pagination = JSON.parse(pagination);
    var paginationResult = paginationQuery(pagination);
    paginationData = paginationResult.paginationData;
    sql += paginationResult.query;
  }

  console.log(sql);

  // query the db
  db.any(sql)
    .then(function (data) {
      let code = 500;
      let response;

      if (data.length) {
        code = 200;
        if (pagination) {
          var hasNext = (Object.keys(data).length == pagination.limit);
          paginationData.next = hasNext ? paginationData.next : null;
        };
        response = {
          status: 'success',
          data: data,
          messsage: 'Retrieved MANY products',
          paginationData: paginationData || null
        };
      }
      else {
        code = 404;
        response = {
          status: 'resource not found',
          data: data,
          messsage: 'No products retrieved ',
          paginationData: paginationData || null
        };
      }

      res.status(code).json(response)
    })
    .catch(function (err) {
      return next(err);
    });
}

function writeData(sql, value, callback) {
  db.result(sql, value)
    .then(
      (data) => {
        callback(data);
      }
    )
    .catch(
      (err) => {
        callback(err);
      }
    )
}

function createResponse(data, res, actionName) {
  let responseCode = 500;
  let response = {};
  if (data.name == 'error' || data.rowCount == 0) {
    responseCode = 400;
    response = {
      status: 'error',
      message: 'Bad Request'
    }
  } else {
    responseCode = 200;
    response = {
      status: 'success',
      message: `${actionName} one Product`
    }
  }
  res.status(responseCode).json(response);
}

function updateProduct(req, res, next) {
  let stock = parseInt(req.body.stock)

  // Check stock
  if (isNaN(stock) || stock < 0) return res.status(500).json({ 'status':'error', 'message':'Not enough stock' });

  const sql = 'UPDATE products SET name=$1, costPrice=$2, salePrice=$3, productType=$4, stock=$5 where id=$6';
  const value = 
    [req.body.name, parseInt(req.body.costPrice), parseInt(req.body.salePrice), parseInt(req.body.productType), parseInt(req.body.stock), parseInt(req.params.id)];
  writeData(sql, value, (data) => {
    createResponse(data, res, 'updated');
  })
}


// let's filter
function filteringQuery(filter) {
  var query = ` WHERE`;
  filter = JSON.parse(filter);
  filter.forEach(f => {
    query += ` ${f.field} ${f.operator} '${f.value}' AND`;
  });
  query = query.substring(0, query.length - 3);
  return query;
}




// let's sort
function sortingQuery(sort) {
  var query = ` ORDER BY`;
  sort = JSON.parse(sort);
  sort.forEach(s => {
    query += ` ${s.field}  ${s.mode},`;
  });
  query = query.substring(0, query.length - 1);
  return query;
}




// let's do some pagination
function paginationQuery(pagination) {
  pagination.offset = pagination.offset || 0;
  var query = ` LIMIT ${pagination.limit} OFFSET ${pagination.offset}`;
  var paginationData = {
    next: `pagination={%22offset%22:${pagination.offset + pagination.limit},%22limit%22:${pagination.limit}}`,
    self: `pagination={%22offset%22:${pagination.offset},%22limit%22:${pagination.limit}}`,
    prev: pagination.offset != 0 ? `pagination={%22offset%22:${pagination.offset - pagination.limit},%22limit%22:${pagination.limit}}` : null,
  };
  var result = { query: query, paginationData: paginationData };
  return result
}




// try: http://localhost:3000/api/products/1 
function getSingleProduct(req, res, next) {
  var id = parseInt(req.params.id);
  db.any(`select * from products where id = $1`, id)
    .then(function (data) {
      let code = 500;
      let response;

      if (data.length) {
        code = 200;
        response = {
          status: 'success',
          data: data[0],
          message: `Retrieved ONE product`
        }
      }
      else {
        code = 404;
        response = {
          status: 'resource not found',
          data: data,
          message: `No product retrieved`
        }
      }
      res.status(code).json(response);
    })
    .catch(function (err) {
      return next(err);
    });

}




// try: http://localhost:3000/api/products/1/marginInfo --> if the product does not exist, 0 is returned
function getSingleProductMarginInfo(req, res, next) {
  var id = parseInt(req.params.id);
  var finalData = {}
  var salePriceTenPercentSql = `select (salePrice * 0.1) as TenPercentValue from products where id = $1`;
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
              message: `Retrieving product margin and [1 | 0] representing the fact of product margin surpassing product sale price 10 percent or not (boolean)`
            });
        })
    })
    .catch(function (err) {
      return next(err);
    });
}




// try: http://localhost:3000/api/products/1/isElectroValue --> if the product does not exist, 0 is returned
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
          message: `Rtrieved [1 | 0] representing the fact of a product being electric or not (boolean)`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingle(next, tableName, id, callback) {
  db.one(`select * from ${tableName} where id = $1`, id)
  .then((data) => {
    callback(data)
  })
  .catch((err) => {
    callback(false);
  });
}

function getSingleProductType(req, res, next) {
  var id = parseInt(req.params.id);

  getSingle(next, 'productTypes', id, (data) => {
    let response = {}
    let code = 500

    if (data) {
      code = 200
      response.status = 'success'
      response.data = data
      response.message = 'Retrieved ONE element from productTypes'
    } else {
      code = 404
      response.status = 'resource not found'
      response.data = data
      response.message = 'ProductType not found'
    }

    res.status(code).json(response);
  });
}

function getAll(next, tableName, callback) {
  db.any(`select * from ${tableName}`)
  .then((data) => {
    callback(data)
  })
  .catch((err) => {
    return next(err)
  })
}

function getAllProductTypes(req, res, next) {
  getAll(next, 'productTypes', (data) => {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Retrieved ALL productTypes'
    });
  })
}

function reduceStock(req, res, next) {
  let id = parseInt(req.params.id)
  let quantity = parseInt(req.params.quantity)

  if (!id || !quantity) return res.status(500).json({ status:'error', message:'Bad request' })

  getSingle(next, 'products', id, (prod) => {
    if (!prod) return res.status(404).json({ status: 'error', message:'Product not found' })
    
    let stock = prod.stock - quantity
    if (stock < 0) return res.status(500).json({ status:'error', message:'Not enough stock' })
    
    const sql = 'UPDATE products SET stock=$1 where id=$2';
    const value = [stock, id];
    writeData(sql, value, (data) => {
      createResponse(data, res, 'updated');
    })
  });
}

module.exports = {
  getAllProducts: getAllProducts,
  getSingleProduct: getSingleProduct,
  getSingleProductMarginInfo: getSingleProductMarginInfo,
  getSingleProductIsElectroValue: getSingleProductIsElectroValue,
  updateProduct: updateProduct,
  reduceStock: reduceStock,

  getAllProductTypes: getAllProductTypes,
  getSingleProductType: getSingleProductType,
};


