
/*
	The module that handles I/O events that are related to the building of
	roads, settlements and cities
*/

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
};

exports.setupBuildingEvents = function(socket, room, playerId){
	var game = games[room];
	var rules = game.rules;

	socket.on('build-road', function(coords) {
		var buildIsLegal = rules.roadBuildIsLegal(coords, playerId);
		var cost = rules.costs.road;
		if (game.queue.currentTurn === 1) {
			buildIsLegal = rules.initialRoadBuildIsLegal(coords, playerId);
			cost = rules.costs.free;
		}

		if (buildIsLegal) {
			placeRoad (coords, playerId, game);
			game.stashes[playerId].payCost (cost);
		}
		io.sockets.in(room).emit('build-road', {playerId:playerId,
																						coords:coords,
																						allowed: buildIsLegal,
																						cost: cost});
	});

	socket.on('build-settlement', function (coords){
		var buildIsLegal = rules.settlementBuildIsLegal(coords, playerId);
		var cost = rules.costs.settlement;
		if (game.queue.currentTurn === 1) {
			buildIsLegal = rules.initialSettlementBuildIsLegal(coords, playerId);
			cost = rules.costs.free;
		}

		if(buildIsLegal) {
			placeSettlement (coords, playerId, game);
			game.stashes[playerId].payCost (cost);
		}
		io.sockets.in(room).emit('build-settlement', {playerId:playerId,
																									coords: coords,
																									allowed: buildIsLegal,
																									cost: cost});
	});

	socket.on('build-city', function(coords){
		var buildIsLegal = rules.cityBuildIsLegal(coords, playerId);
		var cost = rules.costs.city;
		if (game.queue.currentTurn === 1) {
			buildIsLegal = false; // TODO let it be separate rule chain? 
		}

		if(buildIsLegal) {
			placeCity(coords, playerId, game);
			game.stashes[playerId].payCost (cost);
		}
		io.sockets.in(room).emit('build-city', {playerId:playerId,
																						coords: coords,
																						allowed: buildIsLegal,
																						cost: cost});
	});
};

function placeRoad (coords, playerId, game){
	var roadLocation = game.board.getRoad(coords);
	roadLocation.occupyingPlayerId = playerId;
	game.roadsForPlayer[playerId].push(roadLocation.key);
}

function placeSettlement (coords, playerId, game){
	var buildingLocation = game.board.getBuilding(coords);
	buildingLocation.type = 'settlement';
	buildingLocation.occupyingPlayerId = playerId;
	game.buildingsForPlayer[playerId].push(buildingLocation.key);
}

function placeCity (coords, playerId, game) {
	var buildingLocation = game.board.getBuilding(coords);
	buildingLocation.type = 'city';
}
