/*
This represents the personal stash of items for a player, such as unused roads, resources and such

9) Sixteen (16) Cities (4 of Each Color Shaped like Churches).
10) Twenty (20) Settlements (5 of Each Color Shaped like Houses).
11) Sixty (60) Roads (15 of Each Color Shaped like Bars).

The idea is that the stash is meant to be private for every user
*/

exports.Stash = function(playerId) {
	this.playerId = playerId;
	this.cities = 4;
	this.settlements = 5;
	this.roads = 15;
	this.resources = [];
	this.resourcesDict = { grain: 0, lumber: 0, wool: 0, ore: 0, brick: 0 };
}

exports.Stash.prototype = {
	constructor: exports.Stash,

	addResource: function(resource) {
		this.resources.push(resource);
		this.resourcesDict[resource]++;
	},

	removeResource: function(resource) {
		this.resourcesDict[resource]--;
		for (var i = 0; i < this.resources.length; i++){
			if (this.resources[i].type === resource){
				this.resources.splice(i, 1);
				return;
			}
		}
	},

	canAfford: canAfford,

	payCost: payCost,

	hiddenify: hiddenify
}

function canAfford (costs) {
	for (type in costs)
		if (this.resourcesDict[type] < costs[type])
			return false;
	return true;
}

function payCost (costs) {
	for (type in this.resourcesDict)
		for (var i = 0; i < costs[type]; i++)
			this.removeResource (type);
}

function hiddenify () {
	var hiddenCopy = {
		playerId: this.playerId,
		cities: this.cities,
		settlements: this.settlements,
		roads: this.roads,
		resources: []};

	this.resources.forEach(function(resource){
		hiddenCopy.resources.push('hidden');
	});
	return hiddenCopy;
}

