function createRoadsForHex(board, hex, roadWidth, hexagons){
	var points = getHexCorners(hex);
	//Create top road 
	var top = hex.neighbours.top;
	if(top === undefined){
		var thirdPoint = {x:points[2].x, y:points[2].y-roadWidth};
		var fourthPoint = {x:points[1].x, y:thirdPoint.y};
		createRoadShape(board, hex, null, createRectangleString(points[1], points[2], thirdPoint, fourthPoint));
	}
	else{
		var neighbourPoints = getHexCorners(hexagons[top]);
		createRoadShape (board, hex, hexagons[top], createRectangleString(points[1], points[2], neighbourPoints[4], neighbourPoints[5]));
	}
	//create bottom road if there's no bottom neighbour
	var bottom = hex.neighbours.bottom;
	if(bottom === undefined){
		var thirdPoint = {x:points[4].x, y:points[4].y+roadWidth};
		var fourthPoint = {x:points[5].x, y:thirdPoint.y};
		createRoadShape(board, hex, null, createRectangleString(points[5], points[4], thirdPoint, fourthPoint));
	}
	// create top left road
	var topLeft = hex.neighbours.topLeft;
	if(topLeft === undefined){
		var thirdPoint = {x:points[3].x-roadWidth, y:points[3].y-(roadWidth/2)};
		var fourthPoint = {x:points[2].x-roadWidth, y:points[2].y-(roadWidth/2)};
		createRoadShape(board, hex, null, createRectangleString(points[2], points[3], thirdPoint, fourthPoint));
	}
	else{
		var neighbourPoints = getHexCorners(hexagons[topLeft]);
		createRoadShape (board, hex, hexagons[topLeft], createRectangleString(points[2], points[3], neighbourPoints[5], neighbourPoints[6]));
	}
	//create top right road
	var topRight = hex.neighbours.topRight;
	if(topRight === undefined){
		var thirdPoint = {x:points[6].x+roadWidth, y:points[6].y-(roadWidth/2)};
		var fourthPoint = {x:points[1].x+roadWidth, y:points[1].y-(roadWidth/2)};
		createRoadShape(board, hex, null, createRectangleString(points[1], points[6], thirdPoint, fourthPoint));
	}
	else{
		var neighbourPoints = getHexCorners(hexagons[topRight]);
		createRoadShape (board, hex, hexagons[topRight], createRectangleString(points[1], points[6], neighbourPoints[4], neighbourPoints[3]));
	}
	//create bottom left road is there's no bottom left neighbour
	var bottomLeft = hex.neighbours.bottomLeft;
	if(bottomLeft === undefined){
		var thirdPoint = {x:points[4].x-roadWidth, y:points[4].y+(roadWidth/2)};
		var fourthPoint = {x:points[3].x-roadWidth, y:points[3].y+(roadWidth/2)};
		createRoadShape(board, hex, null, createRectangleString(points[3], points[4], thirdPoint, fourthPoint));
	}
	//create bottom right road if there's no bottom right neighbour
	var bottomRight = hex.neighbours.bottomRight;
	if(bottomRight === undefined){
		var thirdPoint = {x:points[6].x+roadWidth, y:points[6].y+(roadWidth/2)};
		var fourthPoint = {x:points[5].x+roadWidth, y:points[5].y+(roadWidth/2)};
		createRoadShape(board, hex, null, createRectangleString(points[5], points[6], thirdPoint, fourthPoint));
	}
}

function createRoadShape (board, hex, neighbour, rectangleString){
	var first = hex.boardIndex, second = hex.boardIndex;
	if(neighbour !== null){
		var first = hex.boardIndex < neighbour.boardIndex ? hex.boardIndex : neighbour.boardIndex;
		var second = hex.boardIndex > neighbour.boardIndex ? hex.boardIndex : neighbour.boardIndex;
	}
	var roadKey = ""+first+","+second;

	var road = board.path(rectangleString);
	road.attr({
		fill:"transparent"
	});
	socket.on(serverCommands.canBuildRoad, function(data){
			if(data.type === "click"){
				if(data.allowed)
					placeRoad(road);
			} if(data.type === "hover"){
				if(data.allowed)
					drawBorder(road, "green", 4);
				else
					drawBorder(road, "red", 4);
			}
		});

	road.click(function(){
		console.log("Road clicked between hex "+roadKey);
		socket.emit(serverCommands.canBuildRoad, {key:roadKey, type:"click"});
		//remove when backend is done
		if(canPlaceRoad (roadKey)){
			placeRoad (road);
		} else{
			alert("can't build road there");
		}
		//////////////
	});

	road.hover(function(){
		socket.emit(serverCommands.canBuildRoad, {key:roadKey, type:"hover"})
		//remove when backend is done
		var color = canPlaceRoad(roadKey) ? "green" : "red";
		road.attr({
			stroke:color,
			strokeWidth:4
		});
		/////////////////
	}, function(){
		// hover out
		road.attr({
			stroke:"transparent"
		});
	})
}

function createRectangleString(a, b, c, d){
	return "M"+a.x+","+a.y+"L"+b.x+","+b.y+"L"+c.x+","+c.y+"L"+d.x+","+d.y+"L"+a.x+","+a.y;
}

function canPlaceRoad(key){
	if(Math.random() > 0.5)
		return true;
	return false;}

function placeRoad (road){
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