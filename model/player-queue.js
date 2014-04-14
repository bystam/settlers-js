
var addPlayer = function(player) {
	this.players.push(player);
}

var getCurrentPlayer = function() {
	return this.players[this.currentPlayer]
}

var changeTurn = function() {
	this.currentPlayer = (this.currentPlayer + 1) % this.players.length
}

var setCurrentPlayer = function (player) {
	this.currentPlayer = this.players.indexOf(player)
}

exports.Queue = function () {
	this.players = []
	this.currentPlayer = 0
	this.addPlayer = addPlayer
	this.getCurrentPlayer = getCurrentPlayer
	this.changeTurn = changeTurn
	this.setCurrentPlayer = setCurrentPlayer
}
