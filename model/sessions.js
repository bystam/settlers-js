var crypto = require('crypto');

var newHash = function () {
	var hash = crypto.randomBytes(20).toString('hex');
	return hash;
}

exports.newHash = newHash;