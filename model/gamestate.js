var boards = require('./boards.js'),
	stashes = require('./stash.js'),
	ruleset = require('./ruleset.js');

exports.Game = function(room) { // constructor
	this.room = room;
	
	initPlayers(this);
	initBoard(this);
	initRules(this);
	this.privateCopyForPlayer = privateCopyForPlayer;
}

function initPlayers(game) {
	game.players = [];
	game.stashes = {};
	game.addPlayer = function(playerId) {
		game.players.push(playerId);
		game.stashes[playerId] = new stashes.Stash(playerId);
	}
}

function initBoard(game) {
	game.board = new boards.Board();
	game.board.generateRandomMap();
}

function initRules(game) {
	game.rules = new ruleset.Rules(game);
}

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
	var copy = {};
	copy.room = this.room;
	copy.board = this.board;
	copy.players = this.players;
	copy.privateStash = {}; // TODO!!!
	return copy;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
