/*
  The module that handles I/O events that are related to players placing the
  knight upon others and drawing their cards
*/

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
  games = gamesState;
  io = socketIo;
};

var sockets = {};

exports.registerPlayerForKnightActions = function (socket, room, playerId) {
  var game = games[room];
  sockets[playerId] = socket;

  socket.on ('place-knight', function (hexCoords) {
    var knightPlacementResult = validateAndPlaceKnight (hexCoords, game);
    socket.emit('place-knight', knightPlacementResult);
  });

  socket.on ('steal-resource', function (targetPlayer) {
    var resourceStealResult = validateAndStealResource (playerId, targetPlayer, game);

    if (resourceStealResult.valid) {
      socket.emit ('steal-resource', resourceStealResult);
      sockets[targetPlayer].emit('steal-resource', resourceStealResult);
    } else {
      socket.emit ('steal-resource', resourceStealResult);
    }
  });
};

function validateAndPlaceKnight (hexCoords, game) {
    if (!game.rules.isValidKnightPlacement (hexCoords))
      return { valid: false };
    game.activeActions[playerId].begin('knight');

    var hex = game.board.map[hexCoords.row][hexCoords.col];
    game.board.resourceBlockedHex = hex;

    var affectedBuildings = game.board.getBuildingsForHex (hex);
    var targetPlayersForSteal = affectedBuildings.map(toPlayerId).filter(nonNullUnique);

    return { valid: true, targetPlayersForSteal: targetPlayersForSteal };
  }

function toPlayerId (building) {
  return building.occupyingPlayerId;
}

function nonNullUnique (elem, pos) {
    return elem && myArray.indexOf(elem) === pos;
}

function validateAndStealResource (playerId, targetPlayer, game) {
    if (!game.rules.canKnightStealFromPlayer (targetPlayer))
      return { valid: false };

    var stolen = game.stashes[targetPlayer].stealRandom ();
    game.stashes[playerId].addResource (stolen);

    game.activeActions[playerId].end('knight');
    return { valid: true, from: targetPlayer, to: playerId, resource: stolen };
}