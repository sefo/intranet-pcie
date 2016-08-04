var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json({
    id: req.user.id,
    nom: req.user.nom,
    prenom: req.user.prenom,
    email: req.user.email,
    hash: req.user.hash,
    role: req.user.role
  });
});

module.exports = router;