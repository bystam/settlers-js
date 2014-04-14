

exports.populateWithGraph = function(board) {
  var buildingLookup = new Lookup();
  var roadLookup = new Lookup();

  board.forEachHex(board.map, function (hex, row, col) {
    forEachExistingNeighborTriplet (hex, function(hexCoords, n1, n2) {
      var roadKey = [hexCoords, n1];
      var buildingKey = [hexCoords, n1, n2];

      var road = getOrCreateRoad(roadKey, roadLookup);
      var building = getOrCreateBuilding(buildingKey, buildingLookup);

      road.buildings.push(building);
      building.roads.push(road);
    });
  });

  //board.buildingLookup = buildingLookup;
  //board.roadLookup = roadLookup;

  board.getRoad = function(coords) {
    return roadLookup.get(coords);
  }

  board.getBuilding = function(coords) {
    return buildingLookup.get(coords);
  }

  board.getRoadLocationsForHex = function (hex) {
    return getRoadLocationsForHex (hex, roadLookup);
  }

  board.getBuildingLocationsForHex = function (hex) {
    return getBuildingLocationsForHex (hex, buildingLookup);
  }
}

function getOrCreateRoad (roadKey, roadLookup) {
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

function getOrCreateBuilding (buildingKey, buildingLookup) {
  var building;
  if (building = buildingLookup.get(buildingKey)) { // building already exists
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

function forEachExistingNeighborTriplet (hex, action) {
  var neighbors = hex.neighbors;
  for (var i = 0; i < neighbors.length; i++) {
    var n1 = neighbors[i];
    var n2 = neighbors[(i+1) % neighbors.length];
    if (n1 === null || n2 === null)
      continue;

    var hexCoords = { row: hex.row, col: hex.col };
    action (hexCoords, n1, n2);
  }
}

function getBuildingLocationsForHex (hex, buildingLookup) {
  var cityLocations = [];
  forEachExistingNeighborTriplet (hex, function(hexCoords, n1, n2) {
    var buildingKey = [hexCoords, n1, n2];
    cityLocations.push(buildingLookup.get(buildingKey));
  });
  return cityLocations;
}

function getRoadLocationsForHex (hex, roadLookup) {
  var roadLocations = [];
  forEachExistingNeighborTriplet (hex, function(hexCoords, n1) {
    var roadKey = [hexCoords, n1];
    roadLocations.push(roadLookup.get(roadKey));
  });
  return roadLocations;
}

// The following is the Lookup for placeable pieces (like a hashtable)

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
