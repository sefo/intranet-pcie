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

router.get('/:y', function(req, res) {
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

router.get('/types/lister', function (req, res) {
	db.any("select t.id, t.type, t.type_code from absence_type t").then(function (data) {
    res.json({data});
  }).catch(function (error) {
	  response.send(error);
  });
});

router.post('/enregistrer', function (req, res) {
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

module.exports = router;