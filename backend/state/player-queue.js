

exports.Queue = function () {
	this.players = [];
	this.currentPlayer = 0;
	this.currentTurn = 1; // TODO = 0 when start game is implemented
};

exports.Queue.prototype = {
	constructor: exports.Queue,

	addPlayer: addPlayer,
	getCurrentPlayer: getCurrentPlayer,
	changeTurn: changeTurn,
	setCurrentPlayer: setCurrentPlayer,
	startGame: startGame
};

function addPlayer (player) {
	this.players.push(player);
};

function getCurrentPlayer () {
	return this.players[this.currentPlayer];
};

function changeTurn () {
	this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
	if (this.currentPlayer === this.startingPlayer)
		this.currentTurn++;
};

function setCurrentPlayer (player) {
	this.currentPlayer = this.players.indexOf(player);
};

function startGame () {
	this.startingPlayer = 0; // TODO random?
	this.currentTurn = 1;
}
