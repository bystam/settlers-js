/*
	The module that handles I/O events that are related to players performing
	trading actions
*/

var games = null;
var io = null;
exports.init = function(gamesState, socketIo) {
	games = gamesState;
	io = socketIo;
};

exports.registerPlayerForTrades = function (socket, room, playerId) {
  var game = games[room];
  var stash = game.stashes[playerId];

  socket.on('stock-trade', function (data) {
    var tradeCost = game.rules.costs.stockTrade (data.fromResource);
    var gained = null;
    var success = false;

    if (stash.canAfford(tradeCost)) {
      success = true;
      stash.payCost(tradeCost);
      stash.addResource(data.toResource);
      gained = {};
      gained[data.toResource] = 1;
    }
    socket.emit('stock-trade', { success: success, cost: tradeCost, gained: gained });
  });
};