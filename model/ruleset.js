
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

// TODO ska alla de här ligga här eller är någon av dem en del av board-objektet?
exports.Rules = function(game) { // rules constructor
	this.game = game;
	this.settlementInProximity = settlementInProximity;
	this.hasInStash = hasInStash;
	this.hasConnecting = hasConnecting;
	this.settlementIsOwnedByPlayer = settlementIsOwnedByPlayer;
	this.settlementExists = settlementExists;
	this.hasFreeRoads = hasFreeRoads
	this.hasResources = hasResources
	this.isStartupPhase =  isStartupPhase;
	this.isFirstRound = isFirstRound
	this.roadExists =  roadExists;
}

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
