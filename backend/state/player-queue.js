
var addPlayer = function(player) {
	this.players.push(player);
};

var getCurrentPlayer = function() {
	return this.players[this.currentPlayer];
};

var changeTurn = function() {
	this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
	if (this.currentPlayer === 0)
		this.currentTurn++;
};

var setCurrentPlayer = function (player) {
	this.currentPlayer = this.players.indexOf(player);
};

exports.Queue = function () {
	this.players = [];
	this.currentPlayer = 0;
	this.currentTurn = 1;
};

exports.Queue.prototype = {
	constructor: exports.Queue,

	addPlayer: addPlayer,
	getCurrentPlayer: getCurrentPlayer,
	changeTurn: changeTurn,
	setCurrentPlayer: setCurrentPlayer
};
