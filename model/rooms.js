var io = require('socket.io'),
	sessions = require('./sessions'),
	gamestate = require('./gamestate'),
	players = require('./players'),
	games = {};

players.init(games, io);

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
			sätt upp lyssnare på eventsen (registerConnection)
		*/
	
		if(!games[room] || games[room].players.length === 4) {
			socket.emit('room-404', {room: room});
			return;
		}

		var playerId = games[room].players.length;
		registerConnection(socket, room, playerId);
	});
}

exports.createNewRoom = function () {
	var room = sessions.newHash();
	var game = new gamestate.Game(room);
	games[room] = game;
	return room;
}

function registerConnection (socket, room, playerId) {
	/*
		sätt upp lyssnare för alla event
	*/
	socket.join(room);

	players.registerNewPlayer(socket, room, playerId);
}