var stashCoordinates = [{x:20,y:100}, {x:20,y:700}, {x:1000, y:700}, {x:1000, y:100}, {x:10, y:10}, {x:10, y:10}, {x:10, y:10}, {x:10, y:10}];
var stashLocations = {};
//probably move the stash specific code out of here, stash.js ?
function initializeNewPlayer(canvas, playerId){
	addStashLocation(canvas, playerId);
}

function addStashLocation (board, playerId){
	console.log("adding stash for player "+playerId);

	var numStashes = Object.keys(stashLocations).length;
	var stashCoords = stashCoordinates[numStashes];
	stashLocations[playerId] = stashCoords;
}