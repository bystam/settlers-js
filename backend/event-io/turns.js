/*
	The module that handles I/O events that are related to turn events.

	Turn events are, for example, players clicking "end my turn", dice rolling and so on
	(perhaps even resource giving based on cities?)
*/

var buildingValues = {'settlement': 1, 'city': 2}; // TODO put somewhere else?

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}

exports.registerPlayerForTurns = function(socket, room, playerId) {
	var game = games[room];

	socket.on('turn-ended', turnEnded (socket, playerId, game));

	socket.on('draw-resources', drawResources (socket, playerId, game));

	socket.on('start-game', function(data) {
		if (!gameIsFull(room))
			return io.sockets.in(room).emit('start-game', { enoughPlayers: false } );

		game.players.forEach (function (playerId) {
			game.activeActions[playerId].begin('initial-placement');
		});
	});
}

function turnEnded (socket, playerId, game) {
	return function () {
		if (!game.rules.endTurnAllowed (playerId))
			return socket.emit('turn-ended', { success: false, error: 'active action chains' });

		if(game.queue.currentTurn === 1){
			socket.emit('gain-stash', game.stashes[playerId]);
			socket.broadcast.to(game.room).emit('gain-hidden-stash', game.stashes[playerId].hiddenify());
		}

		game.queue.changeTurn();
		game.diceRoll();
		var nextTurnData = { dices: game.lastDiceRoll,
												 currentPlayer: game.queue.getCurrentPlayer() };
		io.sockets.in(game.room).emit('new-turn', nextTurnData);
	};
}

function drawResources (socket, playerId, game) {
	return function () {
		var diceSum = game.lastDiceRoll.sum();
		var hexesWithDiceSum = game.board.getNonBlockedHexesWithToken (diceSum);

		var resources = [];
		hexesWithDiceSum.forEach (seekHexForResource (playerId, game.board, resources));
		
		var hidden = [];
		resources.forEach (function (resource) {
			game.stashes[playerId].addResource (resource);
			hidden.push('hidden');
		});

		socket.emit('gain-resources', { resources: resources });
		socket.broadcast.to(game.room).emit('gain-hidden', { player: playerId, hidden: hidden });
	};
}

function gameIsFull (room) {
	return games[room].players.length === 4;
}

function seekHexForResource(playerId, board, resources) {
	return function (hexGeneratingResource) {
		var surroundingBuildings = board.getBuildingsForHex(hexGeneratingResource);

		surroundingBuildings.forEach(function (building) {
			if (building.type === null || building.occupyingPlayerId !== playerId)
				return;

			for (var amount = 0; amount < buildingValues[building.type]; amount++)
				resources.push(hexGeneratingResource.resource);
		});
	}
}
