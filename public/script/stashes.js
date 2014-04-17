
//For the time being only fitted to 4 players, this is 'easily' expanded by adding coordinates and colors
var stashObjectTypes = {road:"road", settlement:"settlement", city:"city", resource:"resource", card:"card" };
var stashCoordinates = [{x:950,y:50}, {x:950, y:250}, {x:950, y:500}];
var possibleBuildingColors = ['green', 'red', 'blue', 'yellow']; 
var stashObjects = {};
var buildingColors = {};

function initializeNewPlayer(canvas, playerId, stash){
	if(stashObjects[playerId] !== undefined)
		return;
	var isLocalPlayer = playerId === localPlayerId;
	initializeStash(playerId, isLocalPlayer);
	drawStashForPlayer (canvas, stash, playerId, isLocalPlayer);
}

function initializeStash (playerId, isLocalPlayer){
	var playerOneLocation = {x:60,y:100};
	var stashCoords = isLocalPlayer ? playerOneLocation : stashCoordinates.shift();
	stashObjects[playerId] = {roads:[], settlements:[], cities:[], corner:stashCoords};
	buildingColors[playerId] = possibleBuildingColors.shift();
}


function drawStashForPlayer(canvas, stash, playerId, isLocalPlayer){
	//set distances and sizes of stash objects
	var spaceBetweenPiles = isLocalPlayer ? 50 : 20;
	var pileHeight = isLocalPlayer ? 50 : 20;
	var pileWidth = isLocalPlayer ? 50 : 50;

	var rect = {x:stashObjects[playerId].corner.x, y:stashObjects[playerId].corner.y, width: pileWidth, height:pileHeight};
	drawRoadStash(canvas, stash.roads, rect, playerId);
	rect.x = rect.x + pileWidth + spaceBetweenPiles;
	drawSettlementStash(canvas, stash.settlements, rect, playerId);
	rect.x = rect.x + pileWidth + spaceBetweenPiles;
	drawCityStash(canvas, stash.cities, rect, playerId);

	//Initialize card areas
	if(isLocalPlayer){
		stashObjects[playerId].developmentCards = 
			getCardArea(
				canvas, 
				stashObjects[playerId].corner.x-60, 
				rect.y + pileHeight + spaceBetweenPiles+50, 
				pileWidth, playerId, isLocalPlayer, {setYPosition:function(){}});
	} else{
		stashObjects[playerId].developmentCards = {setYPosition:function(){}};
	}
	stashObjects[playerId].resourceCards = 
		getCardArea(
			canvas, 
			stashObjects[playerId].corner.x-60, 
			rect.y + pileHeight + spaceBetweenPiles+40, 
			pileWidth, playerId, isLocalPlayer, stashObjects[playerId].developmentCards);
}



function removeResources(resources, playerId){
	var toRemove = [];
	for(resource in resources){
		var amount = resources[resource];
		for(var i=0;i<amount;i++)
			toRemove.push(""+resource);
	}
	stashObjects[playerId].resourceCards.removeCards(toRemove);
}

function addResources(resources, playerId){
	resources.forEach(function(resource){
		stashObjects[playerId].resourceCards.addCard(resource);
	});
}

function drawSettlementStash(canvas, amount, rect, playerId){
	for(var i=0;i<amount;i++){
		var coords = {x:getRandomInt(rect.x, rect.x+rect.width),y:getRandomInt(rect.y, rect.y+rect.height)};
		var shape = getShape(canvas, coords, stashObjectTypes.settlement, playerId);
		stashObjects[playerId].settlements.push(shape);
	}
}
function drawCityStash(canvas, amount, rect, playerId){
	for(var i=0;i<amount;i++){
		var coords = {x:getRandomInt(rect.x, rect.x+rect.width),y:getRandomInt(rect.y, rect.y+rect.height)};
		var shape = getShape(canvas, coords, stashObjectTypes.city, playerId);
		stashObjects[playerId].cities.push(shape);
	}
}

function drawRoadStash (canvas, amount, rect, playerId){
	for(var i=0;i<amount;i++){
		var coords = {x:getRandomInt(rect.x, rect.x+rect.width),y:getRandomInt(rect.y, rect.y+rect.height)};
		var shape = getShape(canvas, coords, stashObjectTypes.road, playerId);
		var rotation = new Snap.Matrix().rotate(getRandomInt(0,360), coords.x, coords.y);
		shape.transform(rotation);
		stashObjects[playerId].roads.push (shape);
	}
}

function getShape (canvas, coords, type, playerId, isLocalPlayer, params){
	if(type == stashObjectTypes.road){ //replace with clean method in roads.js
		var road = canvas.rect(coords.x, coords.y, 10, 50);
		road.attr(getRoadColors(playerId));
		return road;
	}
	if(type === stashObjectTypes.settlement)
		return getSettlementShape(canvas, coords, playerId);
	if(type === stashObjectTypes.city)
		return getCityShape(canvas, coords, playerId);
	if(type === stashObjectTypes.card){
		return getCardShape(canvas, coords, playerId, isLocalPlayer, params);
	}
}
