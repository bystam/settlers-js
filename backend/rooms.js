
/*
	The module that handles the combination of all other modules, containing the
	main gamestate collection and all the different game "rooms"

	This is responsible for initiating all other I/O modules with
	the gamestates and io objects
*/

var io = require('socket.io'),
	sessions = require('./sessions'),
	gamestate = require('./state/gamestate'),
	building = require('./event-io/building'),
	players = require('./event-io/players'),
	trades = require('./event-io/trades'),
	knight = require('./event-io/knight'),
	turns = require('./event-io/turns'),
	games = {};


exports.init = function(server) {
	io = io.listen(server, {log: false});

	io.sockets.on('connection', newConnection);
	building.init(games, io);
	players.init(games, io);
	trades.init(games, io);
	knight.init(games, io);
	turns.init(games, io);

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

		// if(!games[room] || games[room].players.length === 4) {
		// 	socket.emit('room-404', {room: room});
		// 	return;
		// }

		var playerId = 'p' + games[room].players.length;
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
	building.setupBuildingEvents(socket, room, playerId);
	turns.registerPlayerForTurns(socket, room, playerId);
	trades.registerPlayerForTrades(socket, room, playerId);
	knight.registerPlayerForKnightActions(socket, room, playerId);
}
