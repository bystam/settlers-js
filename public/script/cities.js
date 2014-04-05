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
	console.log("building city at "+cityKey);
	var city = canvas.circle(coords.x, coords.y, radius);
	city.attr({
		fill:"transparent"
	});

	cityLocations[cityKey] = city;
	city.click(function(){
		console.log("City clicked between hex "+cityKey);
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

function placeCity (coords, playerId){
	console.log("coords: "+coords+", playerID: "+playerId);
	var city = cityLocations[coords];
	console.log(city);
	var animX = parseFloat(city.attr("cx"));
	console.log("animX: "+animX);
	animX = animX-100;

	city.unclick(null);
	var stashCity = stashLocations[playerId].clone();
	console.log("stashCity:");
	console.log(stashCity);

	stashCity.attr({
		stroke:"lightblue",
			strokeWidth:2,
			fill:"blue"
	});
	stashCity.animate({cx:city.attr("cx"), cy:city.attr("cy")}, 3000, mina.elastic, function(){
		city.attr({
			stroke:"lightblue",
			strokeWidth:2,
			fill:"blue"
		});
	});
	
}

