/*

Stash map

[ROADS]									[enemy stash]
[SETTLEMENTS]						
[CITIES]								
[DEV CARDS]
[RESOURCES]								[enemy stash 2]
										[enemy stash 3]


*/


//For the time being only fitted to 4 players
var stashObjectTypes = {road:"road", settlement:"settlement", city:"city", resource:"resource", card:"card" };
var stashCoordinates = [{x:1000,y:100}, {x:1000, y:400}, {x:1000, y:700}];
var possibleBuildingColors = ['green', 'red', 'blue', 'yellow']; 
var stashObjects = {};
var buildingColors = {};
//probably move the stash specific code out of here, stash.js ?
function initializeNewPlayer(canvas, playerId, game){
	if(stashObjects[playerId] !== undefined)
		return;
	initializeStash(playerId);
	drawInitialStash (canvas, game, playerId);
}

function initializeStash (playerId){
	var playerOneLocation = {x:20,y:100};
	var stashCoords;
	if(playerId === localPlayerId)
		stashCoords = playerOneLocation;
	else
		stashCoords = stashCoordinates.shift();
	stashObjects[playerId] = {};
	stashObjects[playerId].corner = stashCoords;
	buildingColors[playerId] = possibleBuildingColors.shift();
}

// draw roads, settlements and cities for local player
//we should keep track of these and use them for animations instead of new objects...
function drawInitialStash(canvas, stash, playerId){
	var corner = stashObjects[playerId].corner;
	corner.x = corner.x + 40;
	var stashInfo = game.stashes[playerId];
	var spaceBetweenPiles = 50;

	var roadPileSize = playerId === localPlayerId ? 50 : 30;
	var y = {from: corner.y, to:corner.y+roadPileSize};
	var x = {from: corner.x, to:corner.x+roadPileSize}; 
	console.log(stashInfo);
	stashObjects[playerId].roads = [];
	for(var i=0;i<stashInfo.roads;i++){
		var coords = {x:getRandomInt(x.from, x.to),y:getRandomInt(y.from, y.to)};
		var shape = getShape(canvas, coords, stashObjectTypes.road, playerId);
		var rotation = new Snap.Matrix().rotate(getRandomInt(0,360), coords.x, coords.y);
		shape.transform(rotation);
		stashObjects[playerId].roads.push (shape);
	}

	var settlementPileSize = playerId === localPlayerId ? 50 : 20;
	var y = {from: y.to +spaceBetweenPiles, to:y.to + spaceBetweenPiles + settlementPileSize};
	var x = {from: corner.x, to:corner.x+settlementPileSize}; 
	stashObjects[playerId].settlements = [];
	for(var i=0;i<stashInfo.settlements;i++){
		var coords = {x:getRandomInt(x.from, x.to),y:getRandomInt(y.from, y.to)};
		var shape = getShape(canvas, coords, stashObjectTypes.settlement, playerId);
		stashObjects[playerId].settlements.push(shape);
	}
	stashObjects[playerId].cities = [];
	for(var i=0;i<stashInfo.cities;i++){
		var coords = {x:getRandomInt(x.from, x.to),y:getRandomInt(y.from, y.to)};
		var shape = getShape(canvas, coords, stashObjectTypes.city, playerId);
		stashObjects[playerId].cities.push(shape);
	}

}

function getShape (canvas, coords, type, playerId){
	if(type == stashObjectTypes.road){ //replace with clean method in roads.js
		var road = canvas.rect(coords.x, coords.y, 10, 50);
		road.attr(getRoadGraphics(playerId));
		return road;
	}
	if(type === stashObjectTypes.settlement)
		return getSettlementShape(canvas, coords, playerId);
	if(type === stashObjectTypes.city)
		return getCityShape(canvas, coords, playerId);
	if(type === stashObjectTypes.resource){
		//deal with it
	}
	if(type === stashObjectTypes.card){
		//deal...
	}
}

function addToStash (playerId, type){

}

function getFromStash(playerId, type){

}

