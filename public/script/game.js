
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
	var hexRadius = 50.0;
	//we want to control road width & height with these
	var yMargin = 6.0;
	var xMargin = yMargin / Math.cos(30);
	var yJump = hexRadius - yMargin;
	var xJump = hexRadius*4 - xMargin;
	var middle = 350.0;
	var yPadding = 100;
	
	createRow(board,1,middle,yPadding,hexRadius, xJump);
	createRow(board,2,middle-(xJump/2),yPadding+yJump, hexRadius, xJump);
	createRow(board,3,middle-xJump,yPadding+yJump*2, hexRadius, xJump);
	createRow(board,2,middle-(xJump/2),yPadding+yJump*3, hexRadius, xJump);
	createRow(board,3,middle-xJump,yPadding+yJump*4, hexRadius, xJump);
	createRow(board,2,middle-(xJump/2),yPadding+yJump*5, hexRadius, xJump);
	createRow(board,3,middle-xJump,yPadding+yJump*6, hexRadius, xJump);
	createRow(board,2,middle-(xJump/2),yPadding+yJump*7, hexRadius, xJump);
	createRow(board,1,middle,yPadding+yJump*8, hexRadius, xJump);

	var roadWidth = yMargin;
	hexagons.forEach(function(hexagon){
		createRoadsForHex(board, hexagon, roadWidth, hexagons);
	});
	// createCityDivs ();
}

function createRow(board, size, startX, ycoord, hexRadius, xJump){
	for(var i=0;i<size;i++){
		var index = hexagons.length;
		var xcoord = startX+(i*xJump);
		var hexagon = createHex(board, index, xcoord, ycoord, colors[game.board.hexes[index].type], hexRadius);
		if(game.board.hexes[index].token !== null)
			drawNumberOnHex (board, xcoord+hexRadius, ycoord + hexRadius, index);//game.board.hexes[index].token.value
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


