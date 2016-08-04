
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var secret = 'n8jTwiRYBtJF25Wpk7X1fRvtxDrKs8P5lXP16DqytRwa0Pfa6omupI5YWgGjF3kUeP4F08LeklnwCQGoDMouLZcija8aRZaMEBQdrDSjRp9OGnVrfrZqosHE';

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

app.use(require('./controllers'));

module.exports = app;