
var game = null;
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

var hexagons = [];
var colors = {'field':'#D5CC6A', 'forest':'#126B32', 'pasture':'#6DD572', 'mountain':'#5E707A', 'hill':'#E03634', 'desert':'#FFE658'};
var hexWidth = 70;
function createEmptyBoard(){
	var board = $(".board");
	var height = "55px";
	var width = "100px";
	var hexHeight = 70;
	var yJump = hexHeight/2 + 3;
	var row1 = createRow(board,1,400,0);
	var row2 = createRow(board,2,400-hexWidth,yJump);
	var row3 = createRow(board,3,400-(hexWidth*2),yJump*2);
	var row4 = createRow(board,2,400-hexWidth,yJump*3);
	var row5 = createRow(board,3,400-(hexWidth*2),yJump*4);
	var row6 = createRow(board,2,400-hexWidth,yJump*5);
	var row7 = createRow(board,3,400-(hexWidth*2),yJump*6);
	var row8 = createRow(board,2,400-hexWidth,yJump*7);
	var row9 = createRow(board,1,400,yJump*8);
}

function createRow(board, size, startX, yCoordinate){
	for(var i=0;i<size;i++){
		var hex = game.hexes[hexagons.length];
		var hexagon = createHexagon(yCoordinate, startX+(i*(hexWidth*2)), colors[hex.type]);
		if(hex.token !== null)
			hexagon.append($('<p>'+hex.token.value+'</p>'));
		board.append(hexagon);
		hexagons.push(hexagon);
	}
}

function createHexagon (top, left, color){
	var hexagon = $("<div></div>");
	hexagon.addClass ("hex");
	hexagon.css("background-color", color);
	hexagon.append($("<div class='corner-1'></div>"));
	hexagon.append($("<div class='corner-2'></div>"));
	hexagon.css("left", left);
	hexagon.css("top", top);
	return hexagon;
}