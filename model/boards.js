// http://boardgamegeek.com/thread/324667/the-counts-components-settlers-of-catan-4th-editio

var graphCreator = require('./graph-creator');

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
	this.generateRandomMap = generateRandomMap; // initial state creating function
	this.getHexesWithToken = getHexesWithToken;
	this.forEachHex = forEachHex;
}

var generateRandomMap = function () {
	this.map = getRandomMapFromStructure(defaultMap);
	graphCreator.populateWithGraph(this);
}

function getRandomMapFromStructure (mapStructure) {
	var landHexes = getLandHexes(mapStructure);
	var map = createMapFromHexesAndStructure(landHexes, mapStructure);
	setHexNeighbors(map);
	return map;
}

function getLandHexes (mapStructure) {
	var landHexes = [];
	mapStructure.brickTypes.forEach(function(brickType) {
		addHexesOfType(landHexes, brickType.amount, brickType.type, brickType.resource);
	});
	shuffle(landHexes);

	var tokens = getTokens();
	shuffle(tokens);
	placeTokensOnHexes(tokens, landHexes);
	return landHexes;
}

function addHexesOfType(hexes, amount, type, resource) {
	for (var i = 0; i < amount; i++)
		hexes.push ({ type: type, resource: resource });
}

function createMapFromHexesAndStructure (landHexes, mapStructure) {
	var grid = mapStructure.grid;
	var map = [];
	var hex = 0;
	for (var row = 0; row < grid.length; row++) {
		map.push([]);
		for (var col = 0; col < grid[row].length; col++) {
			if (grid[row][col] === LAND)
				map[row].push(landHexes[hex++]);
			else if (grid[row][col] === WATER)
				map[row].push({ type: 'ocean' });
			else
				map[row].push(null);
		}
	}

	return map;
}

function setHexNeighbors (map) {
	forEachHex (map, function(hex, row, col) {
		setNeighbors(hex, row, col, map)
	});
}

function setNeighbors(hex, row, col, map) {
	var hexExists = function(coords) {
		return map[coords.row] && map[coords.row][coords.col];
	}
	// neighbor order determined by snap.svg corner point ordering
	var ne = { row: row-1, col: col+1 };
	var se = { row: row+1, col: col+1 };
	var s = { row: row+2, col: col };
	var sw = { row: row+1, col: col-1 };
	var nw = { row: row-1, col: col-1 };
	var n = { row: row-2, col: col };
	var neighbors = [ne, se, s, sw, nw, n];

	for (var i = 0; i < neighbors.length; i++)
		if (!hexExists(neighbors[i]))
			neighbors[i] = null;

	hex.neighbors = neighbors;
}

function getTokens() { // TODO make generic
	var tokens = [];
	for (var i = 2; i <= 12; i++) {
		if (i === 7)
			continue;
		if (i > 2 && i < 12)
			tokens.push({value: i});
		tokens.push({value: i})
	}
	return tokens;
}

function placeTokensOnHexes(tokens, hexes) {
	for (var i = 0; i < hexes.length; i++) {
		if (hexes[i].type === 'desert')
			hexes[i].token = null;
		else
			hexes[i].token = tokens.pop();
	}
}

function getHexesWithToken (tokenValue) {
	var hexes = [];
	forEachHex (this.map, function(hex) {
		if (hex.token && hex.token.value === tokenValue)
			hexes.push (hex);
	});
	return hexes;
}

function forEachHex(map, action) {
	var height = map.length;
	var width = map[0].length;
	for (var row = 0; row < height; row++) {
		for (var col = 0; col < width; col++) {
			var hex = map[row][col];
			if (hex)
				action(hex, row, col);
		}
	}
}

function shuffle(array) {
    array.sort(function() { return 0.5 - Math.random() });
}

var $ = LAND;
var w = WATER;
var _ = DEAD_SPACE;

var defaultMap = {
	brickTypes: [
		{ type: 'field', resource: 'grain', amount: 4 },
		{ type: 'forest', resource: 'lumber', amount: 4 },
		{ type: 'pasture', resource: 'wool', amount: 4 },
		{ type: 'mountain', resource: 'ore', amount: 3 },
		{ type: 'hill', resource: 'brick', amount: 3 },
		{ type: 'desert', resource: null, amount: 1 },
	],
	grid: [
		[_, _, _, w, _, _, _],
		[_, _, w, _, w, _, _],
		[_, w, _, $, _, w, _],
		[w, _, $, _, $, _, w],
		[_, $, _, $, _, $, _],
		[w, _, $, _, $, _, w],
		[_, $, _, $, _, $, _],
		[w, _, $, _, $, _, w],
		[_, $, _, $, _, $, _],
		[w, _, $, _, $, _, w],
		[_, w, _, $, _, w, _],
		[_, _, w, _, w, _, _],
		[_, _, _, w, _, _, _]
	]
};
