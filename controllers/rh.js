var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bcrypt = require('bcrypt-nodejs');
var models = require('../models');
var guard = require('express-jwt-permissions')();

var secret = 'n8jTwiRYBtJF25Wpk7X1fRvtxDrKs8P5lXP16DqytRwa0Pfa6omupI5YWgGjF3kUeP4F08LeklnwCQGoDMouLZcija8aRZaMEBQdrDSjRp9OGnVrfrZqosHE';

// renvoie le profile du RH
router.get('/profile', function (req, res) {
    models.Utilisateur.findAll(
        { include: [{
            model: models.Role,
            as: 'role_utilisateur',
            where: {
                intitule: 'RH'
            }
        }]
    }).then(function(rh) { // si 'as' ici, il faut aussi le mettre dans l'association
        res.json(rh);
    });
});

router.get('/absences/:y', guard.check('RH'), function (req, res) {
  var parameters = {};
  parameters.y = req.params.y;
  var requete = "select u.id as userid, u.nom, u.prenom, u.email, \
        a.id as eventid, a.titre as title, to_char(a.debut, 'YYYY-MM-DD') as start, to_char(a.fin, 'YYYY-MM-DD') as end, \
        t.type_code as code, t.type, t.id as typeid, \
        v.id as validationid, v.type as validation \
        from absence a \
        inner join utilisateur u on u.id = a.utilisateur \
        inner join absence_validation v on v.id = a.validation \
        inner join absence_type t on t.id = a.type \
        where extract(year from a.debut) = :year";
  models.sequelize.query(requete, { replacements: { year: parameters.y }, type: models.sequelize.QueryTypes.SELECT})
    .then(function(absences) {
      res.json({absences});
    }
  );
});

router.post('/absences/valider/', guard.check('RH'), function (req, res) {
  var parameters = {};
  parameters.userid = req.body.userid;
  parameters.eventid = req.body.eventid;
  var requete = "with update_event as ( \
      update absence set validation = 2 \
      where id = :eventid and utilisateur = :userid \
      returning *) \
      select a.validation, av.type from update_event as a \
      inner join absence_validation as av on av.id = a.validation;";
  models.sequelize.query(requete, { replacements: { eventid: parameters.eventid, userid: parameters.userid }, type: models.sequelize.QueryTypes.SELECT})
    .then(function(data) {
      res.json({data});
    }
  );
});

router.post('/absences/refuser/', guard.check('RH'), function (req, res) {
  var parameters = {};
  parameters.userid = req.body.userid;
  parameters.eventid = req.body.eventid;
  var requete = "with update_event as ( \
      update absence set validation = 1 \
      where id = :eventid and utilisateur = :userid \
      returning *) \
      select a.validation, av.type from update_event as a \
      inner join absence_validation as av on av.id = a.validation;";
  models.sequelize.query(requete, { replacements: { eventid: parameters.eventid, userid: parameters.userid }, type: models.sequelize.QueryTypes.SELECT})
    .then(function(data) {
      res.json({data});
    }
  );
});

module.exports = router;