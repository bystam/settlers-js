var crypto = require('crypto'),
	io = require('socket.io');

var games = {};

var newHash = function () {
	var hash = crypto.randomBytes(20).toString('hex');
	return hash;
};

exports.newHash = newHash;

var registerGame = function() {
	var hash = newHash();

	var gameState = {};
	var gameSockets = io.of('/' + hash).on('connection', function(socket) {
			socket.on('turnChanged', function(data) {

			});
		});

	return hash;
}


