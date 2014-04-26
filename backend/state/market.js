var costs = require ('../rules/costs');


exports.Market = Market;

function Market(game) {
  this.game = game;
  this.offeringPlayer = null;
  this.offering = [];
  this.wanted = new WantedSet ();
}

Market.prototype = {
  constructor: Market,

  offer: offer,

  canTrade: canTrade,

  trade: trade,

  clear: clear
}

// offeringPlayer = player wanting to trade away
// offeringWanteds = array of wanted resources
// offeredResources the resource to trade away
function offer (offeringPlayer, offeringWanteds, offeredResources) {
  this.offeringPlayer = offeringPlayer;
  this.offering = offeredResources;
  for (var i = 0; i < offeringWanteds.length; i++)
    this.wanted.add (offeringWanteds[i]);
}

function canTrade (acceptingPlayer, offeringWanted, offeredResource) {
  var offeringCost = costs.playerTrade (offeredResource);
  var acceptingCost = costs.playerTrade (offeringWanted);

  var resourcesAreUpForTrade =  this.offering.indexOf(offeredResource) !== -1 &&
                                this.wanted.contains(offeringWanted);
  var bothPlayersAffordTrade =  game.stashes[this.offeringPlayer].canAfford (offeringCost) &&
                                game.stashes[acceptingPlayer].canAfford (acceptingCost);

  return resourcesAreUpForTrade && bothPlayersAffordTrade;
}

function trade (acceptingPlayer, offeringWanted, offeredResource) {
  var offeringCost = costs.playerTrade (offeredResource);
  var acceptingCost = costs.playerTrade (offeringWanted);

  game.stashes[this.offeringPlayer].payCost(offeringCost);
  game.stashes[this.offeringPlayer].addResource(offeringWanted);
  game.stashes[acceptingPlayer].payCost(acceptingCost);
  game.stashes[acceptingPlayer].addResource(offeredResource);
}

function clear () {
  this.offeringPlayer = null;
  this.offering = [];
  this.wanted = new WantedSet ();
}

function WantedSet () {
  this.data = {};
}

WantedSet.prototype = {
  constructor: WantedSet,

  add: function (resource) {
    if (typeof resource !== 'string')
      throw "resource type must be a string"
    this.data[resource] = true;
  },

  remove: function (resource) {
    delete this.data[resource];
  },

  contains: function (resource) {
    return this.data[resource] ? true : false;
  }
};