function setneighboursOfHex (hex){
	hex.neighbours= {};
	var index = hex.boardIndex;
	var n = -5;
	var s = 5;
	var nw = -3;
	var sw = 2;
	var ne = -2;
	var se = 3;

	if(index === 0){
		s--;
		sw--;
		se--;
	}
	if(index === 1)
		ne++;
	if(index === 2)
		nw++;
	if(index === 4)
		n++;
	if(index === 18){
		nw++;
		n++;
		ne++;
	}
	if(index === 16)
		se--;
	if(index === 14)
		s--;
	if(index === 17)
		sw--;

	var nLess = [0,1,2,3,5];
	var nwLess = [0,1,3,8,13];
	var neLess = [0,2,5,10,15];
	var sLess = [13,15,16,17,18];
	var swLess = [3,8,13,16,18];
	var seLess = [5,10,15,17,18];

	if(nLess.indexOf(index) === -1)
		hex.neighbours.n = index + n;
	if(nwLess.indexOf(index) === -1)
		hex.neighbours.nw = index + nw;
	if(neLess.indexOf(index) === -1)
		hex.neighbours.ne = index + ne;
	if(sLess.indexOf(index) === -1)
		hex.neighbours.s = index + s;
	if(swLess.indexOf(index) === -1)
		hex.neighbours.sw = index + sw;
	if(seLess.indexOf(index) === -1)
		hex.neighbours.se = index + se;
}

function createHexRow(board, size, startX, ycoord, hexRadius, xJump){
	for(var i=0;i<size;i++){
		var index = hexagons.length;
		var xcoord = startX+(i*xJump);
		var hexagon = createHex(board, index, xcoord, ycoord, colors[game.board.hexes[index].type], hexRadius);
		if(game.board.hexes[index].token !== null)
			drawNumberOnHex (board, xcoord+hexRadius, ycoord + hexRadius, game.board.hexes[index].token.value);
		// hexagon.neighbours = game.board.hexes[index].neighbours //Use THIS LATER
		setneighboursOfHex (hexagon);

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