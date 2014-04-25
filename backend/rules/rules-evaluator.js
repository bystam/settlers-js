
exports.evaluateRule = evaluateRule;

function evaluateRule (node, game, playerId, data) {
  var disjunctionGroups = getDisjunctionGroups(node);

  var orResult = false;
  for (var i = 0; i < disjunctionGroups.length; i++) {
    var group = disjunctionGroups[i];
    var andResult = true;

    for (var k = 0; k < group.length; k++) {
      var element = group[k];

      if (typeof element === 'object') {
        andResult = andResult &&
                    evaluateRule (element, game, playerId, data);
      } else if (typeof element === 'function') {
        andResult = andResult &&
                    element (game, playerId, data);
      }
      if (!andResult) // quick bailout
        break;
    }
    orResult = orResult || andResult;
    if (orResult) // quick bailout
      return true;
  }

  return orResult;
}

function getDisjunctionGroups(node) {
  var disjunctionGroups = [];
  var currentGroup = [];

  node.forEach(function (element, i) {
    if (element === 'OR') {
      disjunctionGroups.push(currentGroup);
      currentGroup = [];
    } else if (element === 'AND') {
      // no action required
    } else { // piece of conjunction
      currentGroup.push (element);
    }
    if (i === node.length - 1)
      disjunctionGroups.push(currentGroup);
  });
  return disjunctionGroups;
}