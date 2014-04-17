
direction = {n:"north", s:"south", nw:"northwest", ne:"northeast", sw:"southwest", se:"southeast"}; //"enum"
function drawFill (element, fillWith){
	element.attr({
		fill: fillWith
	})
}

function drawBorder (element, color, width){
	element.attr({
		stroke: color,
		strokeWidth: width
	});
}

function fadeoutAndRemove(element){
	element.animate({opacity:0}, 2000, undefined, function(){
		element.remove();
	});
}

//general
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Move this to general utils if you need to separate
function getCornerClosestTo(corner, candidates){
	var closest = {distance:999999999.9};
	candidates.forEach(function(coord){
		var distance = Math.sqrt(((corner.x-coord.x)*(corner.x-coord.x)) + ((corner.y-coord.y)*(corner.y-coord.y)));
		if(distance < closest.distance)
			closest = {distance:distance, coord:coord};
	});
	return closest.coord;
}

function getExamplePattern(board, player){
	if(player === null){
		var patternPath = board.path("M28,66L0,50L0,16L28,0L56,16L56,50L28,66L28,100");
		patternPath.attr({
			stroke:"#fff629",
			strokeWidth:2,
			fill:"none"
		});
		var patternPath2 = board.path("M28,0L28,34L0,50L0,84L28,100L56,84L56,50L28,34");
		patternPath2.attr({
			stroke:"#ffe503",
			strokeWidth:2,
			fill:"none"
		});
		var patternGroup = board.g(patternPath, patternPath2);
		var pattern = patternGroup.pattern(0,0,56, 100);
		return pattern;
	}
}