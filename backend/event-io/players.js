
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

	var privateGameCopy = game.privateCopyForPlayer(playerId);
	socket.emit('game-joined', { playerId: playerId, game: privateGameCopy });
	socket.broadcast.to(room).emit('new-player-joined', {playerId: playerId, stash: privateGameCopy.stashes[playerId]});

	// TODO hantera recovery av spelare som disconnectat
	socket.on('reload-stash', function () {
		socket.emit('reload-stash', game.stashes[playerId]);
	});
}
