var crypto = require('crypto'),
	io = require('socket.io');

var games = {};

var newHash = function () {
	var hash = crypto.randomBytes(20).toString('hex');
	return hash;
};

exports.newHash = newHash;
