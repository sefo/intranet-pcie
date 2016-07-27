var app = require('./app');
var port = 8080;
var http = require('http');

app.use(function(request, response, next) {
	console.log("requete " + request);
	next();
});

http.createServer(app).listen(port, function() {
  console.log('server listening on port ', port);
});