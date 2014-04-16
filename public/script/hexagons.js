var colors = {'ocean':'transparent', 'field':'#FFE658', 'forest':'#126B32', 'pasture':'#6DD572', 'mountain':'#5E707A', 'hill':'#E03634', 'desert':'#D5CC6A'};
//sepia water: #4a46dc
function createHexShapesFromMap(canvas, map, pixelWidth){
	var gridWidth = map[0].length;
	var hexRadius = ((pixelWidth-400) / gridWidth) / 2;
	//we sort of control road width & height with these
	var yMargin = 2.0;
	var xMargin = yMargin / Math.cos(29.937);
	//////////////
	var yJump = hexRadius - yMargin;
	var xJump = hexRadius*2 - xMargin;

	var xcoord = 250; 
	var ycoord = 0;
	//draw backgrounds for hexes (sand)
	for(var row = 0;row<map.length;row++){
		for(var column=0;column<gridWidth;column++){
			var hexagon = map[row][column];
				if(hexagon !== null && hexagon.type !== 'ocean')
					createHexBackground(canvas, xcoord, ycoord, hexRadius);
			xcoord += xJump;
		}
		xcoord = 250;
		ycoord += yJump;
	}

	var xcoord = 250; 
	var ycoord = 0;
	//draw actual hexes
	for(var row = 0;row<map.length;row++){
		for(var column=0;column<gridWidth;column++){
			var hexagon = map[row][column];
			if(hexagon !== null){
				var color = colors[hexagon.type];
				hexagon.shape = createHexShape(canvas, xcoord, ycoord, color, hexRadius);
				if(hexagon.token !== undefined && hexagon.token !== null)
					drawNumberOnHex (canvas, xcoord+hexRadius, ycoord + hexRadius, hexagon.token.value);
				hexagon.row = row;
				hexagon.column = column;
				// debug corner indices
				// var cornerNo = 0;
				// getHexCorners(hexagon.shape).forEach (function(entry){
				// 	canvas.text(entry.x, entry.y, cornerNo);
				// 	cornerNo++;
				// });
				///////////
			}
			xcoord += xJump;
		}
		xcoord = 250;
		ycoord += yJump;
	}
}

function drawNumberOnHex(canvas, xcoord, ycoord, value){
	var textXOffset = value > 9 ? 14 : 7;
	var text = canvas.text(xcoord-textXOffset, ycoord, ""+value);//game.board.hexes[index].token.value
	text.attr({
		fill: "white", 
		"font-size": 30,
		"font-family":"Comic Sans"
	});
}

function createHexShape (canvas, x, y, color, radius){
	var isOcean = color === colors['ocean'];
	var filter = canvas.filter(Snap.filter.sepia(0.4));
	var border = isOcean ? 0 : 0;
	var hexShape = canvas.hex(radius, a = 0, roundness = 0, originCenter = false, x, y);
	hexShape.attr({
		fill:color,
		strokeWidth: border,
		stroke: "#000",
		filter:filter
	});
	
	return hexShape;
}

function createHexBackground(canvas, x, y, radius){
	var size = 15;
	var hexShapeBackground = canvas.hex(radius+size, a = 0, roundness = 0, originCenter = false, x-size, y-size);
	var backgroundFilter = canvas.filter(Snap.filter.blur(20,20));
	hexShapeBackground.attr({
		fill:"#EDC9AF",
		filter: backgroundFilter
	});
}

function getHexCorners (hex){
	points = [];
	for(var i=0;i<hex.node.animatedPoints.numberOfItems;i++){
		points.push(hex.node.animatedPoints.getItem(i));
	}
	return points;
}

function getNeighbourListForHex (map, hexagon){
	var neighbours = [];
	neighbours.push({column:hexagon.column, row:hexagon.row-2});
	neighbours.push({column:hexagon.column-1, row:hexagon.row-1});
	neighbours.push({column:hexagon.column-1, row:hexagon.row+1});
	neighbours.push({column:hexagon.column, row:hexagon.row+2});
	neighbours.push({column:hexagon.column+1, row:hexagon.row+1});
	neighbours.push({column:hexagon.column+1, row:hexagon.row-1});
	return neighbours;
}