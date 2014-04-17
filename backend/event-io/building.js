
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

	socket.on('build-road', function (roadCoords) {
		var roadBuildResult = handleRoadBuilding (roadCoords, playerId, game);
		io.sockets.in(room).emit('build-road', roadBuildResult);
	});

	socket.on('build-settlement', function (buildingCoords) {
		var settlementBuildResult = handleSettlementBuilding (buildingCoords, playerId, game);
		io.sockets.in(room).emit('build-settlement', settlementBuildResult);
	});

	socket.on('build-city', function (buildingCoords) {
		var cityBuildResult = handleCityBuilding (buildingCoords, playerId, game);
		io.sockets.in(room).emit('build-city', cityBuildResult);
	});
};

function handleRoadBuilding (roadCoords, playerId, game) {
	var rules = game.rules;
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
	return {playerId: playerId, coords: roadCoords,
					allowed: buildIsLegal, cost: cost};
}

function placeRoad (coords, playerId, game){
	var roadLocation = game.board.getRoad(coords);
	roadLocation.occupyingPlayerId = playerId;
	game.roadsForPlayer[playerId].push(roadLocation.key);
}

function handleSettlementBuilding (buildingCoords, playerId, game) {
	var rules = game.rules;
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
	return {playerId:playerId, coords: buildingCoords,
					allowed: buildIsLegal, cost: cost};
}

function placeSettlement (coords, playerId, game){
	var buildingLocation = game.board.getBuilding(coords);
	buildingLocation.type = 'settlement';
	buildingLocation.occupyingPlayerId = playerId;
	game.buildingsForPlayer[playerId].push(buildingLocation.key);
}

function handleCityBuilding (buildingCoords, playerId, game) {
	var rules = game.rules;
	var buildIsLegal = rules.cityBuildIsLegal(buildingCoords, playerId);
	var cost = rules.costs.city;
	if (game.queue.currentTurn === 1) {
		buildIsLegal = false; // TODO let it be separate rule chain? 
	}

	if(buildIsLegal) {
		placeCity(buildingCoords, playerId, game);
		game.stashes[playerId].payCost (cost);
	}
	return {playerId:playerId, coords: buildingCoords,
					allowed: buildIsLegal, cost: cost};
}

function placeCity (coords, playerId, game) {
	var buildingLocation = game.board.getBuilding(coords);
	buildingLocation.type = 'city';
}
