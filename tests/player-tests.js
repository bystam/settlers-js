var players = require('../model/players.js'),
	playerQueue = require('../logic/player-queue.js')

exports.testBasicPlayerCreation = function(test) {
	test.expect(2);
	var p;
	test.doesNotThrow ( function () {
		p = new players.Player(null)
	})
	test.ok(p)
	test.done()
}

exports.testNameAssigningWorks = function(test) {
	test.expect(2)
	var p1 = new players.Player("Fredrik")
	var p2 = new players.Player("Lolfi")
	test.equal(p1.name, "Fredrik")
	test.equal(p2.name, "Lolfi")
	test.done()
}

exports.creatingQueueShouldWork = function(test) {
	test.expect(1)
	test.doesNotThrow (function () {
		var queue = new playerQueue.Queue()
	})
	test.done()
}

exports.addingPlayerToPlayerQueueShouldWork = function(test) {
	test.expect(1)
	var queue = new playerQueue.Queue()
	test.doesNotThrow (function () {
		var player = players.Player("Fredrik")
		queue.addPlayer (player)
	})
	test.done()
}