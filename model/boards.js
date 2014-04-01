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
	var hexes = getHexes();
	shuffle(hexes);
	var tokens = getTokens();
	shuffle(tokens);
	for (var i = 0; i < 19; i++) {
		if (hexes[i].type === 'desert')
			hexes[i].token = null;
		else
			hexes[i].token = tokens.pop();
	}
	this.hexes = hexes;
}

/*
	4 Fields (Grain Resource)
	4 Forest (Lumber Resource)
	4 Pasture (Wool Resource)
	3 Mountains (Ore Resource)
	3 Hills (Brick Resource)
	1 Desert (No Resource)
*/
function getHexes () {
	var hexes = [];
	addHexesOfType(hexes, 4, 'field', 'grain');
	addHexesOfType(hexes, 4, 'forest', 'lumber');
	addHexesOfType(hexes, 4, 'pasture', 'wool');
	addHexesOfType(hexes, 3, 'mountain', 'ore');
	addHexesOfType(hexes, 3, 'hill', 'brick');
	addHexesOfType(hexes, 1, 'desert', null);
	return hexes;
}

function addHexesOfType(hexes, amount, type, resource) {
	for (var i = 0; i < amount; i++)
		hexes.push ({ type: type, resource: resource });
}

/*
	One "2"
	Two "3"
	Two "4"
	Two "5"
	Two "6"
	Two "8"
	Two "9"
	Two "10"
	Two "11"
	One "12"
*/
function getTokens() {
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

var neighborStructure = [
/*  0 */ {n: null, ne: null, se: 2, s: 4, sw: 1, nw: null},		
/*  1 */ {n: null, ne: 0, se: 4, s: 6, sw: 3, nw: null},
/*  2 */ {n: null, ne: null, se: 5, s: 7, sw: 4, nw: 0},
/*  3 */ {n: null, ne: 1, se: 6, s: 8, sw: null, nw: null},
/*  4 */ {n: 0, ne: 2, se: 7, s: 9, sw: 6, nw: 1},
/*  5 */ {n: null, ne: null, se: null, s: 10, sw: 7, nw: 2},
/*  6 */ {n: 1, ne: 4, se: 9, s: 11, sw: 8, nw: 3},
/*  7 */ {n: 2, ne: 5, se: 10, s: 12, sw: 9, nw: 4},
/*  8 */ {n: 3, ne: 6, se: 11, s: 13, sw: null, nw: null},
/*  9 */ {n: 4, ne: 7, se: 12, s: 14, sw: 11, nw: 6},
/* 10 */ {n: 5, ne: null, se: null, s: 15, sw: 12, nw: 7},
/* 11 */ {n: 6, ne: 9, se: 14, s: 16, sw: 13, nw: 8},
/* 12 */ {n: 7, ne: 10, se: 15, s: 17, sw: 14, nw: 9},
/* 13 */ {n: 8, ne: 11, se: 16, s: null, sw: null, nw: null},
/* 14 */ {n: 9, ne: 12, se: 17, s: 18, sw: 16, nw: 11},
/* 15 */ {n: 10, ne: null, se: null, s: null, sw: 17, nw: 12},
/* 16 */ {n: 11, ne: 14, se: 18, s: null, sw: null, nw: 13},
/* 17 */ {n: 12, ne: 15, se: null, s: null, sw: 18, nw: 14},
/* 18 */ {n: 14, ne: 17, se: null, s: null, sw: null, nw: 16}
]