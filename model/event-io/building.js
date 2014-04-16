
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

	socket.on('build-road', buildRoad (socket, playerId, game)});

	socket.on('build-settlement', buildSettlement (socket, playerId, game));

	socket.on('build-city', buildCity (socket, playerId, game));
};

function buildRoad (socket, playerId, game) {
	return function (roadCoords) {
		var buildIsLegal = rules.roadBuildIsLegal(roadCoords, playerId);
		var cost = rules.costs.road;
		if (game.queue.currentTurn === 1) {
			buildIsLegal = rules.initialRoadBuildIsLegal(roadCoords, playerId);
			cost = rules.costs.free;
		}

		if (buildIsLegal) {
			placeRoad (roadCoords, playerId, game);
			game.stashes[playerId].payCost (cost);
		}
		io.sockets.in(room).emit('build-road', {playerId: playerId,
																						coords: roadCoords,
																						allowed: buildIsLegal,
																						cost: cost});
	}
}

function placeRoad (coords, playerId, game){
	var roadLocation = game.board.getRoad(coords);
	roadLocation.occupyingPlayerId = playerId;
	game.roadsForPlayer[playerId].push(roadLocation.key);
}

function buildSettlement (socket, playerId, game) {
	return function (buildingCoords) {
		var buildIsLegal = rules.settlementBuildIsLegal(buildingCoords, playerId);
		var cost = rules.costs.settlement;
		if (game.queue.currentTurn === 1) {
			buildIsLegal = rules.initialSettlementBuildIsLegal(buildingCoords, playerId);
			cost = rules.costs.free;
		}

		if(buildIsLegal) {
			placeSettlement (buildingCoords, playerId, game);
			game.stashes[playerId].payCost (cost);
		}
		io.sockets.in(room).emit('build-settlement', {playerId:playerId,
																									coords: buildingCoords,
																									allowed: buildIsLegal,
																									cost: cost});
	}
}

function placeSettlement (coords, playerId, game){
	var buildingLocation = game.board.getBuilding(coords);
	buildingLocation.type = 'settlement';
	buildingLocation.occupyingPlayerId = playerId;
	game.buildingsForPlayer[playerId].push(buildingLocation.key);
}

function buildCity (socket, playerId, game) {
	return function (buildingCoords) {
		var buildIsLegal = rules.cityBuildIsLegal(buildingCoords, playerId);
		var cost = rules.costs.city;
		if (game.queue.currentTurn === 1) {
			buildIsLegal = false; // TODO let it be separate rule chain? 
		}

		if(buildIsLegal) {
			placeCity(buildingCoords, playerId, game);
			game.stashes[playerId].payCost (cost);
		}
		io.sockets.in(room).emit('build-city', {playerId:playerId,
																						coords: buildingCoords,
																						allowed: buildIsLegal,
																						cost: cost});
	}
}

function placeCity (coords, playerId, game) {
	var buildingLocation = game.board.getBuilding(coords);
	buildingLocation.type = 'city';
}
