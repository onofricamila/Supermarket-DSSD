var promise = require('bluebird');
var request = require('request');
var http = require('http');

const stockAPI = 'http://localhost:3000/api/'

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const qrec = pgp.errors.queryResultErrorCode;

var db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'staff',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

function getAll(next, tableName, callback) {
  db.any(`select * from ${tableName}`)
  .then((data) => {
    data.forEach(e => {
      delete e.password
    });
    callback(data)
  })
  .catch((err) => {
    return next(err)
  })
}

function getSingle(next, tableName, id, callback) {
  db.one(`select * from ${tableName} where id = $1`, id)
  .then((data) => {
    delete data.password
    callback(data)
  })
  .catch((err) => {
    callback(false);
  });
}

function remove(res, next, tableName, id) {
  db.result(`delete from ${tableName} where id = $1`, id)
    .then(function (result) {
      res.status(200)
      .json({
        status: 'success',
        message: `Removed ${result.rowCount} element from ${tableName}`
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

// add query functions

function deletePasswords(data) {
  data.forEach(e => {
    delete e.password
  });
}

function whereQuery(filter) {
  let filters = JSON.parse(filter)
  let where = ''

  if (filters.length > 0) {
    where = ' WHERE '
    filters.forEach(f => {
      where += `${f.field} = '${f.value}' AND `
    });
    where = where.substring(0, where.length -5);
  }

  return where
}

function orderQuery(sort) {
  let sorts = JSON.parse(sort)
  let order = ''

  if (sorts.length > 0) {
    order += ' ORDER BY '
    sorts.forEach(f => {
      order += `${f.field} ${f.value}, `
    });
    order = order.substring(0, order.length -2);
  }

  return order
}

function paginationQuery(paginate) {
  let pagination = JSON.parse(paginate)
  let offset = pagination.offset
  let limit = pagination.limit

  return (typeof offset === 'number' && typeof limit === 'number') ? ` OFFSET ${offset} LIMIT ${limit}` : ''
}

// Employees
function getAllEmployees(req, res, next) {
  let filter = req.query.filter
  let sort = req.query.sort
  let pagination = req.query.pagination

  let sql = 'SELECT * FROM employees'

  sql += filter ? whereQuery(filter) : ''

  sql += sort ? orderQuery(sort) : ''

  sql += pagination ? paginationQuery(pagination) : ''

  db.any(sql)
  .then(function (data) {
    deletePasswords(data)

    let response = {}
    let code = 500

    if (data.length) {
      code = 200
      response.status = 'success'
      response.data = data
      response.message = 'Retrieved employees'
    } else {
      code = 404
      response.status = 'resource not found'
      response.data = data
      response.configuration = {
        filter: filter,
        sort: sort,
        pagination: pagination
      }
      response.message = 'No employees found with current configuration'
    }

    res.status(code).json(response);
  })
  .catch(function (err) {
    return next(err);
  });
}

function getSingleEmployee(req, res, next) {
  var id = parseInt(req.params.id);
  
  getSingle(next, 'employees', id, (data) => {
    let response = {}
    let code = 500

    if (data) {
      code = 200
      response.status = 'success'
      response.data = data
      response.message = 'Retrieved ONE element from employees'
    } else {
      code = 404
      response.status = 'resource not found'
      response.data = data
      response.message = 'Employee not found'
    }

    res.status(code).json(response);
  });
}

function removeEmployee(req, res, next) {
  var id = parseInt(req.params.id);
  return remove(res, next, 'employees', id);
}

function createEmployee(req, res, next) {
  req.body.employeetype = parseInt(req.body.employeetype);
  db.none('insert into employees(firstname, surname, email, password, employeetype)' +
      'values(${firstname}, ${surname}, ${email}, ${password}, ${employeetype})',
      req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one employee'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateEmployee(req, res, next) {
  db.none('update employees set firstname=$1, surname=$2, email=$3, password=$4, employeetype=$5 where id=$6',
      [req.body.firstname, req.body.surname, req.body.email,
        req.body.password, parseInt(req.params.employeetype), parseInt(req.params.id)
      ])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated employees'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// EmployeeTypes
function getAllEmployeeTypes(req, res, next) {
  getAll(next, 'employeeTypes', (data) => {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Retrieved ALL employeeTypes'
    });
  })
}
  
function getSingleEmployeeType(req, res, next) {
  var id = parseInt(req.params.id);

  getSingle(next, 'employeeTypes', id, (data) => {
    let response = {}
    let code = 500

    if (data) {
      code = 200
      response.status = 'success'
      response.data = data
      response.message = 'Retrieved ONE element from employeeTypes'
    } else {
      code = 404
      response.status = 'resource not found'
      response.data = data
      response.message = 'EmployeeType not found'
    }

    res.status(code).json(response);
  });
}

function removeEmployeeType(req, res, next) {
  var id = parseInt(req.params.id);
  return remove(res, next, 'employeeTypes', id);
}

function createEmployeeType(req, res, next) {
  db.none('insert into employeeTypes(initials, description)' +
      'values(${initials}, ${description})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one EmployeeType'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateEmployeeType(req, res, next) {
  db.none('update employeeTypes set initials=$1, description=$2 where id=$3',
    [req.body.initials, req.body.description, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated EmployeeTypes'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function isEmployeeEmail(email, next, callback) {
  db.any('select * from employees where email = $1', email)
  .then(function(data) {
    callback(data.length > 0)
  })
  .catch(function (err) {
    return next(err)
  })
}

function isEmployee(req, res, next) {
  let email = req.params.email
  let response = {'data': {'email': email}}
  let code = 500

  isEmployeeEmail(email, next, (isEmployee) => {
    if (isEmployee) {
      code = 200
      response.status = 'success'
      response.data.isEmployee = true
      response.message = email + ' is an employee email'
    } else {
      code = 404
      response.status = 'resource not found'
      response.data.isEmployee = false
      response.message = email + ' is not an employee email'
    }
  
    res.status(code).json(response)
  })
}

function calculatePrice(email, productID, next, callback) {
  isEmployeeEmail(email, next, (isEmployee) => {
    request.get(stockAPI + 'products/' + productID, (error, response, body) => {
      let err = false
      if (response.statusCode == 404) {
        err = {
          'status': 'resource not found',
          'data': {
            'product': productID,
            'email': email
          },
          'message': 'product not found'
        }
        callback(err)
      } else {
        let parsed = JSON.parse(body)
        let product = parsed.data
        let price = isEmployee ? product.costprice : saleprice
        callback(err, product, price)
      }
    })
  })
}

function priceFor(req, res, next) {
  let email = req.params.email
  let productID = req.params.product
  calculatePrice(email, productID, next, (error, product, price) => {
    if (error) {
      res.status(404).json(error)
    } else {
      res.status(200).json({
        'status': 'success',
        'data': {
          'price': price,
          'product': product,
          'email': email
        },
        'message': 'final price for product ' + product.name + ' is ' + price + ' for client ' + email
      })
    }
  })
}

module.exports = {
  getAllEmployees: getAllEmployees,
  getSingleEmployee: getSingleEmployee,
  createEmployee: createEmployee,
  updateEmployee: updateEmployee,
  removeEmployee: removeEmployee,

  getAllEmployeeTypes: getAllEmployeeTypes,
  getSingleEmployeeType: getSingleEmployeeType,
  createEmployeeType: createEmployeeType,
  updateEmployeeType: updateEmployeeType,
  removeEmployeeType: removeEmployeeType,

  isEmployee: isEmployee,
  priceFor: priceFor
};
