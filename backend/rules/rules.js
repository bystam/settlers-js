/*
  This is the usage interface of rules, which external modules can use
  to query for validness of moves.
*/
var common = require('./common-rules'),
    building = require('./building-rules'),
    buff = require('./buff-rules'),
    costs = require('./costs').costs,
    evaluator = require('./rules-evaluator');

var evaluateRule = evaluator.evaluateRule;

exports.Rules = function(game) { // rules constructor
  this.game = game;
  this.costs = costs;
};

exports.Rules.prototype = {
  constructor: exports.Rules,

  isPlayersTurn: function (playerId) {
    return evaluateRule (common.isPlayersTurn, this.game, playerId, null);
  },

  endTurnAllowed: function (playerId) {
    return evaluateRule (common.endTurnAllowed, this.game, playerId, null);
  },

  roadBuildIsLegal: function (roadCoords, playerId) {
    var data = { roadCoords: roadCoords };
    return evaluateRule (building.roadBuildRule, this.game, playerId, data);
  },

  settlementBuildIsLegal: function (buildingCoords, playerId) {
    var data = { buildingCoords: buildingCoords };
    return evaluateRule (building.settlementBuildRule, this.game, playerId, data);
  },

  cityBuildIsLegal: function(buildingCoords, playerId) {
    var data = { buildingCoords: buildingCoords };
    return evaluateRule (building.citybuildRule, this.game, playerId, data);
  },

  initialRoadBuildIsLegal: function(roadCoords, playerId) {
    var data = { roadCoords: roadCoords };
    return evaluateRule (building.initialRoadPlacementRule, this.game, playerId, data);
  },

  initialSettlementBuildIsLegal: function(buildingCoords, playerId) {
    var data = { buildingCoords: buildingCoords };
    return evaluateRule (building.initialSettlementPlacementRule, this.game, playerId, data);
  },

  isValidKnightPlacement: function (hexCoords) {
    var data = { hexCoords: hexCoords };
    return evaluateRule (buff.isValidKnightPlacement, this.game, playerId, data);
  }
};

