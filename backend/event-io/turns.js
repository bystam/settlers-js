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

	socket.on('start-game', startGame (socket, playerId, game));

	socket.on('turn-ended', turnEnded (socket, playerId, game));

	socket.on('draw-resources', drawResources (socket, playerId, game));
}

function startGame (socket, playerId, game) {
	return function () {
		if (!enoughPlayers(game.room))
			return io.sockets.in(game.room).emit('start-game', { enoughPlayers: false } );

		game.queue.startGame ();
		game.players.forEach (function (playerId) {
			game.activeActions[playerId].begin('initial-placement');
		});

		var startData = { currentPlayer: game.queue.getCurrentPlayer() };
		io.sockets.in(game.room).emit('new-turn', startData);
	}
}

function turnEnded (socket, playerId, game) {
	return function () {
		if (!game.rules.endTurnAllowed (playerId))
			return socket.emit('turn-ended', { success: false, error: 'active action chains' });

		if (game.isPrePhase ()) {
			var stash = game.stashes[playerId];
			addInitialResources(playerId, stash, game);
			socket.emit('gain-stash', stash);
			socket.broadcast.to(game.room).emit('gain-hidden-stash', {player:playerId, stash:stash.hiddenify()});
		}

		game.queue.changeTurn();
		var nextTurnData = { currentPlayer: game.queue.getCurrentPlayer() };
		if (!game.isPrePhase ()) {
			game.diceRoll(); // TODO dice === 7 ?
			nextTurnData.dices = game.lastDiceRoll;
		}
		io.sockets.in(game.room).emit('new-turn', nextTurnData);
	};
}

function addInitialResources(playerId, stash, game) {
	if (game.buildingsForPlayer[playerId].length !== 1) // get this 1 from somewhere else?
		throw "Intitial settlement amount is wrong"

	var building = game.buildingsForPlayer[playerId][0];
	building.forEach (function (surroundingHex) {
		var hex = game.board.map[surroundingHex.row][surroundingHex.col];
		if (hex.resource)
			stash.addResource(hex.resource);
	});
}

function drawResources (socket, playerId, game) {
	return function () {
		if (game.isPrePhase ())
			return;
		var diceSum = game.lastDiceRoll.sum();
		var hexesWithDiceSum = game.board.getNonBlockedHexesWithToken (diceSum);

		var resources = {};
		hexesWithDiceSum.forEach (seekHexForResource (playerId, game.board, resources));
		
		var stash = game.stashes[playerId];
		stash.addAll(resources);
		socket.emit('gain-resources', { resources: resources });

		var total = 0;
		for (resource in resources)
			total += resources[resource];
		socket.broadcast.to(game.room).emit('gain-hidden', { player: playerId, resources: { hidden: total } });
	};
}

function enoughPlayers (room) {
	var amountOfPlayers = games[room].players.length;
	return amountOfPlayers > 1 && amountOfPlayers <= 4;
}

function seekHexForResource(playerId, board, resources) {
	return function (hexGeneratingResource) {
		var surroundingBuildings = board.getBuildingsForHex(hexGeneratingResource);

		surroundingBuildings.forEach(function (building) {
			if (building.type === null || building.occupyingPlayerId !== playerId)
				return;

			resources[hexGeneratingResource.resource] = buildingValues[building.type];
		});
	}
}
