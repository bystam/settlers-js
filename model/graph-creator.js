

exports.populateWithGraph = function(board) {
  var buildingLookup = new HashTable();
  var roadLookup = new HashTable();

  board.forEachHex(function (hex, row, col) {
    var neighbors = hex.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var n1 = neighbors[i];
      var n2 = neighbors[(i+1) % neighbors.length];
      /*
      TODO:
      create a road between hex and n1, and a city between hex, n1 and n2

      if these don't exist in the lookup, create them and add them

      update references correctly
      */
    }
  });
}

function BuildingLookup() {
  this.hashes = {};
}

BuildingLookup.prototype = {
  constructor: HashTable,

  put: function( coords, value ) {
    sordCoords(coords);
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
