
var addPlayer = function(player) {
	this.queue.push(player);
}

var getCurrentPlayer = function() {
	return this.queue[this.currentPlayer]
}

var changeTurn = function() {
	this.currentPlayer = (this.currentPlayer + 1) % this.queue.length
}

var setCurrentPlayer = function (player) {
	this.currentPlayer = this.queue.indexOf(player)
}

exports.Queue = function () {
	this.queue = []
	this.currentPlayer = 0
	this.addPlayer = addPlayer
	this.getCurrentPlayer = getCurrentPlayer
	this.changeTurn = changeTurn
	this.setCurrentPlayer = setCurrentPlayer
}