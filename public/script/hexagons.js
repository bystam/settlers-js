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

function createHexRow(board, size, startX, ycoord, hexRadius, xJump){
	for(var i=0;i<size;i++){
		var index = hexagons.length;
		var xcoord = startX+(i*xJump);
		var hexagon = createHex(board, index, xcoord, ycoord, colors[game.board.hexes[index].type], hexRadius);
		if(game.board.hexes[index].token !== null)
			drawNumberOnHex (board, xcoord+hexRadius, ycoord + hexRadius, game.board.hexes[index].token.value);
		// hexagon.neighbours = game.board.hexes[index].neighbours //USE THIS LATER
		setNeighboursOfHex (hexagon);

		// debug corner indices
		var cornerNo = 0;
		getHexCorners(hexagon).forEach (function(entry){
			board.text(entry.x, entry.y, cornerNo);
			cornerNo++;
		});
		// /////////////////
		hexagons.push(hexagon);
	}
}

function drawNumberOnHex(board, xcoord, ycoord, value){
	var textXOffset = value > 9 ? 14 : 7;
	var text = board.text(xcoord-textXOffset, ycoord, ""+value);//game.board.hexes[index].token.value
	text.attr({
		fill: "white", 
		"font-size": 30,
		"font-family":"Comic Sans"
	});
}

function createHex (board, index, x, y, color, radius){
	var r = radius;
	var hex = board.hex(r, a = 0, roundness = 0, originCenter = false, x, y);
	hex.attr({
		fill:color,
		strokeWidth: 2,
		stroke: "#000"
	});
	hex.boardIndex = index;
	return hex;
}

function getHexCorners (hex){
	points = [];
	for(var i=0;i<hex.node.animatedPoints.numberOfItems;i++){
		points.push(hex.node.animatedPoints.getItem(i));
	}
	return points;
}