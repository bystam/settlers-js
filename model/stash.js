/*
This represents the personal stash of items for a player, such as unused roads, resources and such

9) Sixteen (16) Cities (4 of Each Color Shaped like Churches).
10) Twenty (20) Settlements (5 of Each Color Shaped like Houses).
11) Sixty (60) Roads (15 of Each Color Shaped like Bars).

The idea is that the stash is meant to be private for every user, and separate from the game state
*/



exports.Stash = function(playerId) {
	this.playerId = playerId;
	this.cities = 4;
	this.settlements = 5;
	this.roads = 15;
	initResources(this);
}

function initResources(stash) {
	stash.resources = [];
	stash.addResource = function(resource) {
		stash.resources.push(resource);
	}

	stash.removeResource = function(type) {
		for (var i = 0; i < stash.resources.length; i++){
			if (stash.resources[i].type === type){
				stash.resources.splice(i, 1);
				return;
			}
		}
	}
}