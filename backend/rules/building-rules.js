/*
  This serves as the set of rules related to building (roads, settlements, buildings)
*/

var common = require('./common-rules'),
    costs = require('./costs').costs;

var INITIAL_ROADS = 2;
var INITIAL_SETTLEMENTS = 1;

var isPlayersTurn = common.isPlayersTurn;

exports.initialRoadPlacementRule = [isPlayersTurn, 'AND',
                                   roadNotPresent, 'AND',
                                    hasInitialRoadsLeft, 'AND',
                                      [ isFirstPlacement, 'OR',
                                        roadConnectedToRoad, 'OR',
                                        roadConnectedToBuilding ]
                                    ];

exports.initialSettlementPlacementRule = [isPlayersTurn, 'AND',
                                          buildingNotPresent, 'AND',
                                          hasInitialSettlementsLeft, 'AND',
                                          noBuildingsTooClose, 'AND',
                                           [ isFirstPlacement, 'OR',
                                             buildingConnectedToRoad ]
                                          ];

exports.roadBuildRule = [isPlayersTurn, 'AND',
                         roadNotPresent, 'AND',
                         hasRoadsLeft, 'AND',
                         canAffordRoad, 'AND',
                         roadConnectedToRoad];

exports.settlementBuildRule = [isPlayersTurn, 'AND',
                              buildingNotPresent, 'AND',
                               hasSettlementsLeft, 'AND',
                               canAffordSettlement, 'AND',
                               buildingConnectedToRoad, 'AND',
                               noBuildingsTooClose]; // TODO not intercepted by enemy roads

exports.citybuildRule = [isPlayersTurn, 'AND',
                         settlementOwned, 'AND',
                         hasCitiesLeft, 'AND',
                         canAffordCity];

exports.hasInitialPlacementLeft = [hasInitialRoadsLeft, 'OR', hasInitialSettlementsLeft];

function isPlayersTurn (game, playerId, data) {
  return game.queue.getCurrentPlayer() === playerId;
}

function isFirstPlacement (game, playerId, data) {
  return  game.roadsForPlayer[playerId].length === 0 &&
          game.buildingsForPlayer[playerId].length === 0;
}

function roadNotPresent (game, playerId, data) {
  return game.board.getRoad(data.roadCoords).occupyingPlayerId === null;
}

function hasRoadsLeft (game, playerId, data) {
  return game.stashes[playerId].roads > 0;
}

function hasInitialRoadsLeft (game, playerId, data) {
  return game.roadsForPlayer[playerId].length < INITIAL_ROADS;
}

function roadConnectedToRoad (game, playerId, data) {
  var adjacentBuildingKeys = game.board.getRoad(data.roadCoords).buildings;
  for (var i = 0; i < adjacentBuildingKeys.length; i++) {
    data = { buildingCoords: adjacentBuildingKeys[i] };
    if (buildingConnectedToRoad(game, playerId, data))
      return true;
  }
  return false;
}

function buildingConnectedToRoad (game, playerId, data) {
  var adjacentRoadKeys = game.board.getBuilding(data.buildingCoords).roads;
  for (var i = 0; i < adjacentRoadKeys.length; i++) {
    var adjacentRoad = game.board.getRoad(adjacentRoadKeys[i]);
    if (adjacentRoad.occupyingPlayerId === playerId)
      return true;
  }
  return false;
}

function canAffordRoad (game, playerId, data) {
  return game.stashes[playerId].canAfford (costs.road);
}


function roadConnectedToBuilding (game, playerId, data) {
  var road = game.board.getRoad(data.roadCoords);
  var b0 = game.board.getBuilding(road.buildings[0]);
  var b1 = game.board.getBuilding(road.buildings[1]);
  return b0.occupyingPlayerId === playerId || b1.occupyingPlayerId === playerId;
}

function buildingNotPresent (game, playerId, data) {
  return game.board.getBuilding(data.buildingCoords).occupyingPlayerId === null;
}

function hasSettlementsLeft (game, playerId, data) {
  return game.stashes[playerId].settlements > 0;
}

function hasInitialSettlementsLeft (game, playerId, data) {
  return game.buildingsForPlayer[playerId].length < INITIAL_SETTLEMENTS;
}

function noBuildingsTooClose (game, playerId, data) {
  var start = game.board.getBuilding(data.buildingCoords);
  var tooClose = false;

  var allRoadsFilter = function (road) { return true; };
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
  return game.stashes[playerId].canAfford (costs.settlement);
}

function settlementOwned (game, playerId, data) {
  var building = game.board.getBuilding(data.buildingCoords);
  return building.type === 'settlement' && building.occupyingPlayerId === playerId;
}


function hasCitiesLeft (game, playerId, data) {
  return game.stashes[playerId].cities > 0;
}

function canAffordCity (game, playerId, data) {
  return game.stashes[playerId].canAfford (costs.city);
}