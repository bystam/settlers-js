var stashCoordinates = [{x:350,y:100}, {x:50,y:400}, {x:350, y:600}, {x:700, y:400}, {x:10, y:10}, {x:10, y:10}, {x:10, y:10}, {x:10, y:10}];
var cityLocations = {};
var stashLocations = {};
//probably move the stash specific code out of here, stash.js ?
function addStashLocation (board, playerId){
	var numStashes = Object.keys(stashLocations).length;
	var stashCoords = stashCoordinates[numStashes];
	console.log(numStashes);
	var cityShape = board.circle(stashCoords.x, stashCoords.y, 10);
	cityShape.attr({
		fill:"transparent"
	})
	stashLocations[playerId] = cityShape
}

function initializePlayerStashes (game, board){
	game.players.forEach(function(playerId){
		addStashLocation(board, playerId);
	});
}

function createCitiesForHex(board, hex, cityRadius){
	var corners = getHexCorners(hex);
	//create ne city
	var coords = {x:corners[1].x+2, y:corners[1].y-2}
	createCityShape(board, coords, [hex.boardIndex, hex.neighbours.n, hex.neighbours.ne], cityRadius);
	//create nw city
	var coords = {x:corners[2].x-2, y:corners[2].y-2}
	createCityShape(board, coords, [hex.boardIndex, hex.neighbours.n, hex.neighbours.nw], cityRadius);
	//create w city
	var coords = {x:corners[3].x-2, y:corners[3].y}
	createCityShape(board, coords, [hex.boardIndex, hex.neighbours.nw, hex.neighbours.sw], cityRadius);
	//create sw city
	var coords = {x:corners[4].x-2, y:corners[4].y+2}
	createCityShape(board, coords, [hex.boardIndex, hex.neighbours.sw, hex.neighbours.s], cityRadius);
	//create se city
	var coords = {x:corners[5].x+2, y:corners[5].y+2}
	createCityShape(board, coords, [hex.boardIndex, hex.neighbours.se, hex.neighbours.s], cityRadius);
	//create e city
	var coords = {x:corners[6].x+2, y:corners[6].y}
	createCityShape(board, coords, [hex.boardIndex, hex.neighbours.ne, hex.neighbours.se], cityRadius);
}


function createCityShape (board, coords, hexes, radius){
	hexes.sort(function(a,b){return a-b}); //ascending
	var cityKey = ""+hexes[0]+","+hexes[1]+","+hexes[3]; //maybe replace with a proper coord system...
	if(cityLocations[cityKey] !== undefined)//prevent doubles
		return;
	var city = board.circle(coords.x, coords.y, radius);
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

