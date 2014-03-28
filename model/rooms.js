var io = require('socket.io');

var games = {};

exports.init = function(server) {
	io = io.listen(server);

	io.sockets.on('connection', newConnection);
}

// Heroku specific configuration
/*
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
*/

/*
TODO om rummet inte finns så ska 
*/

function newConnection (socket) {
	socket.on('room', function (client) {
		var room = client.room;
		var playerId = client.playerId;
		if (games[room] === null)
			registerRoom(room);
		registerPlayer(socket, room, playerId);
	});
}

function registerRoom(room) {
	games[room] = {};
}

function registerPlayer (socket, room, playerId) {
	socket.join(room);
	socket.emit('room-joined', {room: room});
	io.sockets.in(room).emit('new-player-joined', { playerId: playerId });
}