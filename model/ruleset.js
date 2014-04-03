/*Defines the API and acts as a controller */
//The controller part should probably be sliced into sections,
//so that we can do socket.on("event", specificHandler.doEvent());
//and get a clean API listed. All querying should be methods on the game object,
//or a wrapper around it (gameQueryer? such enterprise)
//
//Idiot idea:
//each query method could be configured into modularizable rules,
//and then one could build an arbitrary ruleset from them...
var costs = {road:[0,0,0,0,0], settlement:[0,0,0,0,0], city:[0,0,0,0,0], developmentCard:[0,0,0,0,0]}
var buildingTypes = {road:"road", settlement:"settlements", city:"city"};
exports.init = function(socket, room, game, playerId){
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

// The methods below should probably be in gamestate.js, but when you assume...

function settlementInProximity(game, coords){
	return false;
}
function hasInStash (game, playerId, type){
	/*
	if(type === buildingTypes.road)
		return game.stashes[playerId].roads > 0;
	if(type == buildingTypes.settlements)
		return game.stashes[playerId].settlements > 0;
	if(type == buildingTypes.city)
		return game.stashes[playerId].cities > 0;
	*/
	return true;
}

function hasConnecting (game, playerId, coords, type){
	/*
	if(type === buildingTypes.road)
		return true;
	if(type == buildingTypes.settlements)
		return true
	*/
	return true;
}

function settlementIsOwnedByPlayer(game, coords, playerId){
	return true;
}

function settlementExists(game, coords){

}

function hasFreeRoads(game, playerId){
	return true;
}

function hasResources(game, cost, playerId){
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

	