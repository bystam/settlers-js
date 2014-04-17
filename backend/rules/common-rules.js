/*
  This serves as the set of rules that are basic and common to all rule sets
*/

exports.isPlayersTurn = [isPlayersTurn];

function isPlayersTurn (game, playerId, data) {
  return game.queue.getCurrentPlayer() === playerId;
}
