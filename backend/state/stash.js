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
	this.resources = {
		grain: 0, lumber: 0, wool: 0, ore: 0, brick: 0,
		total: function () { return this.grain + this.lumber + this.wool + this.ore + this.brick; }
	};
}

exports.Stash.prototype = {
	constructor: exports.Stash,

	addResource: function(resource) {
		this.resources[resource]++;
	},

	removeResource: function(resource) {
		this.resources[resource]--;
		return resource;
	},

	canAfford: canAfford,

	addAll: addAll,

	payCost: payCost,

	stealRandomResource: stealRandomResource,

	hiddenify: hiddenify
}

function canAfford (costs) {
	for (type in costs)
		if (this.resources[type] < costs[type])
			return false;
	return true;
}

function addAll (resources) {
	for (type in resources)
		for (var i = 0; i < resources[type]; i++)
			this.addResource (type);
}

function payCost (costs) {
	for (type in costs)
		for (var i = 0; i < costs[type]; i++)
			this.removeResource (type);
}

function stealRandomResource () {
	var randomIndex = Math.floor (Math.random () * this.resources.total());
	console.log(randomIndex);
	for (type in this.resources) {
		randomIndex -= this.resources[type];
		if (randomIndex < 0)
			return this.removeResource(type);
	}
	throw "resource steal random has failed. perhaps stash is empty?";
}

function hiddenify () {
	var hiddenCopy = {
		playerId: this.playerId,
		cities: this.cities,
		settlements: this.settlements,
		roads: this.roads,
		resources: { hidden: this.resources.total() } };

	return hiddenCopy;
}

