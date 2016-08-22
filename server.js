var app = require('./app');
var port = 8080;
var http = require('http');
var io = require('socket.io');
var server = http.createServer(app);

io = io.listen(server);

app.use(function(request, response, next) {
	console.log("requete " + request);
	next();
});

require('./sockets')(io);

server.listen(port, function() {
  console.log('server listening on port ', port);
});