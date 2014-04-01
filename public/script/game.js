
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

function clickHex (hex){
	console.log(hex.node.animatedPoints);
	hex.paper.text(3,4, "BALLE");
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
	road.click(function(){
		console.log("Road clicked between hex "+roadKey);
	});
	road.hover(function(){
		// hover in
		road.attr({
			stroke:"green",
			strokeWidth:3
		});
	}, function(){
		// hover out
		road.attr({
			stroke:"transparent"
		});
	})
}

function getExamplePattern(board, player){
	if(player === null){
		var patternPath = board.path("M28,66L0,50L0,16L28,0L56,16L56,50L28,66L28,100");
		patternPath.attr({
			stroke:"#fff629",
			strokeWidth:2,
			fill:"none"
		});
		var patternPath2 = board.path("M28,0L28,34L0,50L0,84L28,100L56,84L56,50L28,34");
		patternPath2.attr({
			stroke:"#ffe503",
			strokeWidth:2,
			fill:"none"
		});
		var patternGroup = board.g(patternPath, patternPath2);
		var pattern = patternGroup.pattern(0,0,56, 100);
		return pattern;
	}
}

function createRoads (board, roadWidth){
	hexagons.forEach(function(hexagon){
		createRoadsForHex(board, hexagon, roadWidth, hexagons);
	});
}



