
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