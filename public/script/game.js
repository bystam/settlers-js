var socket, boardCanvas, game;

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
		console.log(gameState);
		$("body").append("Successfully joined room: "+gameState.room);
		createEmptyBoard(gameState);
	});
	socket.on("room-404", function(data){
		// alert("THIS FUCKING ROOM DOESNT EXIST!!!")
	})
	socket.on("new-player-joined", function(playerId){
		$("body").append("<p>Player joined: "+playerId+"</p>");
		console.log(playerId);
		game.addPlayer(playerId);
		initializeNewPlayer(boardCanvas, playerId);
	});
});

function createEmptyBoard(game){
	boardCanvas = Snap("#board");
	var boardWidthInPixels = boardCanvas.attr("width");
	var boardWidthInPixels = parseInt(boardWidthInPixels.substring(0, boardWidthInPixels.length - 2));
	createHexShapesFromMap(boardCanvas, game.board.map, boardWidthInPixels);
	createRoadShapesFromMap(boardCanvas, game.board.map);
	createCityShapesFromMap(boardCanvas, game.board.map);

	game.players.forEach(function(playerId){
		initializeNewPlayer(boardCanvas, playerId);
	});

	setServerResponseHandlers (socket);
	// createDice()
}

function setServerResponseHandlers (socket){
	socket.on(serverCommands.canBuildRoad, function(data){
		if(data.allowed)
			placeRoad(data.coords, data.playerId);
	});
	socket.on(serverCommands.canBuildCity, function(data){
		if(data.allowed)
			placeCityWithAnimation(data.coords, data.playerId, boardCanvas);
	});

}