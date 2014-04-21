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

exports.registerPlayerForKnightActions = function (socket, room, playerId) {
  var game = games[room];

  socket.on ('place-knight', function (hexCoords) {
    var knightPlacementResult = validateAndPlaceKnight (hexCoords, game);
    socket.emit('place-knight', knightPlacementResult);
  });

  socket.on ('steal-resource', function (targetPlayer) {
    var resourceStealResult = validateAndStealResource (playerId, targetPlayer, game);

    if (resourceStealResult.valid) {
      /*
        Antingen broadcast till alla from/to så får from och to
        ladda om sin stash (lite småfult kanske?)

        eller så sparar vi sockets (lite fult?) och
        skickar riktade med revealing resources och sedan
        en hidden broadcast... fult det med...
      */
      io.sockets.in(room).emit('steal-resource', resourceStealResult);
    } else {
      socket.emit ('steal-resource', resourceStealResult);
    }
  });

  socket.
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
    return { valid: true, from: targetPlayer, to: playerId };
}