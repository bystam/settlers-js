/*
	The module that handles I/O events that are related to turn events.

	Turn events are, for example, players clicking "end my turn", dice rolling and so on
	(perhaps even resource giving based on cities?)
*/

var buildingValues = {'settlement': 1, 'city': 2};

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}

exports.registerPlayerForTurns = function(socket, room, playerId) {
	var game = games[room];

	socket.on('turn-ended', function(data) {
		game.lastDiceRoll = diceRoll();
		game.queue.changeTurn();
		var currentPlayer = { currentPlayer: game.queue.getCurrentPlayer() };
		io.sockets.in(room).emit('new-turn', currentPlayer);
	});

	socket.on('draw-resources', function(data) {
		var diceSum = game.lastDiceRoll.sum();
		var hexesWithDiceSum = game.board.getHexesWithToken(diceSum);
		var resources = [];
		hexesWithDiceSum.forEach (seekHexForResource (playerId));

		socket.emit('gain-resources', { resources: resources });
	});

	socket.on('start-game', function(data) {
		if (!gameIsFull(room))
			return io.sockets.in(room).emit('need-more-players', {} );
		io.sockets.in(room).emit(game.stashes);
	});
}

function gameIsFull (room) {
	return games[room].players.length === 4;
}

function diceRoll () {
	var dices = {};
	dices.first = Math.floor(Math.random() * 6) + 1;
	dices.second = Math.floor(Math.random() * 6) + 1;
	dices.sum = function () { return this.first + this.second };
	return dices;
}

function seekHexForResource(playerId, resources) {
	return function (hexGeneratingResource) {
		var surroundingBuildings = board.getBuildingForHex(hexGeneratingResource);

		surroundingBuildings.forEach(function (building) {
			if (building.type === null || building.occupyingPlayerId !== playerId)
				return;

			for (var amount = 0; amount < buildingValues[building.type]; amount++)
				resources.push(hexGeneratingResource.resource);
		});
	}
}
