var boards = require('./boards.js'),
	stashes = require('./stash.js');

exports.Game = function(room) { // constructor
	this.room = room;
	this.board = new boards.Board();
	this.board.generateRandomMap();
	initPlayers(this);
	this.privateCopyForPlayer = privateCopyForPlayer;
	this.placeRoad = placeRoad;
	this.placeSettlement = placeSettlement;
}

function initPlayers(game) {
	game.players = [];
	game.stashes = {};
	game.addPlayer = function(playerId) {
		game.players.push(playerId);
		game.stashes[playerId] = new stashes.Stash(playerId);
	}
}

function placeRoad(coords, playerId){

}

function placeSettlement(coords, playerId){

}

// stämmer inte
function privateCopyForPlayer(playerId) {
	/*
	1. public board
	2. amount of enemy cards
	3. hidden resources
	4. hidden cards
	5. public cards
	6. achievements
	7. amount of building left
	*/
	var copy = JSON.parse(JSON.stringify(this));
	delete copy.stashes;
	return copy;
}
