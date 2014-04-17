
var LAND = 1;
var WATER = 2;
var DEAD_SPACE = 0;

exports.MapCreator = MapCreator;
exports.LAND = LAND;
exports.WATER = WATER;
exports.DEAD_SPACE = DEAD_SPACE;

function MapCreator (mapStructure) {
  this.mapStructure = mapStructure;
}

MapCreator.prototype = {
  constructor: MapCreator,

  generateRandomMap: function () {
    var map = getRandomMapFromStructure (this.mapStructure);
    map.forEachHex = function (action) {
      forEachHex (this, action);
    }
    return map;
  }
}

function getRandomMapFromStructure (mapStructure) {
  var landHexes = getLandHexes(mapStructure);
  var map = createMapFromHexesAndStructure(landHexes, mapStructure);
  setHexNeighbors(map);
  return map;
}

function getLandHexes (mapStructure) {
  var landHexes = [];
  mapStructure.brickTypes.forEach(function(brickType) {
    addHexesOfType(landHexes, brickType.amount, brickType.type, brickType.resource);
  });
  shuffle(landHexes);

  var tokens = getTokens(mapStructure);
  shuffle(tokens);
  placeTokensOnHexes(tokens, landHexes);
  return landHexes;
}

function addHexesOfType(hexes, amount, type, resource) {
  for (var i = 0; i < amount; i++)
    hexes.push ({ type: type, resource: resource });
}

function getTokens(mapStructure) {
  var tokens = [];
  mapStructure.tokenTypes.forEach (function (tokenType) {
    for (var i = 0; i < tokenType.amount; i++)
      tokens.push ( { value: tokenType.value } );
  });
  return tokens;
}

function placeTokensOnHexes(tokens, hexes) {
  for (var i = 0; i < hexes.length; i++) {
    if (hexes[i].type === 'desert')
      hexes[i].token = { value: null };
    else
      hexes[i].token = tokens.pop();
  }
}

function shuffle(array) {
    array.sort(function() { return 0.5 - Math.random() });
}

function createMapFromHexesAndStructure (landHexes, mapStructure) {
  var grid = mapStructure.grid;
  var map = [];
  var landHexIndex = 0;
  for (var row = 0; row < grid.length; row++) {
    map.push([]);
    for (var col = 0; col < grid[row].length; col++) {
      var hex;
      if (grid[row][col] === LAND)
        hex = landHexes[landHexIndex++];
      else if (grid[row][col] === WATER)
        hex = { type: 'ocean' };
      else
        hex = null;
      if (hex) {
        hex.row = row;
        hex.col = col;
      }
      map[row].push(hex);
    }
  }

  return map;
}

function setHexNeighbors (map) {
  forEachHex (map, function(hex) {
    setNeighbors(hex, map)
  });
}

function setNeighbors(hex, map) {
  var row = hex.row;
  var col = hex.col;
  var hexExists = function(coords) {
    return map[coords.row] && map[coords.row][coords.col];
  }
  // neighbor order determined by snap.svg corner point ordering
  var ne = { row: row-1, col: col+1 };
  var se = { row: row+1, col: col+1 };
  var s = { row: row+2, col: col };
  var sw = { row: row+1, col: col-1 };
  var nw = { row: row-1, col: col-1 };
  var n = { row: row-2, col: col };
  var neighbors = [ne, se, s, sw, nw, n];

  for (var i = 0; i < neighbors.length; i++)
    if (!hexExists(neighbors[i]))
      neighbors[i] = null;

  hex.neighbors = neighbors;
}

function forEachHex(map, action) {
  var height = map.length;
  var width = map[0].length;
  for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {
      var hex = map[row][col];
      if (hex)
        action(hex);
    }
  }
}
