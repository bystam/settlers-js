var roadLocations = {};
function createRoadShapesFromMap (map){
	for(var row = 0;row<map.length;row++){
		for(var column=0;column<map[0].length;column++){
			var hexagon = map[row][column];
			if(hexagon !== null && hexagon.type !== 'ocean')
				createRoadShapesForHex (map, hexagon);
		}
	}
}

function createRoadShapesForHex(map, hexagon){
	var corners = getHexCorners(hexagon.shape);
	var neighbourList = getNeighbourListForHex(map, hexagon);
	for(var i=0;i<6;i++){
		var neighbour = neighbourList[i];
		var roadCoords = getRoadCoords(hexagon, map[neighbour.row][neighbour.column], corners[i+1], corners[(i+2)%6]);
		createRoadShape([neighbour, hexagon], roadCoords);
	}
}

function getRoadCoords (from, to, firstCorner, secondCorner){
	var toCorners = getHexCorners (to.shape);
	var toFirst = getCornerClosestTo(firstCorner, toCorners);
	var toSecond = getCornerClosestTo(secondCorner, toCorners);
	return [firstCorner, toFirst, toSecond, secondCorner];
}

function createRoadShape (hexes, coords){
	hexes.sort(function(a,b){	//ascending
		if(a.row === b.row)
			return a.column - b.column;
		return a.row - b.row;
	});
	var roadCoord = [{row: hexes[0].row, col: hexes[0].column},
									 {row: hexes[1].row, col: hexes[1].column}];
	var roadKey = JSON.stringify(roadCoord);
	if(roadLocations[roadKey] !== undefined) // prevent doubles
		return;
	var shapePath = createRectangleStringFromArray(coords);
	var road = canvas.path(shapePath);
	road.attr({
		fill:"transparent"
	});
	roadLocations[roadKey] = road;

	road.click(function(){
		socket.emit(serverCommands.canBuildRoad, roadCoord);
	});

	road.hover(function(){
		//Do client-side check here, only validate when actually clicking
		drawBorder(road, buildingColors[localPlayerId], 2);
	}, function(){
		// hover out
		road.attr({
			stroke:"transparent"
		});
	})
}

function createRectangleStringFromArray(coords){
	return "M"+coords[0].x+","+coords[0].y+"L"+coords[1].x+","+coords[1].y+"L"+coords[2].x+","+coords[2].y+"L"+coords[3].x+","+coords[3].y+"L"+coords[0].x+","+coords[0].y;
}

function canPlaceRoad(key){
	if(Math.random() > 0.5)
		return true;
	return false;}

function getRoadColors (playerId){
	var majorColor = buildingColors[playerId];
	var minorColor = tinycolor.complement(majorColor);//tinycolor.lighten(majorColor, amount = 10);
	return {stroke:'black', strokeWidth:1,fill:majorColor}
}
//skip animation until I figure this out...
function placeRoadWithAnimation (coords, playerId){
	var road = roadLocations[coords];
	var stashRoad = stashObjects[playerId].roads.shift();
	placeRoad(coords, playerId);
	stashRoad.remove();
}

function getPositionOfRoadShape (road){
	var roadXY = road.attr("d").split("L")[0];
	roadXY = roadXY.substr(1, roadXY.length).split(",");
	return {x:parseFloat(roadXY[0]), y:parseFloat(roadXY[1])};
}

function placeRoad (coords, playerId){
	var road = roadLocations[coords];
	road.unclick(null);
	road.unhover();
	road.attr(getRoadColors(playerId));
}
