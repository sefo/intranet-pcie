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

router.post('/utilisateur/enregistrer', guard.check('admin'), function (req, res) {
  var utilisateur = req.body;
  bcrypt.hash(req.body.password, bcrypt.genSaltSync(8), null, function(err, hash) {
    // on fait en sorte d'avoir 1 objet à passer pour utiliser les named parameters plutôt que $1 et array
    utilisateur.hash = hash;
    utilisateur.role = req.body.role.id;
    // valider et securiser les infos reçues
    db.none("insert into utilisateur(nom, prenom, email, hash, role) values(${nom}, ${prenom}, ${email}, ${hash}, ${role})", utilisateur)
        .then(function (data) {
            res.send('ok');
        })
        .catch(function (error) {
	        res.send(error);
        });
  });
});

module.exports = router;