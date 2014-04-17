/*
  This serves as the set of rules related to buffs (development cards, knight placement,
  longest road perks...)
*/

var common = require('./common-rules');

var isPlayersTurn = common.isPlayersTurn;

function landHexExists (game, playerId, data) {
  var hexCoords = data.hexCoords;
  return game.board.map[hexCoords.row][hexCoords.col] ? true : false;
}

exports.isValidKnightPlacement = [isPlayersTurn, 'AND', landHexExists];