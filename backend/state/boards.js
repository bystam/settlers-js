// http://boardgamegeek.com/thread/324667/the-counts-components-settlers-of-catan-4th-editio

var graphs = require('./graphs'),
		mapCreator = require('./maps/map-creator'),
		defaultMap = require('./maps/default-map').map;

/*
List of pieces:

1) Nineteen (19) Terrain Hexes (Tiles).
2) Six (6) Sea Frame Pieces.
3) Nine (9) Harbor Pieces.
4) Eighteen (18) Circular Number Tokens (Chits).
5) Ninety-five (95) Resource Cards (Bearing the Symbols for the Ore, Grain, Lumber, Wool, and Brick Resources).
6) Twenty-five (25) Development Cards (14 Knight/Soldier Cards, 6 Progress Cards, 5 Victory Point Cards).
7) Four (4) Building Costs Cards.
8) Two (2) Special Cards: Longest Road & Largest Army.
12) Two (2) Dice (1 Yellow, 1 Red).
13) One (1) Robber
14) One (1) Games Rules & Almanac Booklet.

*/

var LAND = 1;
var WATER = 2;
var DEAD_SPACE = 0;

exports.Board = function() { // constructor
}

exports.Board.prototype = {
	constructor: exports.Board,

	generateRandomMap: generateRandomMap,

	getNonBlockedHexesWithToken: getNonBlockedHexesWithToken,

	forEachHex: function (action) {
		if (!this.map)
			throw "must call generateRandomMap before looping hexes"
		this.map.forEachHex (action);
	}
};

function generateRandomMap () {
	var creator = new mapCreator.MapCreator (defaultMap);
	this.map = creator.generateRandomMap();
	this.resourceBlockedHex = getDesertHex (this.map);

	graphs.setupConstructionGraph (this);
}

function getNonBlockedHexesWithToken (tokenValue) {
	var hexes = [];
	this.forEachHex (function(hex) {
		if (hex.token && hex.token.value === tokenValue && hex !== this.resourceBlockedHex)
			hexes.push (hex);
	});
	return hexes;
}

function getDesertHex (map) {
	var desert = null;
	map.forEachHex (function (hex) {
		if (hex.type === 'desert')
			return desert = hex;
	});
	return desert;
}
