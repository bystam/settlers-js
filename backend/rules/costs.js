/*
  This simply contains the costs of all purchasable items
*/

exports.costs = {
  road:             { grain: 0, lumber: 1, wool: 0, ore: 0, brick: 1 },
  settlement:       { grain: 1, lumber: 1, wool: 1, ore: 0, brick: 1 },
  city:             { grain: 2, lumber: 0, wool: 0, ore: 3, brick: 0 },
  developmentCard:  { grain: 1, lumber: 0, wool: 1, ore: 1, brick: 0 },
  free:             { grain: 0, lumber: 0, wool: 0, ore: 0, brick: 0 },
  stockTrade: function (from) {
    var cost = {};
    cost[from] = 3;
    return cost;
  },
  playerTrade: function (resource) {
    var cost = {};
    cost[resource] = 1;
    return cost;
  }
};