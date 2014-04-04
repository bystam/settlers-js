var game = null;
var hexagons = [];
var socket;

var serverCommands = {canBuildRoad:"buildRoad", canBuildCity:"buildSettlement"};
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
		console.log(game);
		$("body").append("Successfully joined room: "+game.room);
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
	var boardWidthInPixels = board.getBBox().width;
	var hexRadius = 40.0;
	//we sort of control road width & height with these
	var yMargin = 2.0;
	var xMargin = yMargin / Math.cos(29.918);
	// /////////
	var cityRadius = 7;
	//the amount of pixels between hexes in x/y axes
	var yJump = hexRadius - yMargin;
	var xJump = hexRadius*4 - xMargin;
	//defines middle point of board
	var middle = 350.0;
	//defines the amount of empty space on the board above the first hex
	var yPadding = 120;
	var roadWidth = 10-yMargin;
	// createHexesFromMap(game.board.map, boardWidthInPixels);//Make this the <only> method call regarding board construction?
	
	createHexRow(board,1,middle,yPadding,hexRadius, xJump, true);
	createHexRow(board,2,middle-(xJump/2),yPadding+yJump, hexRadius, xJump, true);
	createHexRow(board,3,middle-xJump,yPadding+yJump*2, hexRadius, xJump, true);
	createHexRow(board,4,middle-(xJump +(xJump/2)),yPadding+yJump*3, hexRadius, xJump, true);
	createHexRow(board,3,middle-xJump,yPadding+yJump*4, hexRadius, xJump, false);
	createHexRow(board,4,middle-(xJump+(xJump/2)),yPadding+yJump*5, hexRadius, xJump, true);
	createHexRow(board,3,middle-xJump,yPadding+yJump*6, hexRadius, xJump, false);
	createHexRow(board,4,middle-(xJump+(xJump/2)),yPadding+yJump*7, hexRadius, xJump, true);
	createHexRow(board,3,middle-xJump,yPadding+yJump*8, hexRadius, xJump, false);
	createHexRow(board,4,middle-(xJump+(xJump/2)),yPadding+yJump*9, hexRadius, xJump, true);

	createHexRow(board,3,middle-xJump,yPadding+yJump*10, hexRadius, xJump, true);
	createHexRow(board,2,middle-(xJump/2),yPadding+yJump*11, hexRadius, xJump, true);
	createHexRow(board,1,middle,yPadding+yJump*12, hexRadius, xJump, true);

	
	hexagons.forEach(function(hexagon){
		if(!hexagon.isOcean)
			createRoadsForHex(board, hexagon, roadWidth, hexagons);
	});
	hexagons.forEach(function(hexagon){
		if(!hexagon.isOcean)
			createCitiesForHex(board, hexagon, cityRadius);
	});
	initializePlayerStashes(game, board);
	setServerResponseHandlers (socket);
	// createCardsForExistingPlayers()
	// createDice()
	// createExtras()
}

function setServerResponseHandlers (socket){
	socket.on(serverCommands.canBuildRoad, function(data){
		if(data.allowed)
			placeRoad(data.coords, data.playerId);
	});
	socket.on(serverCommands.canBuildCity, function(data){
		console.log("building city from server");
		console.log(data);
		if(data.allowed)
			placeCity(data.coords, data.playerId);
	});

}