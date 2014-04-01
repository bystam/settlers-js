
var game = null;
var hexagons = [];
var colors = {'field':'#FFE658', 'forest':'#126B32', 'pasture':'#6DD572', 'mountain':'#5E707A', 'hill':'#E03634', 'desert':'#D5CC6A'};
function populateGameWithLogic(game) {
	game.addPlayer = function(playerId) {
		game.players.push(playerId);
	}
}

$ (document).ready(function(){
	var roomUrl = window.location.href.split("/").pop();
	var socket = io.connect('http://localhost:5000');
	socket.emit("room", {playerId:Math.random(), room:roomUrl})
	socket.on("game-joined", function(gameState){
		populateGameWithLogic(gameState);
		game = gameState;
		$("body").append("Successfully joined room: "+game.room);
		console.log(game);
		createEmptyBoard();
	});
	socket.on("room-404", function(data){
		// alert("THIS FUCKING ROOM DOESNT EXIST!!!")
	})
	socket.on("new-player-joined", function(playerId){
		$("body").append("<p>Player joined: "+playerId+"</p>");
		console.log(playerId);
		game.addPlayer(playerId);
	});
});

function createEmptyBoard(){
	var board = Snap("#board");
	var radius = 50.0;
	var yMargin = 6.0;
	var yJump = radius + yMargin;
	var hexDiameter = radius*2;
	var middle = 350.0;
	var yPadding = 100;
	createRow(board,1,middle,yPadding,radius);
	createRow(board,2,middle-hexDiameter,yPadding+yJump, radius);
	createRow(board,3,middle-(hexDiameter*2),yPadding+yJump*2, radius);
	createRow(board,2,middle-hexDiameter,yPadding+yJump*3, radius);
	createRow(board,3,middle-(hexDiameter*2),yPadding+yJump*4, radius);
	createRow(board,2,middle-hexDiameter,yPadding+yJump*5, radius);
	createRow(board,3,middle-(hexDiameter*2),yPadding+yJump*6, radius);
	createRow(board,2,middle-hexDiameter,yPadding+yJump*7, radius);
	createRow(board,1,middle,yPadding+yJump*8, radius);

	createRoads (board, (yMargin*4)+1);
	// createCityDivs ();*/
}

function createRow(board, size, startX, ycoord, hexRadius){
	for(var i=0;i<size;i++){
		var index = hexagons.length;
		var xcoord = startX+(i*(hexRadius*4));
		var hexagon = createHex(board, index, xcoord, ycoord, colors[game.board.hexes[index].type], hexRadius);
		var fontSize = 30;
		if(game.board.hexes[index].token !== null){
			var textXOffset = game.board.hexes[index].token.value > 9 ? 14 : 7;
			var text = board.text(xcoord+hexRadius-textXOffset, ycoord + hexRadius, ""+index);//game.board.hexes[index].token.value
			text.attr({
				fill: "white", 
				"font-size": fontSize,
				"font-family":"Comic Sans"
			});
		}
		setNeighboursOfHex (hexagon);
		hexagon.click(function(){
			clickHex(this);
		})

		var cornerNo = 0;
		getHexCorners(hexagon).forEach (function(entry){
			board.text(entry.x, entry.y, cornerNo);
			cornerNo++;
		});

		hexagons.push(hexagon);
	}
}

function getHexCorners (hex){
	points = [];
	for(var i=0;i<hex.node.animatedPoints.numberOfItems;i++){
		points.push(hex.node.animatedPoints.getItem(i));
	}
	return points;
}

function clickHex (hex){
	console.log(hex.node.animatedPoints);
	hex.paper.text(3,4, "BALLE");
}

function createHex (board, index, x, y, color, radius){
	var r = radius;
	var hex = board.hex(r, a = 0, roundness = 0, originCenter = false, x, y);
	hex.attr({
		fill:color
	});
	hex.boardIndex = index;
	return hex;
}

function createRoads (board, roadWidth){
	hexagons.forEach(function(hexagon){
		createRoadsForHex(board, hexagon, roadWidth);
	});
}
/* indices:
top: 1 2 -> 4 5
upward slope: 1 6 -> 3 4
downward slope: 2 3-> 5 6
*/
function createRoadsForHex(board, hex, roadWidth){
	var points = getHexCorners(hex);
	var top = hex.neighbours.top;
	if(top === undefined){
		var thirdPoint = {x:points[2].x, y:points[2].y-roadWidth};
		var fourthPoint = {x:points[1].x, y:thirdPoint.y};
		createSingleRoad(board, hex, createRectangleString(points[1], points[2], thirdPoint, fourthPoint));
	}
	else{
		var neighbourPoints = getHexCorners(hexagons[top]);
		createSingleRoad (board, hex, createRectangleString(points[1], points[2], neighbourPoints[4], neighbourPoints[5]));
	}
	var bottom = hex.neighbours.bottom;
	if(bottom === undefined){
		var thirdPoint = {x:points[4].x, y:points[4].y+roadWidth};
		var fourthPoint = {x:points[5].x, y:thirdPoint.y};
		createSingleRoad(board, hex, createRectangleString(points[5], points[4], thirdPoint, fourthPoint));
	}
	var topLeft = hex.neighbours.topLeft;
	if(topLeft === undefined){
		var thirdPoint = {x:points[3].x-roadWidth, y:points[3].y-(roadWidth/2)};
		var fourthPoint = {x:points[2].x-roadWidth, y:points[2].y-(roadWidth/2)};
		createSingleRoad(board, hex, createRectangleString(points[2], points[3], thirdPoint, fourthPoint));
	}
	else{
		var neighbourPoints = getHexCorners(hexagons[topLeft]);
		createSingleRoad (board, hex, createRectangleString(points[2], points[3], neighbourPoints[5], neighbourPoints[6]));
	}
}

function createSingleRoad (board, hex, rectangleString){
	var road = board.path(rectangleString);
	road.attr({
		fill:"blue"
	});

}

function createRoadBetweenHexes (board,hex,neighbour){

}

function createRectangleString(a, b, c, d){
	return "M"+a.x+","+a.y+"L"+b.x+","+b.y+"L"+c.x+","+c.y+"L"+d.x+","+d.y+"L"+a.x+","+a.y;
}


