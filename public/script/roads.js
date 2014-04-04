var roadLocations = {};
function createRoadsForHex(board, hex, roadWidth, hexagons){
	var corners = getHexCorners(hex);
	var n = hex.neighbours;
	var neighbourList = [n.n, n.nw, n.sw, n.s, n.se, n.ne];
	for(var i=1;i<7;i++){
		var neighbourIndex = neighbourList[i-1];
		var neighbourCorners = getHexCorners(hexagons[neighbourIndex]);
		createRoadShape (board, [hex.boardIndex, hexagons[neighbourIndex].boardIndex], [corners[i], corners[(i%6)+1], neighbourCorners[((i+2)%6)+1], neighbourCorners[((i+3)%6)+1]])
	}
}

function createRoadShape (board, hexes, coords){
	hexes.sort(function(a,b){return a-b}); //ascending
	var roadKey = ""+hexes[0]+","+hexes[1];
	if(roadLocations[roadKey] !== undefined) // prevent doubles
		return;
	var shapePath = createRectangleStringFromArray(coords);
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
		drawBorder(road, color, 2);
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
	road.unhover();
	road.attr({
		stroke:"lightblue",
		strokeWidth:2,
		fill:"blue"
	});
}