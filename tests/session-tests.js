var sessions = require('../model/sessions.js');

exports.testHashesNotEqual = function(test) {
	test.expect(1);
	var one = sessions.newHash();
	var two = sessions.newHash();
	test.notEqual(one, two);
	test.done();
}