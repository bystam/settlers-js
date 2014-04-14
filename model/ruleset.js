
var buildingTypes = {road:"road", settlement:"settlements", city:"city"};
var costs = {road:[0,0,0,0,0], town:[0,0,0,0,0], city:[0,0,0,0,0], developmentCard:[0,0,0,0,0]}

exports.Rules = function(game) { // rules constructor
	this.game = game;
	this.roadBuildIsLegal = roadBuildIsLegal;
	this.settlementBuildIsLegal = settlementBuildIsLegal;
}

function roadBuildIsLegal(coords, playerId) {
	var data = { coords: coords };
	return evaluateRule (roadBuildRule, this.game, playerId, data);
}

function settlementBuildIsLegal(coords, playerId) {
	var data = { coords: coords };
	return evaluateRule (settlementBuildRule, this.game, playerId, data);
}

var initialRoadPlacementRule = [roadNotPresent, 'AND',
																hasInitialRoadsLeft, 'AND',
																	[ isFirstPlacement, 'OR',
																		hasConnectingRoad, 'OR',
																		hasConnectingBuilding ]
																];

var initialSettlementPlacementRule = [buildingNotPresent, 'AND',
																		  hasInitialSettlementsLeft, 'AND',
																		  noBuildingsTooClose, 'AND',
																		 	 [ isFirstPlacement, 'OR',
																		 		 hasConnectingRoad ]
																		  ];

var roadBuildRule = [roadNotPresent, 'AND',
										 hasRoadsLeft, 'AND',
										 canAffordRoad, 'AND',
										 hasConnectingRoad];

var settlementBuildRule = [buildingNotPresent, 'AND',
													 hasSettlementsLeft, 'AND',
													 canAffordSettlement, 'AND',
													 hasConnectingRoad, 'AND',
													 noBuildingsTooClose];

function isFirstPlacement (game, playerId, data) {
	return game.roadsForPlayer[playerId].length === 0 &&
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

function hasConnectingRoad (game, playerId, data) {
	return true; // TODO
}

function canAffordRoad (game, playerId, data) {
	return true; // TODO
}


function hasConnectingBuilding (game, playerId, data) {
	return true; // TODO
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
	return true; // TODO
}

function canAffordSettlement (game, playerId, data) {
	return true; // TODO
}


function evaluateRuleTree (rule) {
	return evaluateDisjunction(rule);
}

function evaluateRule (node, game, playerId, data) {
	var disjunctionGroups = getDisjunctionGroups(node);

	var orResult = false;
	disjunctionGroups.forEach(function (group) {
		var andResult = true;
		group.forEach(function(statement) {
			if (typeof statement === 'object') {
				andResult = andResult && evaluateNode (statement, game, playerId, data);
			} else if (typeof statement === 'function') {
				andResult = andResult && statement (game, playerId, data);
			}
			orResult = orResult || andResult;
		});
	});

	return orResult;
}

function getDisjunctionGroups(node) {
	var disjunctionGroups = [];
	var currentGroup = [];
	node.forEach(function (element, i) {
		if (element === 'OR') {
			disjunctionGroups.push(currentGroup);
			currentGroup = [];
		} else if (element === 'AND') {
			// no action required
		} else { // piece of conjunction
			currentGroup.push (element);
		}
		if (i === node.length - 1)
			disjunctionGroups.push(currentGroup);
	});
	return disjunctionGroups;
}
