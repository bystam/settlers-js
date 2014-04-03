/*Defines the API and acts as a controller */
var costs = {road:[0,0,0,0,0], town:[0,0,0,0,0], city:[0,0,0,0,0], developmentCard:[0,0,0,0,0]}
exports.init = function(socket, game, playerId){
	socket.on("buildRoad", function(coords){
		var buildingOk = false;
		if(hasRoadsInStash(game, playerId)){
			if(!roadExists(game,coords)){
				if(isFirstRound(game, playerId)){
					buildingOk = true;
				} else if(isStartupPhase(game, playerId)){
					if(hasConnectingRoad(game,coords,playerId) || 
						hasConnectingTown(game, coords, playerId))
						buildingOk = true;
				} else if(hasConnectingRoad(game, coords, playerId)){
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
}

// The methods below should probably be in gamestate.js, but when you assume...

function hasRoadsInStash (game, playerId){
	return true;
	// return game.stashes[playerId].roads > 0;
}
function hasFreeRoads(game, playerId){
	return true;
}

function hasResources(game, cost, playerId){
	return true;
}

function hasConnectingTown(game, coords, playerId){
	return true;
}

function hasConnectingRoad(game, coords, playerId){
	return true;
}

function isStartupPhase (game, playerId){
	return true;
}

function isFirstRound(game, playerId){
	return true;
}

function roadExists (game, coords){
	return false;
}

	