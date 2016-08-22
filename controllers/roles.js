var express = require('express');
var router = express.Router();
var pgp = require("pg-promise")();

var db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'pcie',
    user: 'postgres',
    password: 'root'
});

router.get('/lister', function (req, res) {
	db.any("select r.id, r.intitule from role r").then(function (data) {
    res.json({data});
  }).catch(function (error) {
	  res.send(error);
  });
});

module.exports = router;