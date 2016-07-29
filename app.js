
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var guard = require('express-jwt-permissions')();
var bcrypt = require('bcrypt-nodejs');
var pgp = require("pg-promise")();

var secret = 'n8jTwiRYBtJF25Wpk7X1fRvtxDrKs8P5lXP16DqytRwa0Pfa6omupI5YWgGjF3kUeP4F08LeklnwCQGoDMouLZcija8aRZaMEBQdrDSjRp9OGnVrfrZqosHE';

var db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'pcie',
    user: 'postgres',
    password: 'root'
});

var app = express();

app.use('/me', expressJwt({secret: secret}));
app.use('/api', expressJwt({secret: secret}));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(function(err, req, res, next){
  if (err.constructor.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized');
  }
});

app.post('/auth', function (req, res) {
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

app.get('/app', function(req, res) {
	res.sendFile('/app/index.html', {root: __dirname});
});

app.get('/api/roles/lister', function (req, res) {
	db.any("select r.id, r.intitule from role r").then(function (data) {
    res.json({data});
  }).catch(function (error) {
	  response.send(error);
  });
});

app.get('/api/absences/:y', function(req, res) {
  var parameters = {};
  parameters.id = req.user.id;
  parameters.y = req.params.y;
  var requete = "select a.titre as title, to_char(a.debut, 'YYYY-MM-DD') as start, to_char(a.fin, 'YYYY-MM-DD') as end, t.type_code as \"className\" from absence a \
        inner join utilisateur u on u.id = a.utilisateur \
        inner join absence_validation v on v.id = a.validation \
        inner join absence_type t on t.id = a.type \
        where u.id = ${id} and extract(year from a.debut) = ${y}";
	db.any(requete, parameters).then(function (data) {
    res.json({data});
  }).catch(function (error) {
	  response.send(error);
  });
});

app.get('/api/absences/types/lister', function (req, res) {
	db.any("select t.id, t.type, t.type_code from absence_type t").then(function (data) {
    res.json({data});
  }).catch(function (error) {
	  response.send(error);
  });
});

app.post('/api/absences/enregistrer', function (req, res) {
  var parameters = {};
  parameters.userId = req.user.id;
  parameters.title = req.body.title;
  parameters.start = req.body.start;
  parameters.type = req.body.type.id;
  db.none("insert into absence(type, validation, debut, fin, utilisateur, titre) values(${type}, 5, ${start}, ${start}, ${userId}, ${title})", parameters)
    .then(function (data) {
        res.send('ok');
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.post('/api/admin/utilisateur/enregistrer', guard.check('admin'), function (req, res) {
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

app.get('/me', function (req, res) {
  res.json({
    id: req.user.id,
    nom: req.user.nom,
    prenom: req.user.prenom,
    email: req.user.email,
    hash: req.user.hash,
    role: req.user.role
  });
});

module.exports = app;