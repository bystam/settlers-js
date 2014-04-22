/*
  This serves as the set of rules that are basic and common to all rule sets
*/

exports.isPlayersTurn = [gameIsStarted, 'AND', isPlayersTurn];

exports.endTurnAllowed = [isPlayersTurn, 'AND', noActiveActions];

function isPlayersTurn (game, playerId, data) {
  return game.queue.getCurrentPlayer() === playerId;
}

function noActiveActions (game, playerId, data) {
  return game.activeActions[playerId].isEmpty();
}

function gameIsStarted (game, playerId, data) {
  return game.isStarted ();
}
