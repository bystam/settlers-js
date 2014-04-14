
/*
	The module that handles I/O events that are related to the building of
	roads, settlements and cities
*/

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}

exports.setupBuildingEvents = function(socket, room, playerId){
	var game = games[room];
	var rules = game.rules;

	socket.on("buildRoad", function(coords){
		var buildIsLegal = rules.roadBuildIsLegal(coords, playerId);
		if (buildIsLegal)
			placeRoad (coords, playerId, game);
		io.sockets.in(room).emit("buildRoad", {playerId:playerId, coords:coords,
															allowed:buildIsLegal});
	});

	socket.on("buildSettlement", function(coords){
		var build = rules.settlementBuildIsLegal(coords, playerId);
		if(build.legal)
			placeBuilding(coords, playerId, game)
		io.sockets.in(room).emit("buildSettlement", {playerId:playerId, coords:coords,
															allowed:build.legal, isCity:build.city});
	});
}


function placeRoad(coords, playerId, game){
	var roadLocation = game.board.getRoad(coords);
	roadLocation.occupyingPlayerId = playerId;
	game.roadsForPlayer[playerId].push(roadLocation.key);
}

function placeBuilding(coords, playerId, game){
	var buildingLocation = game.board.getBuilding(coords);
	if (buildingLocation.type === 'settlement')
		return buildingLocation.type = 'city'
	buildingLocation.type = 'settlement';
	buildingLocation.occupyingPlayerId = playerId;
	game.buildingsForPlayer[playerId].push(buildingLocation.key);
}
