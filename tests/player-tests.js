var players = require('../model/players.js')

exports.testBasicPlayerCreation = function(test) {
	test.expect(2);
	var p;
	test.doesNotThrow ( function () {
		p = new players.Player("Fredrik")
	})
	test.ok(p)
	test.done()
}