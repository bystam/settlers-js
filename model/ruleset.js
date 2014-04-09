
/*Defines the API and acts as a controller */
//The controller part should probably be sliced into sections,
//so that we can do socket.on("event", specificHandler.doEvent());
//and get a clean API listed. All querying should be methods on the game object,
//or a wrapper around it (gameQueryer? such enterprise)
//
//Idiot idea:
//each query method could be configured into modularizable rules,
//and then one could build an arbitrary ruleset from them...

// The methods below should probably be in gamestate.js, but when you assume...
/*
	Module suggestion:

	this servers as the validator of actions and events based on gamestate

	I/O modules can use this to validate events they receive before performing
	gamestate mutation
*/

/*
	Jag döpte maps.js till något dåligt (efter min allra första diskussion med nikbac), men tanken
	var att den ska hantera alla typer av konstruktion i spelet. den heter building.js nu

	ruleset.js känns som att det borde vara regel-validatorn för saker man gör, inte den
	som faktiskt placerar vägen. jag föreställer mig alltså ett flöde likt det här

	i building.js
	socket.on('build-road', function(data) {
		if (game.rules.roadBuildIsLegal(data))
			buildRoad(data)
	})

	det finns fler saker som beror på regler, till exempel trades. om både vägbygge
	och trading ska ligga i den här modulen kommer den bli knull
*/

var buildingTypes = {road:"road", settlement:"settlements", city:"city"};
var costs = {road:[0,0,0,0,0], town:[0,0,0,0,0], city:[0,0,0,0,0], developmentCard:[0,0,0,0,0]}

// TODO ska alla de här ligga här eller är någon av dem en del av board-objektet?
exports.Rules = function(game) { // rules constructor
	this.game = game;
	this.roadBuildIsLegal = roadBuildIsLegal;
	this.settlementBuildIsLegal = settlementBuildIsLegal;
}

function roadBuildIsLegal (roadCoordinates, playerId) {
	var isLegal = false;
	if(hasInStash(playerId, buildingTypes.road)) {
		if(!roadExists(roadCoordinates)){
			if(isFirstRound(playerId)){
				isLegal = true;
			} else if(isStartupPhase(playerId)){
				if(hasConnecting(playerId, roadCoordinates, buildingTypes.road) || 
					hasConnecting(playerId, roadCoordinates, buildingTypes.settlement))
					isLegal = true;
			} else if(hasConnecting(playerId, roadCoordinates, buildingTypes.road)){
				if(rules.hasResources(costs.road, playerId))
					isLegal = true;
				else if(hasFreeRoads(playerId))
					isLegal = true;
			}
		}
	}

	return isLegal;
}

function settlementBuildIsLegal (settlementCoords, playerId) {
	var isLegal = false;
	var isCity = false;
	if(!settlementExists(settlementCoords)){
		if(hasInStash(playerId, buildingTypes.settlement)){
			if(!settlementInProximity(settlementCoords)){
				if(isFirstRound(playerId))
					isLegal = true;
				else if(isStartupPhase(playerId)){
					if(hasConnecting(playerId, settlementCoords, buildingTypes.road))
						isLegal = true;
				} else if(hasConnecting(playerId, settlementCoords, buildingTypes.road)){
					if(hasResources(costs.settlement, playerId))
						isLegal = true;
				}
			}
		}
	} else if (settlementIsOwnedByPlayer(settlementCoords, playerId)) {
		if(hasInStash(playerId, buildingTypes.city)){
			if(hasResources(costs.city, playerId)){
				isLegal = true;
				isCity = true;
			}
		}
	}

	return { legal: isLegal, city: isCity };
}

function settlementInProximity(coords){
	return false;
}

function hasInStash (playerId, type){
	/*
	if(type === buildingTypes.road)
		return tashes[playerId].roads > 0;
	if(type == buildingTypes.settlements)
		return tashes[playerId].settlements > 0;
	if(type == buildingTypes.city)
		return tashes[playerId].cities > 0;
	*/
	return true;
}

function hasConnecting (playerId, coords, type){
	/*
	if(type === buildingTypes.road)
		return true;
	if(type == buildingTypes.settlements)
		return true
	*/
	return true;
}

function settlementIsOwnedByPlayer(coords, playerId){
	return true;
}

function settlementExists(coords){

}

function hasFreeRoads(playerId){
	return true;
}

function hasResources(cost, playerId){
	return true;
}

function isStartupPhase (playerId){
	return true;
}

function isFirstRound(playerId){
	return true;
}

function roadExists (coords){
	return false;
}
