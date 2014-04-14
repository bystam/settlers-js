var socket, boardCanvas, game, localPlayerId;

var serverCommands = {
	canBuildRoad:"buildRoad", canBuildCity:"buildSettlement", 
	endTurn:"turn-ended", newTurn:"new-turn", drawResource:"draw-resources",
	gainResources:"gain-resources", gainStash:"gain-stash"};

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
		game = gameState.game;
		localPlayerId = gameState.playerId;
		populateGameWithLogic(game);
		console.log(game);
		$("body").append("Successfully joined room: "+game.room);
		createEmptyBoard(game);
	});
	socket.on("room-404", function(data){
		// alert("THIS FUCKING ROOM DOESNT EXIST!!!")
	})
	socket.on("new-player-joined", function(playerId){
		$("body").append("<p>Player joined: "+playerId+"</p>");
		console.log(playerId);
		game.addPlayer(playerId);
		initializeNewPlayer(boardCanvas, playerId, game);
	});
});

function createEmptyBoard(game){
	boardCanvas = Snap("#board");
	var boardWidthInPixels = boardCanvas.attr("width");
	var boardWidthInPixels = parseInt(boardWidthInPixels.substring(0, boardWidthInPixels.length - 2));
	createHexShapesFromMap(boardCanvas, game.board.map, boardWidthInPixels);
	createRoadShapesFromMap(boardCanvas, game.board.map);
	createCityShapesFromMap(boardCanvas, game.board.map);

	//delete later, draw stashes when ending first turn...
	game.players.forEach(function(playerId){
		initializeNewPlayer(boardCanvas, playerId, game);
	});
	///////////
	createNewTurnButton(socket, boardCanvas, boardWidthInPixels/2);
	setServerResponseHandlers (socket);
	// createDice()
}

function setServerResponseHandlers (socket){
	socket.on(serverCommands.canBuildRoad, function(data){
		if(data.allowed)
			placeRoadWithAnimation(JSON.stringify(data.coords), data.playerId);
	});
	socket.on(serverCommands.canBuildCity, function(data){
		if(data.allowed)
			placeCityWithAnimation(JSON.stringify(data.coords), data.playerId, boardCanvas, data.isCity);
	});
	socket.on(serverCommands.newTurn, function(data){
		console.log(data.dices);
		socket.emit(serverCommands.drawResource, {});
	});
	socket.on(serverCommands.gainResources, function(data){
		console.log(data);
		data.resources.forEach(function(resource){
			stashObjects[localPlayerId].resourceCards.addCard(resource);
		});
	});
	socket.on(serverCommands.gainStash, function(data){
		data.stashes.forEach(function(stash){
			initializeNewPlayer(canvas, stash.player, stash);
		});
	});

}

function createNewTurnButton(socket, canvas, middleX){
	var buttonWidth = 100;
	var button = canvas.rect(middleX-(buttonWidth-40), 20, buttonWidth, 50);
	var filter = canvas.filter(Snap.filter.blur(2,2));
	button.attr({
		stroke:'black',
		strokeWidth:4,
		fill:'green',
		filter:filter
	});
	button.click(function(){
		console.log("ending turn...");
		socket.emit(serverCommands.endTurn, {});
	});
}