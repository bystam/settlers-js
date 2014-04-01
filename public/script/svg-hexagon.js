/*
Created by Ian Hirschfeld
http://ianhirschfeld.com
https://github.com/ianhirschfeld

Extension to the Snap.svg library
http://snapsvg.io
https://github.com/adobe-webplatform/Snap.svg
*/

Math.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.radToDeg= function(radians) {
  return radians * 180 / Math.PI;
};

Snap.plugin(function(Snap, Element, Paper, glob) {
  /*
    Create a snap Hexagon object.
    */  Snap.Hexagon = {};
  /*
    Gets width of a hexagon.
  
    @params el {Element} A Snap Element
    @return {Number}
    */
  Snap.Hexagon.width = function(el) {
    var i, point, points, xs, _len;
    points = JSON.parse("[" + (el.attr('points')) + "]");
    xs = [];
    for (i = 0, _len = points.length; i < _len; i++) {
      point = points[i];
      if (i % 2 === 0) {
        xs.push(point);
      }
    }
    return Math.max.apply(Math, xs) - Math.min.apply(Math, xs) + el.data('roundness');
  };
  /*
    Gets height of a hexagon.
  
    @params el {Element} A Snap Element
    @return {Number}
    */
  Snap.Hexagon.height = function(el) {
    var i, point, points, ys, _len;
    points = JSON.parse("[" + (el.attr('points')) + "]");
    ys = [];
    for (i = 0, _len = points.length; i < _len; i++) {
      point = points[i];
      if (i % 2 === 1) {
        ys.push(point);
      }
    }
    return Math.max.apply(Math, ys) - Math.min.apply(Math, ys) + el.data('roundness');
  };
  /*
    Gets diameter of a regular hexagon.
  
    @params size {Number} Side length
    @return {Number}
    */
  Snap.Hexagon.diameter = function(size) {
    return size * 2;
  };
  /*
    Gets incircle radius of a regular hexagon.
  
    @params size {Number} Side length
    @return {Number}
    */
  Snap.Hexagon.incircleRadius = function(size) {
    return size * Math.sqrt(3) / 2;
  };
  /*
    Gets incircle diamater of a regular hexagon.
  
    @params size {Number} Side length
    @return {Number}
    */
  Snap.Hexagon.incircleDiameter = function(size) {
    return Snap.Hexagon.incircleRadius(size) * 2;
  };
  /*
    Draws a regular hexagon.
  
    @param r {Number} Radius (aka Side length)
    @param a {Number} Angle of rotation in degrees
    @param roundness {Number} Roundness of vertices
    @param originCenter {Boolean} If true, draws hexagon with center at origin
    @return {Element} A Snap Element
    */
  return Paper.prototype.hex = function(r, a, roundness, originCenter, x, y) {
    var angle, attrs, hex, i, points, radius, xOffset, yOffset, _ref;
    if (r == null) {
      r = 50;
    }
    if (a == null) {
      a = 0;
    }
    if (roundness == null) {
      roundness = 0;
    }
    if (originCenter == null) {
      originCenter = false;
    }
    points = [];
    radius = r - (roundness / 2);
    for (i = 0; i <= 6; i++) {
      angle = i * 2 * -Math.PI / 6 + Math.degToRad(a);
      points.push((radius * Math.cos(angle)) + (x/2));
      points.push((radius * Math.sin(angle)) + (y/2));
    }
    if (roundness !== 0) {
      attrs = {
        'stroke-width': roundness,
        'stroke-linejoin': 'round',
        fill: '#000',
        stroke: '#000'
      };
    }
    hex = this.polygon(points).attr(attrs).data('roundness', roundness);
    if (!originCenter) {
      xOffset = (Snap.Hexagon.width(hex) / 2) + (x/2);
      yOffset = (Snap.Hexagon.height(hex) / 2) + (y/2);
      for (i = 0, _ref = points.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (i % 2 === 0) {
          points[i] += xOffset;
        } else {
          points[i] += yOffset;
        }
      }
      hex.attr({
        points: points
      });
    }
    return hex;
  };
});