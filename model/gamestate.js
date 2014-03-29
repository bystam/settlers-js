
var generateRandomMap = function () {

}

exports.Game = function(room) { // constructor
	this.room = room;
	this.generateRandomMap = generateRandomMap; // initial state creating function
	initPlayers(this);
}

function initPlayers(game) {
	game.players = [];
	game.addPlayer = function(playerId) {
		game.players.push(playerId);
	}
}