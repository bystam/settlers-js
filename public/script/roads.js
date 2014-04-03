var roadLocations = {};
function createRoadsForHex(board, hex, roadWidth, hexagons){
	var corners = getHexCorners(hex);
	

	neighbourcorners = getHexCorners(hexagons[hex.neighbours.n]);
	createRoadShape (board, hex, hexagons[hex.neighbours.n], [corners[1], corners[2], neighbourcorners[4], neighbourcorners[5]]);
	
	neighbourcorners = getHexCorners(hexagons[hex.neighbours.nw]);
	createRoadShape (board, hex, hexagons[hex.neighbours.nw], [corners[2], corners[3], neighbourcorners[5], neighbourcorners[6]]);
	
	neighbourcorners = getHexCorners(hexagons[hex.neighbours.ne]);
	createRoadShape (board, hex, hexagons[hex.neighbours.ne], [corners[1], corners[6], neighbourcorners[4], neighbourcorners[3]]);

	neighbourcorners = getHexCorners(hexagons[hex.neighbours.s]);
	createRoadShape (board, hex, hexagons[hex.neighbours.s], [corners[4], corners[5], neighbourcorners[1], neighbourcorners[2]]);

	neighbourcorners = getHexCorners(hexagons[hex.neighbours.se]);
	createRoadShape (board, hex, hexagons[hex.neighbours.se], [corners[6], corners[5], neighbourcorners[3], neighbourcorners[2]]);

	neighbourcorners = getHexCorners(hexagons[hex.neighbours.sw]);
	createRoadShape (board, hex, hexagons[hex.neighbours.sw], [corners[3], corners[4], neighbourcorners[6], neighbourcorners[1]]);
}

//calculate points for a road without a neighbour
function getCoordsForRoad (corners, roadWidth, facing){
	if(facing === direction.n)
		return [corners[1], corners[2], {x:corners[2].x, y:corners[2].y-roadWidth}, {x:corners[1].x, y:corners[2].y-roadWidth}];
	if(facing === direction.s)
		return [corners[5], corners[4], {x:corners[4].x, y:corners[4].y+roadWidth}, {x:corners[5].x, y:corners[4].y+roadWidth}];
	if(facing === direction.nw)
		return [corners[2], corners[3], {x:corners[3].x-roadWidth, y:corners[3].y-(roadWidth/2)}, {x:corners[2].x-roadWidth, y:corners[2].y-(roadWidth/2)}];
	if(facing === direction.ne)
		return [corners[1], corners[6], {x:corners[6].x+roadWidth, y:corners[6].y-(roadWidth/2)}, {x:corners[1].x+roadWidth, y:corners[1].y-(roadWidth/2)}];
	if(facing === direction.sw)
		return [corners[3], corners[4], {x:corners[4].x-roadWidth, y:corners[4].y+(roadWidth/2)}, {x:corners[3].x-roadWidth, y:corners[3].y+(roadWidth/2)}];
	if(facing === direction.se)
		return [corners[5], corners[6], {x:corners[6].x+roadWidth, y:corners[6].y+(roadWidth/2)}, {x:corners[5].x+roadWidth, y:corners[5].y+(roadWidth/2)}];
}

function createRoadShape (board, hex, neighbour, coords){
	var shapePath = createRectangleStringFromArray(coords);
	var first = hex.boardIndex, second = hex.boardIndex;
	if(neighbour !== null){
		var first = hex.boardIndex < neighbour.boardIndex ? hex.boardIndex : neighbour.boardIndex;
		var second = hex.boardIndex > neighbour.boardIndex ? hex.boardIndex : neighbour.boardIndex;
	}
	var roadKey = ""+first+","+second;

	var road = board.path(shapePath);
	road.attr({
		fill:"transparent"
	});
	roadLocations[roadKey] = road;

	road.click(function(){
		console.log("Road clicked between hex "+roadKey);
		socket.emit(serverCommands.canBuildRoad, roadKey);
	});

	road.hover(function(){
		//Do client-side check here, only validate when actually clicking
		var color = canPlaceRoad(roadKey) ? "green" : "red";
		drawBorder(road, color, 4);
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

function placeRoad (coords, playerId){
	var road = roadLocations[coords];
	//TODO here: map playerIds to colors and set...
	road.hover(function(){
		console.log("hovering in on built road...");
	}, function(){
		console.log("hovering out on built road...");
	})
	road.attr({
		stroke:"lightblue",
		strokeWidth:3,
		fill:"blue"
	});
}