var playerQueue = require('../logic/player-queue');

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}

exports.registerPlayerForTurns = function(socket, room, playerId) {

}