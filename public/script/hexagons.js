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

var hexagonsIndex = 0;
function createHexRow(board, size, startX, ycoord, hexRadius, xJump, startsWithOcean){
	for(var i=0;i<size;i++){
		var index = hexagons.length;
		var isOcean = true;
		var color = "blue";
		if(!startsWithOcean || (i > 0 && i < size-1)){
			console.log("not ocean cause i="+i+ "and size="+size);
			isOcean = false;
			color = colors[game.board.hexes[hexagonsIndex].type];
		}
		var xcoord = startX+(i*xJump);
		var hexagon = createHex(board, index, xcoord, ycoord, color, hexRadius);
		// if(game.board.hexes[hexagonsIndex].token !== null)
			drawNumberOnHex (board, xcoord+hexRadius, ycoord + hexRadius, index);//game.board.hexes[hexagonsIndex].token.value);
		hexagon.isOcean = isOcean;
		// hexagon.neighbours = game.board.hexes[index].neighbours //Use THIS LATER
		if(!isOcean)
			setneighboursOfHex (hexagon);
		if(!isOcean)
			hexagonsIndex++;
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