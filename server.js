var app = require('./app');
var port = 8080;
var http = require('http');
var io = require('socket.io');
var server = http.createServer(app);
var models = require('./models');

io = io.listen(server);

app.use(function(request, response, next) {
	console.log("requete " + request);
	next();
});

require('./sockets')(io);

models.sequelize.sync().then(function() {
	server.listen(port, function() {
		console.log('server listening on port ', port);
	});
});