var express = require('express');
var router = express.Router();
var db = require('../queries');

// Home
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Staff API' });
});

// Employee endpoints
router.get('/api/employees', db.getAllEmployees);
router.get('/api/employees/:id', db.getSingleEmployee);
router.post('/api/employees', db.createEmployee);
router.put('/api/employees/:id', db.updateEmployee);
router.delete('/api/employees/:id', db.removeEmployee);

// EmployeeTypes endpoints
router.get('/api/employeeTypes', db.getAllEmployeeTypes);
router.get('/api/employeeTypes/:id', db.getSingleEmployeeType);
router.post('/api/employeeTypes', db.createEmployeeType);
router.put('/api/employeeTypes/:id', db.updateEmployeeType);
router.delete('/api/employeeTypes/:id', db.removeEmployeeType);

module.exports = router;
