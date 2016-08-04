var express = require('express');
var router = express.Router();

router.use('/api/roles', require('./roles'));
router.use('/api/absences', require('./absences'));
router.use('/api/admin', require('./admin'));
router.use('/me', require('./profile'));
router.use('/auth', require('./auth'));

router.get('/app', function(req, res) {
	res.sendFile('/app/index.html', {root: __dirname});
});

module.exports = router