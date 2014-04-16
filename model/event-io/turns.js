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
		if (game.queue.getCurrentPlayer() !== playerId)
			return;
		if(game.queue.currentTurn === 1){
			socket.emit('gain-stash', game.stashes[playerId]);
			socket.broadcast.to(room).emit('gain-hidden-stash', game.stashes[playerId].hiddenify());
		}

		game.lastDiceRoll = diceRoll();
		game.queue.changeTurn();
		var nextTurnData = { dices: game.lastDiceRoll,
												 currentPlayer: game.queue.getCurrentPlayer() };
		io.sockets.in(room).emit('new-turn', nextTurnData);
	});

	socket.on('draw-resources', function(data) {
		var diceSum = game.lastDiceRoll.sum();
		var hexesWithDiceSum = game.board.getHexesWithToken(diceSum);

		var resources = [];
		hexesWithDiceSum.forEach (seekHexForResource (playerId, game.board, resources));
		
		var hidden = [];
		resources.forEach (function (resource) {
			game.stashes[playerId].addResource (resource);
			hidden.push('hidden');
		});

		socket.emit('gain-resources', { resources: resources });
		socket.broadcast.to(room).emit('gain-hidden', { player: playerId, hidden: hidden });
	});

	socket.on('start-game', function(data) {
		if (!gameIsFull(room))
			return io.sockets.in(room).emit('need-more-players', {} );
		
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
