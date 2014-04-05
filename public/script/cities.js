var cityLocations = {};
var debugC;
function createCityShapesFromMap(canvas, map){
	debugC = canvas;
	for(var row = 0;row<map.length;row++){
		for(var column=0;column<map[0].length;column++){
			var hexagon = map[row][column];
			if(hexagon !== null && hexagon.type !== 'ocean')
				createCityShapesForHex (canvas, map, hexagon);
		}
	}
}

function createCityShapesForHex(canvas, map, hexagon){
	var corners = getHexCorners(hexagon.shape);
	var neighbourList = getNeighbourListForHex(map, hexagon);
	for(var i=0;i<6;i++){
		var neighbours = [hexagon, neighbourList[(i+4)%6], neighbourList[(i+5)%6]];
		var cityCoords = 
		getCoordsForCity(
			corners[i],
			[map[neighbours[1].row][neighbours[1].column],
			map[neighbours[2].row][neighbours[2].column]]);
		createCityShape(canvas, neighbours, cityCoords);
	}
}

function getCoordsForCity (firstCorner, hexes){
	var firstNeighbourCorner = getCornerClosestTo(firstCorner, getHexCorners(hexes[0].shape));
	var secondNeighbourCorner = getCornerClosestTo(firstCorner, getHexCorners(hexes[1].shape));
	return findMiddle(firstCorner, firstNeighbourCorner, secondNeighbourCorner);
}

function findMiddle(a, b, c){
	var bcMidpoint = {x:((b.x+c.x)/2), y:((b.y+c.y)/2)};
	return {x:(a.x+(2/3*(bcMidpoint.x-a.x))), y:(a.y+(2/3*(bcMidpoint.y-a.y)))};
}

function createCityShape (canvas, hexes, coords){
	var radius = 7;
	hexes.sort(function(a,b){	//ascending
		if(a.row === b.row)
			return a.column - b.column;
		return a.row - b.row;
	});
	var cityKey = "["+hexes[0].row+","+hexes[0].column+"]["+hexes[1].row+","+hexes[1].column+"]["+hexes[2].row+","+hexes[2].column+"]";
	if(cityLocations[cityKey] !== undefined)//prevent doubles
		return;
	var city = canvas.circle(coords.x, coords.y, radius);
	city.attr({
		fill:"transparent"
	});

	cityLocations[cityKey] = city;
	city.click(function(){
		socket.emit(serverCommands.canBuildCity, cityKey);
	});
	city.hover(function(){
		//only do local check on hover
		var color = canPlaceCity(cityKey) ? "green" : "red";
		city.attr({
			stroke:color,
			strokeWidth:4
		});
	}, function(){
		// hover out
		city.attr({
			stroke:"transparent"
		});
	})
}

function canPlaceCity(key){
	return true;
}

function placeCityWithAnimation (coords, playerId, canvas){
	var city = cityLocations[coords];
	city.unclick(null);
	city.unhover();
	var stashCoords = stashLocations[playerId];
	var cityAnimation = canvas.circle(stashCoords.x, stashCoords.y, 7);
	cityAnimation.attr(getCityGraphics(playerId));
	cityAnimation.animate({cx:city.attr("cx"), cy:city.attr("cy")}, 3000, mina.bounce, function(){
		placeCity(coords, playerId);
		cityAnimation.remove();
	});
}

function placeCity(coords, playerId){
	var city = cityLocations[coords];
	city.unclick(null);
	city.unhover();
	city.attr(getCityGraphics(playerId));
}

function getCityGraphics (playerId){
	var majorColor = buildingColors[playerId];
	var minorColor = tinycolor.lighten(majorColor, amount = 20);
	return {stroke:minorColor, strokeWidth:2,fill:majorColor}
}

