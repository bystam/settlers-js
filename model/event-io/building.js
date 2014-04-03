
/*
	The module that handles I/O events that are related to the building of
	roads, settlements and cities
*/


var costs = {road:[0,0,0,0,0], town:[0,0,0,0,0], city:[0,0,0,0,0], developmentCard:[0,0,0,0,0]}

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
}

exports.setupBuldingEvents = function(socket, room, playerId){
	var game = games[room];
	socket.on("buildRoad", function(coords){
		var buildingOk = false;
		if(hasInStash(game, playerId, buildingTypes.road)){
			if(!roadExists(game,coords)){
				if(isFirstRound(game, playerId)){
					buildingOk = true;
				} else if(isStartupPhase(game, playerId)){
					if(hasConnecting(game,playerId, coords, buildingTypes.road) || 
						hasConnecting(game, playerId, coords,buildingTypes.settlement))
						buildingOk = true;
				} else if(hasConnecting(game, playerId, coords, buildingTypes.road)){
					if(hasResources(game, costs.road, playerId))
						buildingOk = true;
					else if(hasFreeRoads(game, playerId))
						buildingOk = true;
				}
			}
		}
		if(buildingOk)
			game.placeRoad (coords, playerId);
		socket.emit("buildRoad", {playerId:playerId, coords:coords, allowed:buildingOk});
	});

	socket.on("buildSettlement", function(coords){
		var buildingOk = false;
		if(!settlementExists(game, coords)){
			if(hasInStash(game, playerId, buildingTypes.settlement)){
				if(!settlementInProximity(game, coords)){
					if(isFirstRound(game, playerId))
						buildingOk = true;
					else if(isStartupPhase(game, playerId)){
						if(hasConnecting(game, playerId, coords, buildingTypes.road))
							buildingOk = true;
					} else if(hasConnecting(game, playerId, coords, buildingTypes.road)){
						if(hasResources(game, costs.settlement, playerId))
							buildingOk = true;
					}
				}
			}
		} else if(settlementIsOwnedByPlayer(game, coords, playerId)){
			if(hasInStash(game, playerId, buildingTypes.city)){
				if(hasResources(game, costs.city, playerId))
					buildingOk = true;
			}
		}
		console.log("city allowed: "+buildingOk);
		if(buildingOk)
			game.placeSettlement(coords, playerId)
		socket.emit("buildSettlement", {playerId:playerId, coords:coords, allowed:buildingOk});
	});
}


function placeRoad(coords, playerId){
	// TODO should be in board? or maybe not
}