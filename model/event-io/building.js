
/*
	The module that handles I/O events that are related to the building of
	roads, settlements and cities
*/


var costs = {road:[0,0,0,0,0], town:[0,0,0,0,0], city:[0,0,0,0,0], developmentCard:[0,0,0,0,0]}
var buildingTypes = {road:"road", settlement:"settlements", city:"city"};

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
		var buildingOk = false;
		if(rules.hasInStash(game, playerId, buildingTypes.road)){
			if(!rules.roadExists(game,coords)){
				if(rules.isFirstRound(game, playerId)){
					buildingOk = true;
				} else if(rules.isStartupPhase(game, playerId)){
					if(rules.hasConnecting(game,playerId, coords, buildingTypes.road) || 
						hasConnecting(game, playerId, coords, buildingTypes.settlement))
						buildingOk = true;
				} else if(rules.hasConnecting(game, playerId, coords, buildingTypes.road)){
					if(rules.hasResources(game, costs.road, playerId))
						buildingOk = true;
					else if(rules.hasFreeRoads(game, playerId))
						buildingOk = true;
				}
			}
		}
		if(buildingOk)
			placeRoad (coords, playerId);
		io.sockets.in(room).emit("buildRoad", {playerId:playerId, coords:coords, allowed:buildingOk});
	});

	socket.on("buildSettlement", function(coords){
		var buildingOk = false;
		if(!rules.settlementExists(game, coords)){
			if(rules.hasInStash(game, playerId, buildingTypes.settlement)){
				if(!rules.settlementInProximity(game, coords)){
					if(rules.isFirstRound(game, playerId))
						buildingOk = true;
					else if(rules.isStartupPhase(game, playerId)){
						if(rules.hasConnecting(game, playerId, coords, buildingTypes.road))
							buildingOk = true;
					} else if(rules.hasConnecting(game, playerId, coords, buildingTypes.road)){
						if(rules.hasResources(game, costs.settlement, playerId))
							buildingOk = true;
					}
				}
			}
		} else if(rules.settlementIsOwnedByPlayer(game, coords, playerId)){
			if(rules.hasInStash(game, playerId, buildingTypes.city)){
				if(rules.hasResources(game, costs.city, playerId))
					buildingOk = true;
			}
		}
		console.log("city allowed: "+buildingOk);
		if(buildingOk)
			placeSettlement(coords, playerId)
		io.sockets.in(room).emit("buildSettlement", {playerId:playerId, coords:coords, allowed:buildingOk});
	});
}


function placeRoad(coords, playerId){
	// TODO should be in board? or maybe not
}

function placeSettlement(coords, playerId){

}