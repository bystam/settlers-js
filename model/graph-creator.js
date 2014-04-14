

exports.populateWithGraph = function(board) {
  var buildingLookup = new Lookup();
  var roadLookup = new Lookup();

  board.forEachHex(board.map, function (hex, row, col) {
    var neighbors = hex.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var n1 = neighbors[i];
      var n2 = neighbors[(i+1) % neighbors.length];
      if (n1 === null || n2 === null)
        continue;

      var hexCoords = { row: row, col: col };
      var roadKey = [hexCoords, n1];
      var buildingKey = [hexCoords, n1, n2];

      var road = getOrCreateRoad(roadKey);
      var building = getOrCreateBuilding(buildingKey);

      road.buildings.push(building);
      building.roads.push(road);
    }
  });

  //board.buildingLookup = buildingLookup;
  //board.roadLookup = roadLookup;

  board.getRoad = function(coords) {
    return roadLookup.get(coords);
  }

  board.getBuilding = function(coords) {
    return buildingLookup.get(coords);
  }
}

function getOrCreateRoad (roadKey) {
  var road;
  if (road = roadLookup.get(roadKey)) { // road already exists
    // TODO do we need code here?
  } else { // create new road piece
    road = {};
    road.occupyingPlayerId = null;
    road.buildings = [];
    roadLookup.put(roadKey, road);
  }
  return road;
}

function getOrCreateBuilding (buildingKey) {
  var building;
  if (building = buildingLookup.get(roadKey)) { // building already exists
    // TODO do we need code here?
  } else { // create new building
    building = {};
    building.occupyingPlayerId = null;
    building.type = null; // settlement, city
    building.roads = []; // TODO
    buildingLookup.put(buildingKey, building);
  }
  return building;
}

function Lookup() {
  this.hashes = {};
}

Lookup.prototype = {
  constructor: Lookup,

  put: function( coords, value ) {
    sortCoords(coords);
    this.hashes[ JSON.stringify( coords ) ] = value;
  },

  get: function( coords ) {
    sortCoords(coords);
    return this.hashes[ JSON.stringify( coords ) ];
  }
};

function sortCoords(coords) {
  coords.sort(function(a, b) {
    if (a.row < b.row)
      return -1;
    if (a.row === b.row && a.col < b.col)
      return -1;
    return 1;
  });
}
