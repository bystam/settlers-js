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
	var canvas = Snap("#board");
	var boardWidthInPixels = canvas.attr("width");
	var boardWidthInPixels = parseInt(boardWidthInPixels.substring(0, boardWidthInPixels.length - 2));
	createHexShapesFromMap(canvas, game.board.map, boardWidthInPixels);
	createRoadShapesFromMap(canvas, game.board.map);
	createCityShapesFromMap(canvas, game.board.map);
	initializePlayerStashes(game, canvas);
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