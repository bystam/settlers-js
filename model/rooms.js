var io = require('socket.io'),
	sessions = require('./sessions');

var games = {};

exports.init = function(server) {
	io = io.listen(server, {log: false});

	io.sockets.on('connection', newConnection);
}

function newConnection (socket) {
	socket.on('room', function (client) {
		var room = client.room;
		var playerId = client.playerId;
		if (games[room] === null)
			socket.emit('room-404', {room: room});
		else
			registerPlayer(socket, room, playerId);
	});
}

exports.createNewRoom = function (room) {
	var room = sessions.newHash();
	games[room] = {};
	return room;
}

function registerPlayer (socket, room, playerId) {
	socket.join(room);
	socket.emit('room-joined', {room: room});
	io.sockets.in(room).emit('new-player-joined', { playerId: playerId });
}