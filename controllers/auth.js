var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bcrypt = require('bcrypt-nodejs');
var models = require('../models');
var guard = require('express-jwt-permissions')();

var secret = 'n8jTwiRYBtJF25Wpk7X1fRvtxDrKs8P5lXP16DqytRwa0Pfa6omupI5YWgGjF3kUeP4F08LeklnwCQGoDMouLZcija8aRZaMEBQdrDSjRp9OGnVrfrZqosHE';

router.post('/', function (req, res) {
  var response = res;
  var request = req;
  var profile = {};
  var token = {};
  models.Utilisateur.findOne(
      {
        where: {
          email: request.body.email //attention?
        },
        include: [{
          model: models.Role,
          as: 'role_utilisateur'
      }]
  }).then(function(user_instance) {
    var user = user_instance.get({ plain: true });
    var permissions = [];
    bcrypt.compare(request.body.password, user.hash, function(err, ret) {
      if(ret) {
        profile = user;
        permissions.push(profile.role_utilisateur.intitule); //role_utilisateur = table de liaison renommée par sequelize
        profile.permissions = permissions;
        profile.role = profile.role_utilisateur.intitule;
        token = jwt.sign(profile, secret, { expiresIn: 120*60 });
        user.token = token;
        response.json({user: user});
      } else {
        response.status(401).send('Wrong user or password');
      }
    });
  });
});

module.exports = router;