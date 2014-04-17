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
    socket.emit('place-knight', knightPlacementResult); // TODO choose-target instead?
  });

  socket.on ('steal-resource', function (targetPlayer) {

  });
};

function validateAndPlaceKnight (hexCoords, game) {
    if (!game.rules.isValidKnightPlacement (hexCoords))
      return { valid: false };

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