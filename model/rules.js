/*
  This is the usage interface of rules, which external modules can use
  to query for validness of moves.
*/
var ruleset = require('./ruleset');

exports.Rules = function(game) { // rules constructor
  this.game = game;
  this.costs = ruleset.costs;
};

exports.Rules.prototype = {
  constructor: exports.Rules,

  roadBuildIsLegal: function (coords, playerId) {
    var data = { coords: coords };
    return evaluateRule (ruleset.roadBuildRule, this.game, playerId, data);
  },

  settlementBuildIsLegal: function (coords, playerId) {
    var data = { coords: coords };
    return evaluateRule (ruleset.settlementBuildRule, this.game, playerId, data);
  },

  cityBuildIsLegal: function(coords, playerId) {
    var data = { coords: coords };
    return evaluateRule (ruleset.citybuildRule, this.game, playerId, data);
  },

  initialRoadBuildIsLegal: function(coords, playerId) {
    var data = { coords: coords };
    return evaluateRule (ruleset.initialRoadPlacementRule, this.game, playerId, data);
  },

  initialSettlementBuildIsLegal: function(coords, playerId) {
    var data = { coords: coords };
    return evaluateRule (ruleset.initialSettlementPlacementRule, this.game, playerId, data);
  }
};

function evaluateRule (node, game, playerId, data) {
  var disjunctionGroups = getDisjunctionGroups(node);

  var orResult = false;
  for (var i = 0; i < disjunctionGroups.length; i++) {
    var group = disjunctionGroups[i];
    var andResult = true;
    for (var k = 0; k < group.length; k++) {
      var element = group[k];
      if (typeof element === 'object') {
        andResult = andResult &&
                    evaluateRule (element, game, playerId, data);
      } else if (typeof element === 'function') {
        andResult = andResult &&
                    element (game, playerId, data);
      }
      if (!andResult) // quick bailout
        break;
    }
    orResult = orResult || andResult;
    if (orResult) // quick bailout
      return true;
  }

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
