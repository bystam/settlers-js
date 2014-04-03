// http://boardgamegeek.com/thread/324667/the-counts-components-settlers-of-catan-4th-editio


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

exports.Board = function() { // constructor
	this.generateRandomMap = generateRandomMap; // initial state creating function
}

var generateRandomMap = function () {
	var map = getRandomMapFromStructure(defaultMap);
	var tokens = getTokens();
	shuffle(tokens);
	placeTokensOnHexes(tokens, map.hexes)
	this.hexes = map.hexes;
	this.map = map.map;
}

function getRandomMapFromStructure (mapStructure) {
	var hexes = [];
	mapStructure.brickTypes.forEach(function(brickType) {
		addHexesOfType(hexes, brickType.amount, brickType.type, brickType.resource);
	});
	shuffle(hexes);

	var map = createMapFromHexesAndStructure(hexes, mapStructure);
	return { hexes: hexes, map: map };
}

function addHexesOfType(hexes, amount, type, resource) {
	for (var i = 0; i < amount; i++)
		hexes.push ({ type: type, resource: resource });
}

function createMapFromHexesAndStructure (hexes, mapStructure) {
	var grid = mapStructure.grid;
	var map = [];
	var hex = 0;
	for (var row = 0; row < grid.length; row++) {
		map.push([]);
		for (var col = 0; col < grid[row].length; col++) {
			if (grid[row][col] === O)
				map[row].push(hexes[hex++]);
			else
				map[row].push(null);
		}
	}
	return map;
}

/*
	One "2", Two "3", Two "4", Two "5", Two "6", Two "8", Two "9", Two "10", Two "11", One "12"
*/
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

function shuffle(array) {
    var counter = array.length, temp, index;

    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;

        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

var O = 1; // land
var W = 2; // water
var _ = 0; // dead non-existing space

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
		[_, _, O, _, _],
		[_, O, _, O, _],
		[O, _, O, _, O],
		[_, O, _, O, _],
		[O, _, O, _, O],
		[_, O, _, O, _],
		[O, _, O, _, O],
		[_, O, _, O, _],
		[_, _, O, _, _]
	]
};
