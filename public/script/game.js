
var game = null;
var hexagons = [];
var socket;
var colors = {'field':'#FFE658', 'forest':'#126B32', 'pasture':'#6DD572', 'mountain':'#5E707A', 'hill':'#E03634', 'desert':'#D5CC6A'};

var serverCommands = {canBuildRoad:"canBuildRoad", canBuildCity:"canBuildCity"};
function populateGameWithLogic(game) {
	game.addPlayer = function(playerId) {
		game.players.push(playerId);
	}
}

$ (document).ready(function(){
	var roomUrl = window.location.href.split("/").pop();
	socket = io.connect('http://localhost:5000');
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
	var yMargin = 3.0;
	var xMargin = yMargin / Math.cos(29.918);
	var yJump = hexRadius - yMargin;
	var xJump = hexRadius*4 - xMargin;
	var middle = 350.0;
	var yPadding = 100;
	
	createHexRow(board,1,middle,yPadding,hexRadius, xJump);
	createHexRow(board,2,middle-(xJump/2),yPadding+yJump, hexRadius, xJump);
	createHexRow(board,3,middle-xJump,yPadding+yJump*2, hexRadius, xJump);
	createHexRow(board,2,middle-(xJump/2),yPadding+yJump*3, hexRadius, xJump);
	createHexRow(board,3,middle-xJump,yPadding+yJump*4, hexRadius, xJump);
	createHexRow(board,2,middle-(xJump/2),yPadding+yJump*5, hexRadius, xJump);
	createHexRow(board,3,middle-xJump,yPadding+yJump*6, hexRadius, xJump);
	createHexRow(board,2,middle-(xJump/2),yPadding+yJump*7, hexRadius, xJump);
	createHexRow(board,1,middle,yPadding+yJump*8, hexRadius, xJump);

	var roadWidth = 10-yMargin;
	hexagons.forEach(function(hexagon){
		createRoadsForHex(board, hexagon, roadWidth, hexagons);
	});
	var cityRadius = 10;
	hexagons.forEach(function(hexagon){
		createCitiesForHex(board, hexagon, cityRadius);
	});
	// createCardsForExistingPlayers()
	// createDice()
	// createExtras()
}