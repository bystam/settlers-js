var playerQueue = require('../logic/player-queue');

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}

exports.registerPlayerForTurns = function(socket, room, playerId) {
	var game = games[room];
	socket.on('turn-ended', function(data) {
		var dices = diceRoll();
		game.updateFromDiceRoll(dices);
		io.sockets.in(room).emit('new-turn', game);
	});
}

function diceRoll () {
	var dices = {};
	dices.first = Math.floor(Math.random() * 6) + 1;
	dices.second = Math.floor(Math.random() * 6) + 1;
	return dices;
}