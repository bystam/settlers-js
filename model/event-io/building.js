
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

	socket.on("build-road", function(coords) {
		var buildIsLegal = rules.roadBuildIsLegal(coords, playerId);
		if (game.queue.currentTurn === 1)
			buildIsLegal = rules.initialRoadBuildIsLegal(coords, playerId);
		if (buildIsLegal)
			placeRoad (coords, playerId, game);
		io.sockets.in(room).emit("build-road", {playerId:playerId, coords:coords,
															allowed: buildIsLegal});
	});

	socket.on("build-settlement", function(coords){
		var buildIsLegal = rules.settlementBuildIsLegal(coords, playerId);
		if (game.queue.currentTurn === 1)
			buildIsLegal = rules.initialSettlementBuildIsLegal(coords, playerId);
		if(buildIsLegal)
			placeBuilding(coords, playerId, game);
		io.sockets.in(room).emit("build-settlement", {playerId:playerId, coords: coords,
																									allowed: buildIsLegal});
	});

	socket.on("build-city", function(coords){
		var buildIsLegal = rules.cityBuildIsLegal(coords, playerId);
		if(buildIsLegal)
			placeCity(coords, playerId, game);
		io.sockets.in(room).emit("build-city", {playerId:playerId, coords: coords,
																						allowed: buildIsLegal});
	});
};


function placeRoad(coords, playerId, game){
	var roadLocation = game.board.getRoad(coords);
	roadLocation.occupyingPlayerId = playerId;
	game.roadsForPlayer[playerId].push(roadLocation.key);
}

function placeBuilding(coords, playerId, game){
	var buildingLocation = game.board.getBuilding(coords);
	buildingLocation.type = 'settlement';
	buildingLocation.occupyingPlayerId = playerId;
	game.buildingsForPlayer[playerId].push(buildingLocation.key);
}

function placeCity(coords, playerId, game) {
	var buildingLocation = game.board.getBuilding(coords);
	buildingLocation.type = 'city';
}
