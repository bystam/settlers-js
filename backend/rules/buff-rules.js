/*
  This serves as the set of rules related to buffs (development cards, knight placement,
  longest road perks...)
*/

var common = require('./common-rules');

var isPlayersTurn = common.playersTurnRule;

exports.validKnightPlacementRule = [isPlayersTurn, 'AND', landHexExists, 'AND', diceSumIsSeven];
exports.knightStealFromPlayerRule = [knightActionIsActive, 'AND', targetHasResources];

function landHexExists (game, playerId, data) {
  var hexCoords = data.hexCoords;
  return game.board.map[hexCoords.row][hexCoords.col] ? true : false;
}

// TODO won't work if all opponents are empty handed
function targetHasResources (game, playerId, data) {
  var targetPlayer = data.targetPlayer;
  return game.stashes[targetPlayer].resources.length > 0;
}

function knightActionIsActive (game, playerId, data) {
  return game.activeActions[playerId].contains('knight');
}

function diceSumIsSeven (game, playerId, data) {
  return game.dices.sum() === 7;
}