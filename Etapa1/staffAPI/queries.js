var promise = require('bluebird');
var request = require('request');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const qrec = pgp.errors.queryResultErrorCode;

var db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

function getAll(res, next, tableName) {
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

// add query functions

// Employees
function getAllEmployees(req, res, next) {
  return getAll(res, next, 'employees');
}

function getSingleEmployee(req, res, next) {
  var id = parseInt(req.params.id);
  return getSingle(res, next, 'employees', id);
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
  return getAll(res, next, 'employeeTypes');
}
  
function getSingleEmployeeType(req, res, next) {
  var id = parseInt(req.params.id);
  return getSingle(res, next, 'employeeTypes', id);
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

// -------------- TODO --------------


/*
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});
*/

function isEmployeeEmail(email, next, callback) {
  db.any('select * from employees where email = $1', email)
  .then(function(data) {
    callback(data.length > 0)
  })
  .catch(function (err) {
    return next(err)
  })
}

function isEmployeeID(id, next, callback) {
  db.any('select * from employees where id = $1', id)
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
      response.message = ' is an employee email'
    } else {
      code = 404
      response.status = 'resource not found'
      response.data.isEmployee = false
      response.message = ' is not an employee email'
    }
  
    res.status(code).json(response)
  })
}

function isEmployeeID(req, res, next) {
  let id = req.params.id
  let response = {'data': {'id': id}}
  let code = 500

  isEmployeeEmail(email, next, (isEmployee) => {
    if (isEmployee) {
      code = 200
      response.status = 'success'
      response.data.isEmployee = true
      response.message = ' is an employee email'
    } else {
      code = 404
      response.status = 'resource not found'
      response.data.isEmployee = false
      response.message = ' is not an employee email'
    }
  
    res.status(code).json(response)
  })
}

function calculatePrice(email, productID, next, callback) {
  isEmployee(email, next, (isEmployee) => {

    request.get(stockAPI + productID)
    .on('response', (response) => {
      let parsed = JSON.parse(response)
      let product = parsed.data

      if (isEmployee) return callback(product, product.price)

      request.get(stockAPI + 'priceFor/' + productID)
      .on('response', (response) => {
        let parsed = JSON.parse(response)
        let price = parsed.data

        callback(product, price)
      })
    })
  })
}

function priceFor(req, res, next) {
  let email = req.params.email
  let productID = req.params.product

  calculatePrice(email, productID, next, (product, price) => {
    res.status(200).json({
      'status': 'success',
      'data': {
        'product': product.name,
        'price': price
      },
      'message': 'final price for ' + product.name + ' is ' + price
    })
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
  isEmployeeID: isEmployeeID,
  priceFor: priceFor
};
