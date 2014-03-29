
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
	var board = $(".board");
	var hexDiameter = 105; //must find a way to find this dynamically if we want responsive
	var yMargin = 6;
	var yJump = hexDiameter/2 + yMargin;
	createRow(board,1,400,0);
	createRow(board,2,400-hexDiameter,yJump);
	createRow(board,3,400-(hexDiameter*2),yJump*2);
	createRow(board,2,400-hexDiameter,yJump*3);
	createRow(board,3,400-(hexDiameter*2),yJump*4);
	createRow(board,2,400-hexDiameter,yJump*5);
	createRow(board,3,400-(hexDiameter*2),yJump*6);
	createRow(board,2,400-hexDiameter,yJump*7);
	createRow(board,1,400,yJump*8);
}

function createRow(board, size, startX, yCoordinate){
	for(var i=0;i<size;i++){
		var hex = game.hexes[hexagons.length];
		var hexagon = createHexagon(yCoordinate, startX+(i*(hexDiameter*2)), colors[hex.type]);
		if(hex.token !== null)
			hexagon.append($('<p>'+hex.token.value+'</p>'));
		board.append(hexagon);
		hexagons.push(hexagon);
	}
}

function createHexagon (y, x, background){
	var hexagon = $("<div></div>");
	hexagon.addClass ("hex");
	hexagon.css("background-color", background);
	hexagon.append($("<div class='corner-1'></div>"));
	hexagon.append($("<div class='corner-2'></div>"));
	hexagon.css("left", x);
	hexagon.css("top", y);
	return hexagon;
}



