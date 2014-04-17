
var mapCreator = require('./map-creator');

var $ = mapCreator.LAND;
var w = mapCreator.WATER;
var _ = mapCreator.DEAD_SPACE;

exports.map = {
  brickTypes: [
    { type: 'field', resource: 'grain', amount: 4 },
    { type: 'forest', resource: 'lumber', amount: 4 },
    { type: 'pasture', resource: 'wool', amount: 4 },
    { type: 'mountain', resource: 'ore', amount: 3 },
    { type: 'hill', resource: 'brick', amount: 3 },
    { type: 'desert', resource: null, amount: 1 },
  ],
  tokenTypes: [
    { value: 2, amount: 1 },
    { value: 3, amount: 2 },
    { value: 4, amount: 2 },
    { value: 5, amount: 2 },
    { value: 6, amount: 2 },
    { value: 8, amount: 2 },
    { value: 9, amount: 2 },
    { value: 10, amount: 2 },
    { value: 11, amount: 2 },
    { value: 12, amount: 1 },
  ],
  grid: [
    [_, _, _, w, _, _, _],
    [_, _, w, _, w, _, _],
    [_, w, _, $, _, w, _],
    [w, _, $, _, $, _, w],
    [_, $, _, $, _, $, _],
    [w, _, $, _, $, _, w],
    [_, $, _, $, _, $, _],
    [w, _, $, _, $, _, w],
    [_, $, _, $, _, $, _],
    [w, _, $, _, $, _, w],
    [_, w, _, $, _, w, _],
    [_, _, w, _, w, _, _],
    [_, _, _, w, _, _, _]
  ]
};