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
function drawInitialStash(canvas, stash, playerId){
	stashObjects[playerId].roads = [];
	stashObjects[playerId].settlements = [];
	stashObjects[playerId].cities = [];

	var spaceBetweenPiles = playerId === localPlayerId ? 50 : 20;
	var pileHeight = playerId === localPlayerId ? 50 : 20;
	var pileWidth = playerId === localPlayerId ? 50 : 50;
	
	var rect = {x:stashObjects[playerId].corner.x+40, y:stashObjects[playerId].corner.y, width: pileWidth, height:pileHeight};
	drawRoadStash(canvas, game.stashes[playerId].roads, rect, playerId);
	rect.y = rect.y + pileHeight + spaceBetweenPiles;
	drawSettlementStash(canvas, game.stashes[playerId].settlements, rect, playerId);
	rect.y = rect.y + pileHeight + spaceBetweenPiles;
	drawCityStash(canvas, game.stashes[playerId].cities, rect, playerId);

}

function drawSettlementStash(canvas, amount, rect, playerId){
	canvas.rect(rect.x, rect.y, rect.width, rect.height);
	for(var i=0;i<amount;i++){
		var coords = {x:getRandomInt(rect.x, rect.x+rect.width),y:getRandomInt(rect.y, rect.y+rect.height)};
		var shape = getShape(canvas, coords, stashObjectTypes.settlement, playerId);
		stashObjects[playerId].settlements.push(shape);
	}
}
function drawCityStash(canvas, amount, rect, playerId){
	canvas.rect(rect.x, rect.y, rect.width, rect.height);
	for(var i=0;i<amount;i++){
		var coords = {x:getRandomInt(rect.x, rect.x+rect.width),y:getRandomInt(rect.y, rect.y+rect.height)};
		var shape = getShape(canvas, coords, stashObjectTypes.city, playerId);
		stashObjects[playerId].cities.push(shape);
	}
}

function drawRoadStash (canvas, amount, rect, playerId){
	canvas.rect(rect.x, rect.y, rect.width, rect.height);
	for(var i=0;i<amount;i++){
		var coords = {x:getRandomInt(rect.x, rect.x+rect.width),y:getRandomInt(rect.y, rect.y+rect.height)};
		var shape = getShape(canvas, coords, stashObjectTypes.road, playerId);
		var rotation = new Snap.Matrix().rotate(getRandomInt(0,360), coords.x, coords.y);
		shape.transform(rotation);
		stashObjects[playerId].roads.push (shape);
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

