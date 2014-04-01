function drawFill (element, fillWith){
	element.attr({
		fill: fillWith;
	})
}

function drawBorder (element, color, width){
	element.attr({
		stroke: color,
		strokeWidth: width
	});
}