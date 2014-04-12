/*
	The module that handles I/O events that are related to turn events.

	Turn events are, for example, players clicking "end my turn", dice rolling and so on
	(perhaps even resource giving based on cities?)
*/

//var playerQueue = require('../logic/player-queue');

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}

exports.registerPlayerForTurns = function(socket, room, playerId) {
	var game = games[room];
	socket.on('turn-ended', function(data) {
		game.lastDiceRoll = diceRoll();
		io.sockets.in(room).emit('new-turn', game);
	});

	socket.on('draw-cards', function(data) {
		var diceSum = game.lastDiceRoll.sum();
		var hexesWithDiceSum = game.board.getHexesWithToken(diceSum);
		// TODO filter cities for this player with adjacent target hexes
	});

	socket.on('start-game', function(data) {
		if (!gameIsFull(room))
			return io.sockets.in(room).emit('need-more-players', {} );
		io.sockets.in(room).emit(game.stashes);
	});
}

function gameIsFull (room) {
	return games[room].players.length === 4;
}

function diceRoll () {
	var dices = {};
	dices.first = Math.floor(Math.random() * 6) + 1;
	dices.second = Math.floor(Math.random() * 6) + 1;
	dices.sum = function () { return this.first + this.second };
	return dices;
}
