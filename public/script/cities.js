function createCitiesForHex(board, hex, roadWidth, hexagons){
	var points = getHexCorners(hex);

	if(hex.neighbours.n === undefined){
		var thirdPoint = {x:points[2].x, y:points[2].y-roadWidth};
		var fourthPoint = {x:points[1].x, y:thirdPoint.y};
		createRoadShape(board, hex, null, createRectangleString(points[1], points[2], thirdPoint, fourthPoint));
	}
	else{
		var neighbourPoints = getHexCorners(hexagons[hex.neighbours.n]);
		createRoadShape (board, hex, hexagons[hex.neighbours.n], createRectangleString(points[1], points[2], neighbourPoints[4], neighbourPoints[5]));
	}
	if(hex.neighbours.s === undefined){
		var thirdPoint = {x:points[4].x, y:points[4].y+roadWidth};
		var fourthPoint = {x:points[5].x, y:thirdPoint.y};
		createRoadShape(board, hex, null, createRectangleString(points[5], points[4], thirdPoint, fourthPoint));
	}
	if(hex.neighbours.nw === undefined){
		var thirdPoint = {x:points[3].x-roadWidth, y:points[3].y-(roadWidth/2)};
		var fourthPoint = {x:points[2].x-roadWidth, y:points[2].y-(roadWidth/2)};
		createRoadShape(board, hex, null, createRectangleString(points[2], points[3], thirdPoint, fourthPoint));
	}
	else{
		var neighbourPoints = getHexCorners(hexagons[hex.neighbours.nw]);
		createRoadShape (board, hex, hexagons[hex.neighbours.nw], createRectangleString(points[2], points[3], neighbourPoints[5], neighbourPoints[6]));
	}
	if(hex.neighbours.ne === undefined){
		var thirdPoint = {x:points[6].x+roadWidth, y:points[6].y-(roadWidth/2)};
		var fourthPoint = {x:points[1].x+roadWidth, y:points[1].y-(roadWidth/2)};
		createRoadShape(board, hex, null, createRectangleString(points[1], points[6], thirdPoint, fourthPoint));
	}
	else{
		var neighbourPoints = getHexCorners(hexagons[hex.neighbours.ne]);
		createRoadShape (board, hex, hexagons[hex.neighbours.ne], createRectangleString(points[1], points[6], neighbourPoints[4], neighbourPoints[3]));
	}

	if(hex.neighbours.sw === undefined){
		var thirdPoint = {x:points[4].x-roadWidth, y:points[4].y+(roadWidth/2)};
		var fourthPoint = {x:points[3].x-roadWidth, y:points[3].y+(roadWidth/2)};
		createRoadShape(board, hex, null, createRectangleString(points[3], points[4], thirdPoint, fourthPoint));
	}

	if(hex.neighbours.se === undefined){
		var thirdPoint = {x:points[6].x+roadWidth, y:points[6].y+(roadWidth/2)};
		var fourthPoint = {x:points[5].x+roadWidth, y:points[5].y+(roadWidth/2)};
		createRoadShape(board, hex, null, createRectangleString(points[5], points[6], thirdPoint, fourthPoint));
	}
}