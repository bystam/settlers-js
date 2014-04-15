
/*
	This serves only as an actual set of rules and their basic functions.

	Complex rules are defined as node in a tree, where the leaves are
	the basic functions.
*/

var buildingTypes = {road:"road", settlement:"settlements", city:"city"};
var costs = {
	road:						{ grain: 0, lumber: 1, wool: 0, ore: 0, brick: 1 },
	settlement:			{ grain: 1, lumber: 1, wool: 1, ore: 0, brick: 1 },
	city:						{ grain: 2, lumber: 0, wool: 0, ore: 3, brick: 0 },
	developmentCard: { grain: 1, lumber: 0, wool: 1, ore: 1, brick: 0 }
};

exports.initialRoadPlacementRule = [isMyTurn, 'AND',
												 					 roadNotPresent, 'AND',
																		hasInitialRoadsLeft, 'AND',
																			[ isFirstPlacement, 'OR',
																				roadConnectedToRoad, 'OR',
																				roadConnectedToBuilding ]
																		];

exports.initialSettlementPlacementRule = [isMyTurn, 'AND',
												 								 buildingNotPresent, 'AND',
																				  hasInitialSettlementsLeft, 'AND',
																				  noBuildingsTooClose, 'AND',
																				 	 [ isFirstPlacement, 'OR',
																				 		 buildingConnectedToRoad ]
																				  ];

exports.roadBuildRule = [isMyTurn, 'AND',
												 roadNotPresent, 'AND',
												 hasRoadsLeft, 'AND',
												 canAffordRoad, 'AND',
												 roadConnectedToRoad];

exports.settlementBuildRule = [isMyTurn, 'AND',
												 			buildingNotPresent, 'AND',
															 hasSettlementsLeft, 'AND',
															 canAffordSettlement, 'AND',
															 buildingConnectedToRoad, 'AND',
															 noBuildingsTooClose]; // TODO not intercepted by enemy roads

exports.citybuildRule = [isMyTurn, 'AND',
												 settlementOwned, 'AND',
												 hasCitiesLeft, 'AND',
												 canAffordCity];

function isMyTurn (game, playerId, data) {
	return game.queue.getCurrentPlayer() === playerId;
}

function isFirstPlacement (game, playerId, data) {
	return	game.roadsForPlayer[playerId].length === 0 &&
					game.buildingsForPlayer[playerId].length === 0;
}

function roadNotPresent (game, playerId, data) {
	return game.board.getRoad(data.coords).occupyingPlayerId === null;
}

function hasRoadsLeft (game, playerId, data) {
	return game.stashes[playerId].roads > 0;
}

function hasInitialRoadsLeft (game, playerId, data) {
	return game.roadsForPlayer[playerId].length < 2;
}

function roadConnectedToRoad (game, playerId, data) {
	var adjacentBuildingKeys = game.board.getRoad(data.coords).buildings;
	for (var i = 0; i < adjacentBuildingKeys.length; i++) {
		data = { coords: adjacentBuildingKeys[i] };
		if (buildingConnectedToRoad(game, playerId, data))
			return true;
	}
	return false;
}

function buildingConnectedToRoad (game, playerId, data) {
	var adjacentRoadKeys = game.board.getBuilding(data.coords).roads;
	for (var i = 0; i < adjacentRoadKeys.length; i++) {
		var adjacentRoad = game.board.getRoad(adjacentRoadKeys[i]);
		if (adjacentRoad.occupyingPlayerId === playerId)
			return true;
	}
	return false;
}

function canAffordRoad (game, playerId, data) {
	return true; // TODO
}


function roadConnectedToBuilding (game, playerId, data) {
	var road = game.board.getRoad(data.coords);
	var b0 = game.board.getBuilding(road.buildings[0]);
	var b1 = game.board.getBuilding(road.buildings[1]);
	return b0.occupyingPlayerId === playerId || b1.occupyingPlayerId === playerId;
}

function buildingNotPresent (game, playerId, data) {
	return game.board.getBuilding(data.coords).occupyingPlayerId === null;
}

function hasSettlementsLeft (game, playerId, data) {
	return game.stashes[playerId].settlements > 0;
}

function hasInitialSettlementsLeft (game, playerId, data) {
	return game.buildingsForPlayer[playerId].length < 1;
}

function noBuildingsTooClose (game, playerId, data) {
	var allRoadsFilter = function (road) { return true; };
	var start = game.board.getBuilding(data.coords);
	var tooClose = false;
	var checkIfABuildingIsOneRoadAway = function(node) {
		if (node.depth > 1)
			return false; // stop searching
		var building = node.building;
		if (game.board.getBuilding (building).occupyingPlayerId !== null) {
			tooClose = true;
			return false;
		}
		return true;
	};

	game.board.breadthFirstSearch(start, allRoadsFilter, checkIfABuildingIsOneRoadAway);
	return !tooClose;
}

function canAffordSettlement (game, playerId, data) {
	return true; // TODO
}

function settlementOwned (game, playerId, data) {
	var building = game.board.getBuilding(data.coords);
	return building.type === 'settlement' && building.occupyingPlayerId === playerId;
}


function hasCitiesLeft (game, playerId, data) {
	return game.stashes[playerId].cities > 0;
}

function canAffordCity (game, playerId, data) {
	return true; // TODO
}
