var socket, boardCanvas, game, localPlayerId;

var serverCommands = {
	canBuildRoad:"build-road", canBuildSettlement:"build-settlement", canBuildCity:"build-city",
	endTurn:"turn-ended", newTurn:"new-turn", drawResource:"draw-resources",
	gainResources:"gain-resources", gainHiddenResources:"gain-hidden", stockTrade:'stock-trade'};

function populateGameWithLogic(game) {
	game.addPlayer = function(playerId) {
		game.players.push(playerId);
	}
}

$(document).ready(function(){
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
	socket.on("new-player-joined", function(data){
		game.addPlayer(data.playerId);
		initializeNewPlayer(boardCanvas, data.playerId, data.stash);
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
		initializeNewPlayer(boardCanvas, playerId, game.stashes[playerId]);
	});
	///////////
	createNewTurnButton(socket, boardCanvas, boardWidthInPixels/2);
	setServerResponseHandlers (socket, boardCanvas);
	drawTradePanel(boardCanvas);
	// createDice()
}

function setServerResponseHandlers (socket, canvas){
	socket.on(serverCommands.canBuildRoad, function(data){
		if(data.allowed){
			placeRoadWithAnimation(JSON.stringify(data.coords), data.playerId);
			removeResources(data.cost, data.playerId);
		}
	});
	socket.on(serverCommands.canBuildSettlement, function(data){
		if(data.allowed){
			placeCityWithAnimation(JSON.stringify(data.coords), data.playerId, boardCanvas, false);
			removeResources(data.cost, data.playerId);
		}
	});
	socket.on(serverCommands.canBuildCity, function(data){
		if(data.allowed){
			placeCityWithAnimation(JSON.stringify(data.coords), data.playerId, boardCanvas, true);
			removeResources(data.cost, data.playerId);
		}
	});
	socket.on(serverCommands.newTurn, function(data){
		displayNewTurn(canvas, data.dices, data.currentPlayer);
		socket.emit(serverCommands.drawResource, {}); //maybe save this call for after dices are rolled
	});
	socket.on(serverCommands.gainResources, function(data){
		addResources(data.resources, localPlayerId);
	});
	socket.on(serverCommands.gainHiddenResources, function(data){
		addResources(data.hidden, data.player);
	});
	socket.on(serverCommands.stockTrade, function(data){
		console.log(data);
		if(!data.success)
			return;
		removeResources(data.cost, localPlayerId);
		addResources(data.gained, localPlayerId);
	});
}


