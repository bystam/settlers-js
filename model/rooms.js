var io = require('socket.io');

var games = {};

exports.init = function(server) {
	io.listen(server);

	io.sockets.on('connection', function (socket) {
		socket.on('room', function (client) {
			var room = client.room;
			var playerId = client.playerId;
			if (games[room] === null)
				registerRoom(room);
			registerPlayer(room, playerId, socket);
		});
	});
}

// Heroku specific configuration
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

function registerRoom(room) {
	games[room] = {};
}

function registerPlayer (socket, room, playerId) {
	socket.join(room);
}