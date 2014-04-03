/*
	The module that handles simple hash ID creation
*/

var crypto = require('crypto');

var games = {};

var newHash = function () {
	var hash = crypto.randomBytes(20).toString('hex');
	return hash;
};

exports.newHash = newHash;
