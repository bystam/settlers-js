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
	drawInitialStash (canvas, game.stashes[playerId], playerId, playerId === localPlayerId);
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
function drawInitialStash(canvas, stash, playerId, isLocalPLayer){
	stashObjects[playerId].roads = [];
	stashObjects[playerId].settlements = [];
	stashObjects[playerId].cities = [];
	stashObjects[playerId].resources = {};
	stashObjects[playerId].resources.cards = [];

	var spaceBetweenPiles = isLocalPLayer ? 50 : 30;
	var pileHeight = isLocalPLayer ? 50 : 20;
	var pileWidth = isLocalPLayer ? 50 : 50;


	var rect = {x:stashObjects[playerId].corner.x+10, y:stashObjects[playerId].corner.y, width: pileWidth, height:pileHeight};
	drawRoadStash(canvas, stash.roads, rect, playerId);
	rect.x = rect.x + pileWidth + spaceBetweenPiles;
	drawSettlementStash(canvas, stash.settlements, rect, playerId);
	rect.x = rect.x + pileWidth + spaceBetweenPiles;
	drawCityStash(canvas, stash.cities, rect, playerId);

	stashObjects[playerId].resources = getResourceCardArea(canvas, stashObjects[playerId].corner.x, rect.y + pileHeight + spaceBetweenPiles, playerId, isLocalPLayer);
	var resources = [1,2,3,4,5,6,7]; //array should be stash.resources
	for(var i=0;i<resources.length;i++){
		stashObjects[playerId].resources.addResource(resources[i]);
	}
	rect.y = rect.y + pileHeight + spaceBetweenPiles;
	rect.x = stashObjects[playerId].corner.x+10;
	rect.width = pileWidth * 3;
	rect.height = pileWidth * 3/2;
	drawResourceStash(canvas, [1,2,3,4,5,6,7], rect, playerId, isLocalPLayer);	
}

function getResourceCardArea(canvas, cornerX, cornerY, playerId, isLocalPLayer){
	var area = {};
	area.cards = [];
	area.addResource = function(resource){

	}
	area.removeResource = function(resource){
		for(var i=0;i<area.cards.length;i++){
			if(area.cards[i].resource === resource){
				area.cards[i].remove();
				area.cards.splice(i, 1);
				break;
			}
		}
		area.reshuffle();
	}
	area.reshuffle = function (){

	}

	return area;
}

//TODO Need to add special handling for different resources when that stuff works...
function drawResourceStash(canvas, resources, rect, playerId, isLocalPlayer){
	// canvas.rect(rect.x, rect.y, rect.width, rect.height);
	var rows = isLocalPlayer ? 3 : 1;
	var resourceWidth = rect.width/3;
	var yCoord = rect.y;
	for(var row=0;row<rows;row++){
		for(var column = 0;column<4;column++){

		}

	}

	for(var i=0;i<resources.length;i++){
		xCoord = rect.x + resourceWidth*(i%3)-(10*(i%3));
		if(i%3 === 0  && i>0){
			yCoord += resourceWidth*(4/3) + 10;
		}
		var coords = {x:xCoord,y:yCoord, width:resourceWidth, height:resourceWidth*(4/3)};
		var shape = getShape(canvas, coords, stashObjectTypes.resource, playerId);
		stashObjects[playerId].resources.cards.push(shape);
		
	}
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

function getShape (canvas, coords, type, playerId, isLocalPlayer){
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
		return getResourceShape(canvas, coords, playerId);
	}
	if(type === stashObjectTypes.card){
		//deal...
	}
}

function getResourceShape (canvas, coords, playerId){
	var resource = canvas.rect(coords.x, coords.y, coords.width, coords.height);
	resource.attr({
		stroke: buildingColors[playerId],
		strokeWidth:4,
		fill:"black"
	});
	resource.hover(function (){
		resource.attr({
			// x:coords.x-coords.width/2,
			width:coords.width*(4/3),
			height:coords.height*(7/6)
		});
		resource.toFront();
	}, function (){
		resource.attr({
			// x:coords.x,
			width:coords.width,
			height:coords.height
		});
	})
	return resource;
}

function addToStash (playerId, type){

}

function getFromStash(playerId, type){

}

