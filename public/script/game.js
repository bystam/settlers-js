
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
	var middle = 400.0;
	createRow(board,1,middle,0,radius);
	createRow(board,2,middle-hexDiameter,yJump, radius);
	createRow(board,3,middle-(hexDiameter*2),yJump*2, radius);
	createRow(board,2,middle-hexDiameter,yJump*3, radius);
	createRow(board,3,middle-(hexDiameter*2),yJump*4, radius);
	createRow(board,2,middle-hexDiameter,yJump*5, radius);
	createRow(board,3,middle-(hexDiameter*2),yJump*6, radius);
	createRow(board,2,middle-hexDiameter,yJump*7, radius);
	createRow(board,1,middle,yJump*8, radius);

	// createRoadDivs (board);
	// createCityDivs ();*/
}

function createRow(board, size, startX, yCoordinate, hexRadius){
	for(var i=0;i<size;i++){
		var index = hexagons.length;
		var hex = game.hexes[index];
		var xcoord = startX+(i*(hexRadius*4));
		var hexagon = createHex(board, index, yCoordinate, xcoord, colors[hex.type], hexRadius);
		// if(hex.token !== null)
			// hexagon.append($('<p>'+index+'</p>')); //index should be hex.token.value
		// board.append(hexagon);
		hexagons.push(hexagon);
	}
}

function createHex (board, index, y, x, color, radius){
	var r = radius;
	var hex = board.hex(r, a = 0, roundness = 0, originCenter = false, x, y);
	hex.attr({
		fill:color
	});
	return hex;
}


