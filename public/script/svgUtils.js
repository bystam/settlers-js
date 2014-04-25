
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

function getImageUrl(type){
	return '../img/'+type+'.png';
}

function fadeoutAndRemove(element){
	element.animate({opacity:0}, 2000, undefined, function(){
		element.remove();
	});
}

function setSepia(canvas, element, amount){
	var filter = canvas.filter(Snap.filter.sepia(amount));
	element.attr({
		filter:filter
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

function enlargeCard(card, dimensions){
	card.image.attr({
		width: dimensions.width*(3/2),
		height: dimensions.height*(6/5)
	});
	card.border.attr({
		width: dimensions.width*(3/2),
		height: dimensions.height*(6/5)
	});
	card.parentGroup = card.parent();
	card.parent().after(card);
}

function shrinkCard(card, dimensions){
	card.image.attr({
		width: dimensions.width,
		height: dimensions.height
	});
	card.border.attr({
		width: dimensions.width,
		height: dimensions.height
	});
	card.parentGroup.append(card);
}

