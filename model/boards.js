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