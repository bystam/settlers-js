var stashCoordinates = [{x:350,y:100}, {x:50,y:400}, {x:350, y:600}, {x:700, y:400}];
var cityLocations = {};
var stashLocations = {};
//probably move the stash specific code out of here, stash.js ?
function addStashLocation (board, playerId){
	var numStashes = Object.keys(stashLocations).length;
	var stashCoords = stashCoordinates[numStashes];
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
	//create ne city at all hexes...
	var coords = {x:corners[1].x+2, y:corners[1].y-2}
	createCityShape(board, coords, hex, [hex.neighbours.n, hex.neighbours.ne], cityRadius);

	//create sw city at all hexes
	var coords = {x:corners[4].x-2, y:corners[4].y+2}
	createCityShape(board, coords, hex, [hex.neighbours.sw, hex.neighbours.s], cityRadius);

	if(hex.neighbours.s === undefined){
		//create SE city
		var coords = {x:corners[5].x+2, y:corners[5].y-2}
		createCityShape(board, coords, hex, [hex.neighbours.se, undefined], cityRadius);
	}
	if(hex.neighbours.n === undefined){
		//create nw city
		var coords = {x:corners[2].x-2, y:corners[2].y-2}
		createCityShape(board, coords, hex, [hex.neighbours.nw, undefined], cityRadius);
	}
	if(hex.neighbours.sw === undefined && hex.neighbours.nw === undefined){
		//create w city
		var coords = {x:corners[3].x-2, y:corners[3].y}
		createCityShape(board, coords, hex, [undefined, undefined], cityRadius);
	}
	if(hex.neighbours.se === undefined && hex.neighbours.ne === undefined){
		//create e city
		var coords = {x:corners[6].x+2, y:corners[6].y}
		createCityShape(board, coords, hex, [undefined, undefined], cityRadius);
	}
}


function createCityShape (board, coords, hex, neighbours, radius){
	var first = hex.boardIndex, second = hex.boardIndex, third = hex.boardIndex;
	if(neighbours !== null){
		first = neighbours[0]; second = neighbours[1]; 
	}
	var cityKey = ""+first+","+second+","+third; //maybe replace with a proper coord system...
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
			strokeWidth:3,
			fill:"blue"
	});
	stashCity.animate({cx:city.attr("cx"), cy:city.attr("cy")}, 3000, mina.easein, function(){
		city.attr({
			stroke:"lightblue",
			strokeWidth:3,
			fill:"blue"
		});
	});
	
}

