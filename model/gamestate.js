// http://boardgamegeek.com/thread/324667/the-counts-components-settlers-of-catan-4th-editio

var boards = require('./boards.js');

exports.Game = function(room) { // constructor
	this.room = room;
	this.board = new boards.Board();
	this.board.generateRandomMap();
	initPlayers(this);
}

function initPlayers(game) {
	game.players = [];
	game.addPlayer = function(playerId) {
		game.players.push(playerId);
	}
}
