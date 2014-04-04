function setneighboursOfHex (hex){
	hex.neighbours= {};
	var index = hex.boardIndex;
	var n = -7;
	var s = 7;
	var nw = -4;
	var sw = 3;
	var ne = -3;
	var se = 4;

	if(index ===4){
		n += 3;
		ne+=1;
		nw+=1;
	}
	if(index === 32){
		s -=3;
		sw -=1;
		se -= 1;
	}
	if(index === 7 || index === 8)
		n+=1;
	if(index === 28 || index === 29)
		s-=1;

	hex.neighbours.n = index + n;
	hex.neighbours.nw = index + nw;
	hex.neighbours.ne = index + ne;
	hex.neighbours.s = index + s;
	hex.neighbours.sw = index + sw;
	hex.neighbours.se = index + se;
}

var colors = {'ocean':'blue', 'field':'#FFE658', 'forest':'#126B32', 'pasture':'#6DD572', 'mountain':'#5E707A', 'hill':'#E03634', 'desert':'#D5CC6A'};
function createHexesFromMap(map, pixelWidth){
	var gridWidth = map[0].length;
	var hexRadius = pixelWidth / gridWidth;
	//we sort of control road width & height with these
	var yMargin = 2.0;
	var xMargin = yMargin / Math.cos(29.918);
	//////////////
	var yJump = hexRadius - yMargin;
	var xJump = hexRadius*2 - xMargin;

	var xcoord = 0; var ycoord = 0;

	for(var row = 0;row<map.length;row++){
		for(var column=0;column<gridWidth;column++){
			var hex = map[row][column];
			var color = colors[hex.type];
			var hexagon = createHex(board, )
			console.log(hex);
			xcoord += xJump;
		}
		ycoord += yJump;
	}
}

var hexagonsIndex = 0;
function createHexRow(board, size, startX, ycoord, hexRadius, xJump, startsWithOcean){
	for(var i=0;i<size;i++){
		var index = hexagons.length;
		var isOcean = true;
		var color = "blue";
		if(!startsWithOcean || (i > 0 && i < size-1)){
			isOcean = false;
			color = colors[game.board.hexes[hexagonsIndex].type];
		}
		var xcoord = startX+(i*xJump);
		var hexagon = createHex(board, index, xcoord, ycoord, color, hexRadius);
		if(!isOcean && game.board.hexes[hexagonsIndex].token !== null)
			drawNumberOnHex (board, xcoord+hexRadius, ycoord + hexRadius, game.board.hexes[hexagonsIndex].token.value);//index
		hexagon.isOcean = isOcean;
		// hexagon.neighbours = game.board.hexes[index].neighbours //Use THIS LATER
		if(!isOcean){
			setneighboursOfHex (hexagon);
			hexagonsIndex++;
		}
		// debug corner indices
		// var cornerNo = 0;
		// getHexCorners(hexagon).forEach (function(entry){
		// 	board.text(entry.x, entry.y, cornerNo);
		// 	cornerNo++;
		// });
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
		strokeWidth: 1,
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