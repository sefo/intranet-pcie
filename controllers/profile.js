var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json({
    id: req.user.id,
    nom: req.user.nom,
    prenom: req.user.prenom,
    email: req.user.email,
    hash: req.user.hash,
    role_id: req.user.role_utilisateur.id,
    role: req.user.role_utilisateur.intitule,
    permissions: req.user.permissions
  });
});

module.exports = router;