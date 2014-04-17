/*
  This serves as the set of rules that are basic and common to all rule sets
*/

exports.isPlayersTurn = [isPlayersTurn];

exports.endTurnAllowed = [isPlayersTurn, 'AND', noActiveActons];

function isPlayersTurn (game, playerId, data) {
  return game.queue.getCurrentPlayer() === playerId;
}

function noActiveActons (game, playerId, data) {
  return game.activeActions[playerId].isEmpty();
}
