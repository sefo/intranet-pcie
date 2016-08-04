var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bcrypt = require('bcrypt-nodejs');
var pgp = require("pg-promise")();
var guard = require('express-jwt-permissions')();

var secret = 'n8jTwiRYBtJF25Wpk7X1fRvtxDrKs8P5lXP16DqytRwa0Pfa6omupI5YWgGjF3kUeP4F08LeklnwCQGoDMouLZcija8aRZaMEBQdrDSjRp9OGnVrfrZqosHE';

var db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'pcie',
    user: 'postgres',
    password: 'root'
});

router.post('/', function (req, res) {
  var response = res;
  var request = req;
  var profile = {};
  var token = {};
	db.one("select u.id, u.nom, u.prenom, u.hash, u.email, r.intitule as role from utilisateur u inner join role r on r.id = u.role where u.email=$1", request.body.email).then(function (data) {
    var user = data;
    var permissions = [];
    bcrypt.compare(request.body.password, user.hash, function(err, ret) {
      if(ret) {
        profile = user;
        permissions.push(profile.role);
        profile.permissions = permissions;
        token = jwt.sign(profile, secret, { expiresIn: 120*60 });
        user.token = token;
        response.json({user: user});
      } else {
        response.status(401).send('Wrong user or password');
      }
    });
  }).catch(function (error) {
	  response.send(error);
  });
});

module.exports = router;