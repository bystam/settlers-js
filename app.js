var express = require('express')
	app = express(),
	server = require('http').createServer(app),
	rooms = require('./model/rooms');

// express app configuring
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'))

rooms.init(server);

// setup root route
app.get('/', function(req, res) {
	res.render('create', {});
});

app.post('/create', function(req, res) {
	var room = rooms.createNewRoom();
	res.render('link', { room: room })
});

app.get('/:room', function(req, res) {
	res.render('game', {});
});

// start server listening
var port = process.env.PORT || 5000;
server.listen(port, function() {
	console.log("Listening on port: " + port);
});