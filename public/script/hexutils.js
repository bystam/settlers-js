function setNeighboursOfHex (hex){
	hex.neighbours= {};
	var index = hex.boardIndex;
	var top = -5;
	var bottom = 5;
	var topLeft = -3;
	var bottomLeft = 2;
	var topRight = -2;
	var bottomRight = 3;

	if(index === 0){
		bottom--;
		bottomLeft--;
		bottomRight--;
	}
	if(index === 1)
		topRight++;
	if(index === 2)
		topLeft++;
	if(index === 4)
		top++;
	if(index === 18){
		topLeft++;
		top++;
		topRight++;
	}
	if(index === 16)
		bottomRight--;
	if(index === 14)
		bottom--;
	if(index === 17)
		bottomLeft--;

	var topLess = [0,1,2,3,5];
	var topLeftLess = [0,1,3,8,13];
	var topRightLess = [0,2,5,10,15];
	var bottomLess = [13,15,16,17,18];
	var bottomLeftLess = [3,8,13,16,18];
	var bottomRightLess = [5,10,15,17,18];

	if(topLess.indexOf(index) === -1)
		hex.neighbours.top = index + top;
	if(topLeftLess.indexOf(index) === -1)
		hex.neighbours.topLeft = index + topLeft;
	if(topRightLess.indexOf(index) === -1)
		hex.neighbours.topRight = index + topRight;
	if(bottomLess.indexOf(index) === -1)
		hex.neighbours.bottom = index + bottom;
	if(bottomLeftLess.indexOf(index) === -1)
		hex.neighbours.bottomLeft = index + bottomLeft;
	if(bottomRightLess.indexOf(index) === -1)
		hex.neighbours.bottomRight = index + bottomRight;
}

/* indices:
top: 1 2 -> 4 5
upward slope: 1 6 -> 3 4
downward slope: 2 3-> 5 6
*/
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

function createRectangleString(a, b, c, d){
	return "M"+a.x+","+a.y+"L"+b.x+","+b.y+"L"+c.x+","+c.y+"L"+d.x+","+d.y+"L"+a.x+","+a.y;
}

function getHexCorners (hex){
	points = [];
	for(var i=0;i<hex.node.animatedPoints.numberOfItems;i++){
		points.push(hex.node.animatedPoints.getItem(i));
	}
	return points;
}