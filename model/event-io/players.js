
/*
	The module that handles I/O events that are related to players
	connecting (and disconnecting?)
*/

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}

exports.registerNewPlayer = function(socket, room, playerId) {
	var game = games[room];
	game.addPlayer(playerId);
	game.roadsForPlayer[playerId] = [];
	game.buildingsForPlayer[playerId] = [];
	socket.emit('game-joined', {playerId:playerId, game:game.privateCopyForPlayer(playerId)});
	socket.broadcast.to(room).emit('new-player-joined', playerId);
}
