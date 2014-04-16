/*
	This module fills the purpose of a single object creating the
	state structure for one entire game (in a single room).

	This will contain all the different state required to access,
	examine and mutate gamestate.
*/

var boards = require('./boards.js'),
		stashes = require('./stash.js'),
		rules = require('./rules.js'),
		playerQueue = require('./player-queue');

exports.Game = function(room) { // constructor
	this.room = room;

	initPlayers(this);
	initBoard(this);
	initRules(this);
}

exports.Game.prototype = {
	constructor: exports.Game,

	addPlayer: function(playerId) {
		this.queue.addPlayer(playerId);
		this.stashes[playerId] = new stashes.Stash(playerId);
	},

	privateCopyForPlayer: privateCopyForPlayer,
	diceRoll: diceRoll
}

function initPlayers(game) {
	game.queue = new playerQueue.Queue();
	game.players = game.queue.players;
	game.stashes = {};
	game.roadsForPlayer = {};
	game.buildingsForPlayer = {};

}

function initBoard(game) {
	game.board = new boards.Board();
	game.board.generateRandomMap();
}

function initRules(game) {
	game.rules = new rules.Rules(game);
}

function diceRoll () {
	var dices = {};
	dices.first = Math.floor(Math.random() * 6) + 1;
	dices.second = Math.floor(Math.random() * 6) + 1;
	dices.sum = function () { return this.first + this.second };
	this.lastDiceRoll = dices;
}

function privateCopyForPlayer(playerId) {
	var copy = {};
	copy.room = this.room;
	copy.board = this.board;
	copy.players = this.players;
	copy.stashes = hiddenify(this.stashes, playerId);
	return copy;
}

function hiddenify(stashes, playerId){
	var hiddenifiedStash = {};
	for(playerId in stashes){
		var stash = stashes[playerId];
		if(stash.playerId !== playerId)
			hiddenifiedStash[playerId] = stash.hiddenify();
		else
			hiddenifiedStash[playerId] = stash;
	}
	return hiddenifiedStash;
}

