var stashCoordinates = [{x:350,y:100}, {x:50,y:400}, {x:350, y:600}, {x:700, y:400}, {x:10, y:10}, {x:10, y:10}, {x:10, y:10}, {x:10, y:10}];
var stashLocations = {};
//probably move the stash specific code out of here, stash.js ?
function addStashLocation (board, playerId){
	var numStashes = Object.keys(stashLocations).length;
	var stashCoords = stashCoordinates[numStashes];
	console.log(numStashes);
	var cityShape = board.circle(stashCoords.x, stashCoords.y, 10);
	cityShape.attr({
		fill:"transparent"
	})
	stashLocations[playerId] = cityShape;
}

function initializePlayerStashes (game, board){
	game.players.forEach(function(playerId){
		addStashLocation(board, playerId);
	});
}