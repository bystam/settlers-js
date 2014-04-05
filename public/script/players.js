/*

Stash map




*/


//For the time being only fitted to 4 players
var stashObjectTypes = {road:"road", settlement:"settlement", city:"city", resource:"resource", card:"card" };
var stashCoordinates = [{x:1000,y:100}, {x:1000, y:400}, {x:1000, y:700}];
var possibleBuildingColors = ['green', 'red', 'blue', 'yellow']; 
var stashLocations = {};
var buildingColors = {};
//probably move the stash specific code out of here, stash.js ?
function initializeNewPlayer(canvas, playerId){
	if(stashLocations[playerId] !== undefined)
		return;
	initializeStash(playerId);
	drawInitialStash (canvas, playerId);
}

function initializeStash (playerId){
	var playerOneLocation = {x:20,y:100};
	var stashCoords;
	if(playerId === localPlayerId)
		stashCoords = playerOneLocation;
	else
		stashCoords = stashCoordinates.shift();
	stashLocations[playerId] = stashCoords;
	buildingColors[playerId] = possibleBuildingColors.shift();
}

// draw roads, settlements and cities
function drawInitialStash(canvas, playerId){
	var loc = canvas.circle(stashLocations[playerId].x, stashLocations[playerId].y, 10);
	loc.attr({
		fill:buildingColors[playerId]
	});
}

function addToStash (playerId, type){

}

function getFromStash(playerId, type){

}

