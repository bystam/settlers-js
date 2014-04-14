/*
	This module fills the purpose of a single object creating the
	state structure for one entire game (in a single room).

	This will contain all the different state required to access,
	examine and mutate gamestate.
*/

var boards = require('./boards.js'),
		stashes = require('./stash.js'),
		ruleset = require('./ruleset.js'),
		playerQueue = require('./player-queue');

exports.Game = function(room) { // constructor
	this.room = room;

	initPlayers(this);
	initBoard(this);
	initRules(this);
	this.privateCopyForPlayer = privateCopyForPlayer;
}

function initPlayers(game) {
	game.queue = new playerQueue.Queue();
	game.players = game.queue.players;
	game.stashes = {};
	game.addPlayer = function(playerId) {
		game.queue.addPlayer(playerId);
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
	copy.privateStash = this.stashes[playerId]; // TODO!!!
	copy.stashes = this.stashes; //REDO LATER, should not send resources/cards
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
