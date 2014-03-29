
var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}

exports.registerNewPlayer = function(socket, room, playerId) {
	var game = games[room];
	game.addPlayer(playerId);
	socket.emit('game-joined', game);
	socket.broadcast.to(room).emit('new-player-joined', playerId);
}