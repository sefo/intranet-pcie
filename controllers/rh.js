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

router.get('/absences/:y', guard.check('RH'), function (req, res) {
  var parameters = {};
  parameters.y = req.params.y;
  var requete = "select u.id as userid, u.nom, u.prenom, \
        a.id as eventid, a.titre as title, to_char(a.debut, 'YYYY-MM-DD') as start, to_char(a.fin, 'YYYY-MM-DD') as end, \
        t.type_code as code, t.type, t.id as typeid, \
        v.id as validationid, v.type as validation \
        from absence a \
        inner join utilisateur u on u.id = a.utilisateur \
        inner join absence_validation v on v.id = a.validation \
        inner join absence_type t on t.id = a.type \
        where extract(year from a.debut) = ${y}";
	db.any(requete, parameters).then(function (data) {
    res.json({data});
  }).catch(function (error) {
	  res.send(error);
  });
});

router.post('/absences/valider/', guard.check('RH'), function (req, res) {
  var parameters = {};
  parameters.userid = req.body.userid;
  parameters.eventid = req.body.eventid;
  var requete = "with update_event as ( \
      update absence set validation = 2 \
      where id = ${eventid} and utilisateur = ${userid} \
      returning *) \
      select a.validation, av.type from update_event as a \
      inner join absence_validation as av on av.id = a.validation;";
	db.any(requete, parameters).then(function (data) {
    res.json({data});
  }).catch(function (error) {
	  res.send(error);
  });
});

router.post('/absences/refuser/', guard.check('RH'), function (req, res) {
  var parameters = {};
  parameters.userid = req.body.userid;
  parameters.eventid = req.body.eventid;
  var requete = "with update_event as ( \
      update absence set validation = 1 \
      where id = ${eventid} and utilisateur = ${userid} \
      returning *) \
      select a.validation, av.type from update_event as a \
      inner join absence_validation as av on av.id = a.validation;";
	db.any(requete, parameters).then(function (data) {
    res.json({data});
  }).catch(function (error) {
	  res.send(error);
  });
});

module.exports = router;