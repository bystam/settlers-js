var cityLocations = {};
function createCityShapesFromMap(map){
	for(var row = 0; row < map.length; row++){
		for(var column=0; column < map[0].length; column++){
			var hexagon = map[row][column];
			if(hexagon !== null && hexagon.type !== 'ocean')
				createCityShapesForHex (map, hexagon);
		}
	}
}

function createCityShapesForHex(map, hexagon){
	var corners = getHexCorners(hexagon.shape);
	var neighbourList = getNeighbourListForHex(map, hexagon);
	for(var i=0;i<6;i++){
		var neighbours = [hexagon, neighbourList[(i+4)%6], neighbourList[(i+5)%6]];
		var cityCoords =
		getCoordsForCity(
			corners[i],
			[
				map[neighbours[1].row][neighbours[1].column],
				map[neighbours[2].row][neighbours[2].column]
			]);
		createCityShape(neighbours, cityCoords);
	}
}

function getCoordsForCity (firstCorner, hexes){
	var firstNeighbourCorner = getCornerClosestTo(firstCorner, getHexCorners(hexes[0].shape));
	var secondNeighbourCorner = getCornerClosestTo(firstCorner, getHexCorners(hexes[1].shape));
	return findMiddle(firstCorner, firstNeighbourCorner, secondNeighbourCorner);
}
//calculates the middle point of the triangle defined by the parameter coordinates
function findMiddle(a, b, c){
	var bcMidpoint = {x:((b.x+c.x)/2), y:((b.y+c.y)/2)};
	return {x:(a.x+(2/3*(bcMidpoint.x-a.x))), y:(a.y+(2/3*(bcMidpoint.y-a.y)))};
}

function createCityShape (hexes, coords){
	var radius = 7;
	hexes.sort(function(a,b){	//ascending
		if(a.row === b.row)
			return a.column - b.column;
		return a.row - b.row;
	});
	var cityNeighbours = [{row: hexes[0].row, col: hexes[0].column},
												{row: hexes[1].row, col: hexes[1].column},
												{row: hexes[2].row, col: hexes[2].column}];
	var cityKey = JSON.stringify(cityNeighbours);
	if(cityLocations[cityKey] !== undefined)//prevent doublettes
		return;
	var city = getSettlementShape(coords, null);

	cityLocations[cityKey] = city;
	city.click(function(){
		socket.emit(serverCommands.canBuildSettlement, cityNeighbours);
	});
	city.hover(function(){
		//TODO: This currently doesnt work properly, it is prone to get stuck
		var color = buildingColors[localPlayerId];
		city.originalStroke = city.attr("stroke");
		city.originalStrokeWidth = city.attr("strokeWidth");
		city.attr({
			stroke:color,
			strokeWidth:2
		});
	}, function(){
		// hover out
		city.attr({
			strokeWidth: city.originalStrokeWidth,
			stroke: city.originalStroke
		});
	})
}

function canPlaceCity(key){
	return true;
}

function placeCityWithAnimation (coords, playerId, isCity){
	var city = cityLocations[coords];
	if(isCity){
		city.unclick(null);
		city.unhover();
	}
	var stashCity = isCity ? stashObjects[playerId].cities.shift() : stashObjects[playerId].settlements.shift();
	stashCity.animate({cx:city.attr("cx"), cy:city.attr("cy")}, 1000, mina.bounce, function(){
		placeCity(coords, playerId, isCity);
		stashCity.remove();
	});
}

function placeCity(coords, playerId, isCity){
	var city = cityLocations[coords];
	if(isCity){
		var newShape = getCityShape({x:city.attr("cx"), y:city.attr("cy")}, playerId);
		city.remove();
		cityLocations[coords] = newShape;
	} else{
		city.click(function(){
			// TODO coords är en sträng här, men borde vara ett object
			socket.emit(serverCommands.canBuildCity, JSON.parse(coords));
		})
		city.attr(getCityGraphics(playerId));
	}
}

function getSettlementShape (coords, playerId){
	return getIntersectionShape(coords, playerId, 10);
}

function getCityShape (coords, playerId){
	return getIntersectionShape(coords, playerId, 13);
}

function getIntersectionShape (coords, playerId, radius){
	var shape = canvas.circle(coords.x, coords.y, radius);
	shape.attr(getCityGraphics(playerId));
	return shape;
}

function getCityGraphics (playerId){
	var majorColor = playerId !== null ? buildingColors[playerId] : "transparent";
	var minorColor = playerId !== null ? 'black' : "transparent";//tinycolor.complement(majorColor);//tinycolor.lighten(majorColor, amount = 10);
	return {stroke:minorColor, strokeWidth:1,fill:majorColor}
}
