var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/lister', function (req, res) {
    models.Role.findAll().then(function(roles) {
        res.json(roles);
    });
});

module.exports = router;