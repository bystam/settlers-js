/*
	The module that handles I/O events that are related to players performing
	trading actions
*/

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}