
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

/*
	Hela det här monstruösa if-grejset borde kunna flyttas till ruleset/boards
	på något sätt. Set exemplet i ruleset.js
*/
exports.setupBuildingEvents = function(socket, room, playerId){
	var game = games[room];
	var rules = game.rules;
	
	socket.on("buildRoad", function(coords){
		var buildIsLegal = rules.roadBuildIsLegal(coords, playerId);
		if (buildIsLegal)
			placeRoad (coords, playerId);
		io.sockets.in(room).emit("buildRoad", {playerId:playerId, coords:coords, allowed:buildIsLegal});
	});

	socket.on("buildSettlement", function(coords){
		var build = rules.settlementBuildIsLegal(coords, playerId);
		if(build.legal)
			placeSettlement(coords, playerId)
		io.sockets.in(room).emit("buildSettlement", {playerId:playerId, coords:coords, allowed:build.legal, isCity:build.city});
	});
}


function placeRoad(coords, playerId){
	// TODO should be in board? or maybe not
}

function placeSettlement(coords, playerId){

}