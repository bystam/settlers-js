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
		/*
			Egentligen gäller följande:
			om spelet inte finns
				returnera room 404 och döda anslutningen
			om spelet är fullt (4 spelare är connectade redan)
				returnera balle och döda anslutningen
			sätt upp lyssnare på eventsen (registerPlayer)
		*/
	
		if(!games[room] || games[room].playerCount == 4) {
			socket.emit('room-404', {room: room});
			return;
		}

		var playerId = games[room].playerCount;
		games[room].playerCount++;
		registerPlayer(socket, room, playerId);
	});
}

exports.createNewRoom = function (room) {
	var room = sessions.newHash();
	games[room] = {};
	games[room].playerCount = 0;
	return room;
}

function registerPlayer (socket, room, playerId) {
	/*
		sätt upp lyssnare för alla event
	*/
	socket.join(room);
	socket.emit('room-joined', {room: room});
	io.sockets.in(room).emit('new-player-joined', { playerId: playerId });
}