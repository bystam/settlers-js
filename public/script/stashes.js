
//For the time being only fitted to 4 players
var stashObjectTypes = {road:"road", settlement:"settlement", city:"city", resource:"resource", card:"card" };
var stashCoordinates = [{x:950,y:100}, {x:950, y:400}, {x:950, y:700}];
var possibleBuildingColors = ['green', 'red', 'blue', 'yellow']; 
var stashObjects = {};
var buildingColors = {};
//probably move the stash specific code out of here, stash.js ?
function initializeNewPlayer(canvas, playerId, game){
	if(stashObjects[playerId] !== undefined)
		return;
	var isLocalPlayer = playerId === localPlayerId;
	initializeStash(playerId, isLocalPlayer);
	drawStashForPlayer (canvas, game.stashes[playerId], playerId, isLocalPlayer);
}

function initializeStash (playerId, isLocalPlayer){
	var playerOneLocation = {x:50,y:100};
	var stashCoords = isLocalPlayer ? playerOneLocation : stashCoordinates.shift();
	stashObjects[playerId] = {roads:[], settlements:[], cities:[], corner:stashCoords};
	buildingColors[playerId] = possibleBuildingColors.shift();
}


function drawStashForPlayer(canvas, stash, playerId, isLocalPLayer){
	//initialize arrays to keep game piece shapes in

	//set distances and sizes of stash objects
	var spaceBetweenPiles = isLocalPLayer ? 50 : 20;
	var pileHeight = isLocalPLayer ? 50 : 20;
	var pileWidth = isLocalPLayer ? 50 : 50;

	var rect = {x:stashObjects[playerId].corner.x+10, y:stashObjects[playerId].corner.y, width: pileWidth, height:pileHeight};
	drawRoadStash(canvas, stash.roads, rect, playerId);
	rect.x = rect.x + pileWidth + spaceBetweenPiles;
	drawSettlementStash(canvas, stash.settlements, rect, playerId);
	rect.x = rect.x + pileWidth + spaceBetweenPiles;
	drawCityStash(canvas, stash.cities, rect, playerId);

	//Initialize card area
	stashObjects[playerId].cards = 
		getCardArea(
			canvas, 
			stashObjects[playerId].corner.x, 
			rect.y + pileHeight + spaceBetweenPiles+40, 
			pileWidth, playerId, isLocalPLayer);
	var cards = []; //array should be stash.resources
	for(var i=0;i<cards.length;i++){
		stashObjects[playerId].cards.addResource(cards[i]);
	}
}

function getCardArea(canvas, cornerX, cornerY, cardWidth, playerId, isLocalPlayer){
	var area = {resourceCards:[], shapeGroup:canvas.g()};
	area.developmentCardArea = canvas.rect(cornerX, cornerY + 100, 100, 100);
	area.developmentCardArea.click(function(){
		area.addResource(1);
	})
	area.developmentCardArea.attr({stroke:"blue", fill:"transparent"});

	area.maxRows = isLocalPlayer ? 7 : 1;
	var cardHeight = cardWidth * (4/3);
	coords = {width:cardWidth, height:cardHeight};
	var xJump = cardWidth - 10;
	var yJump = cardHeight + 30;

	area.addResource = function(resource){
		if(area.position.row >= area.maxRows){
			return;
		}
		coords.x = cornerX + (area.position.column-1)*xJump;
		coords.y = cornerY + area.position.row*yJump;
		var resourceShape = getShape(canvas, coords, stashObjectTypes.resource, playerId, isLocalPLayer);
		if(area.position.column % 4 == 0){
			area.position.row++;
			area.position.column = 0;
		}
		area.position.column++;
		resourceShape.resource = resource;
		area.resourceCards.push(resourceShape);
		area.shapeGroup.add(resourceShape);
		area.developmentCardArea.attr({y:coords.y + yJump});
	}
	area.removeResource = function(resource){
		for(var i=area.resourceCards.length-1;i>=0;i--){
			console.log(area.resourceCards[i].resource);
			if(area.resourceCards[i].resource == resource){
				var toRemove = area.resourceCards[i];
				area.resourceCards.splice(i, 1);
				toRemove.remove();
				console.log(area.resourceCards);
				break;
			}
		}
		area.reshuffle();
	}
	area.reshuffle = function (){
		area.reset();
		var resources = area.resourceCards;
		area.resourceCards = [];
		resources.forEach(function(card){
			area.addResource(card.resource);
		});
	}

	area.reset = function (){
		area.position = {row:0, column:1};
		area.developmentCardArea.attr({y:cornerY+100});
		area.shapeGroup.remove();
		area.shapeGroup = canvas.g();
	}

	area.addDevelopmentCard = function(card){
		var box = 
		{	x:area.developmentCardArea.x, 
			y:area.developmentCardArea.y, 
			width:cardWidth, height:cardHeight};
	}

	area.removeDevelopmentCard = function(card){

	}

	area.reset();
	return area;
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

function getShape (canvas, coords, type, playerId, isLocalPlayer){
	if(type == stashObjectTypes.road){ //replace with clean method in roads.js
		var road = canvas.rect(coords.x, coords.y, 10, 50);
		road.attr(getRoadColors(playerId));
		return road;
	}
	if(type === stashObjectTypes.settlement)
		return getSettlementShape(canvas, coords, playerId);
	if(type === stashObjectTypes.city)
		return getCityShape(canvas, coords, playerId);
	if(type === stashObjectTypes.resource){
		return getCardShape(canvas, coords, playerId, isLocalPlayer);
	}
	if(type === stashObjectTypes.card){
		//deal...
	}
}

function getCardShape (canvas, coords, playerId, isLocalPlayer){
	var resource = canvas.rect(coords.x, coords.y, coords.width, coords.height, 10, 10);
	resource.attr({
		stroke: buildingColors[playerId],
		strokeWidth:1,
		fill:"transparent"
	});
	
	resource.attr({
		fill:getHiddenResourceBackgroundPattern(canvas, buildingColors[playerId])
	});
	if(isLocalPlayer){
		resource.hover(function (){
			resource.attr({
				width:coords.width*(3/2),
				height:coords.height*(6/5)
			});
			resource.parentGroup = resource.parent();
			resource.parent().after(resource);
		}, function (){
			resource.attr({
				width:coords.width,
				height:coords.height
			});
			resource.parentGroup.append(resource);
		})
	}
	//TODO: remove this
	resource.click(function(){
		stashObjects[playerId].cards.removeResource(1);
	})
	///////
	return resource;
}

//returns a black/grey backgorund pattern for use on enemy cards
function getHiddenResourceBackgroundPattern(canvas, color){
	var pRect = canvas.rect(0,0,50,50).attr({fill:'#282828'});
	var c1 = canvas.circle(3,4.3,1.8).attr({fill:'#393939'});
	var c2 = canvas.circle(3,3,1.8).attr({fill:'black'});
	var c3 = canvas.circle(10.5,12.5,1.8).attr({fill:'#393939'});	
	var c4 = canvas.circle(10.5,11.3,1.8).attr({fill:'black'});
	return canvas.g(pRect,c1,c2,c3,c4).pattern(0,0,10,10);

}

function addToStash (playerId, type){

}

function getFromStash(playerId, type){

}

