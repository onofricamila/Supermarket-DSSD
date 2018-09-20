var express = require('express');
var router = express.Router();
var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Staff API' });
});

// Employee endpoints
router.get('/api/employees', db.getAllEmployees);
router.get('/api/employees/:id', db.getSingleEmployee);
router.post('/api/employees', db.createEmployee);
router.put('/api/employees/:id', db.updateEmployee);
router.delete('/api/employees/:id', db.removeEmployee);

module.exports = router;
