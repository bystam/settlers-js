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
	socket.on(serverCommands.canBuildCity, function(data){
			if(data.type === "click"){
				if(data.allowed)
					placeCity(city);
			} if(data.type === "hover"){
				if(data.allowed)
					drawBorder(city, "green", 4);
				else
					drawBorder(city, "red", 4);
			}
		});

	city.click(function(){
		console.log("City clicked between hex "+cityKey);
		socket.emit(serverCommands.canBuildCity, {key:cityKey, type:"click"});
		//remove when backend is done
		if(canPlaceCity (cityKey)){
			placeCity (city);
		} else{
			console.log("can't build city there");
		}
		//////////////
	});

	city.hover(function(){
		socket.emit(serverCommands.canBuildCity, {key:cityKey, type:"hover"})
		//remove when backend is done
		var color = canPlaceCity(cityKey) ? "green" : "red";
		city.attr({
			stroke:color,
			strokeWidth:4
		});
		/////////////////
	}, function(){
		// hover out
		city.attr({
			stroke:"transparent"
		});
	})
}

function canPlaceCity(key){
	if(Math.random() > 0.5)
		return true;
	return false;}

function placeCity (road){
	road.hover(function(){
		console.log("hovering in on built city...");
	}, function(){
		console.log("hovering out on built city...");
	})
	road.attr({
		stroke:"lightblue",
		strokeWidth:3,
		fill:"blue"
	});
}

