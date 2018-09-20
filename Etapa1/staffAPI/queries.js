var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'staff',
  user: 'secret',
  password: 'secret'
}); // BUG -> user and psswd shouldnt be visible

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
          message: 'Updated employee'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// EmployeeTypes

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



module.exports = {
  getAllEmployees: getAllEmployees,
  getSingleEmployee: getSingleEmployee,
  createEmployee: createEmployee,
  updateEmployee: updateEmployee,
  removeEmployee: removeEmployee
};