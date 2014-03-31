
var game = null;
var hexagons = [];
var colors = {'field':'#FFE658', 'forest':'#126B32', 'pasture':'#6DD572', 'mountain':'#5E707A', 'hill':'#E03634', 'desert':'#D5CC6A'};
function populateGameWithLogic(game) {
	game.addPlayer = function(playerId) {
		game.players.push(playerId);
	}
}

$ (document).ready(function(){
	var roomUrl = window.location.href.split("/").pop();
	var socket = io.connect('http://localhost:5000');
	socket.emit("room", {playerId:Math.random(), room:roomUrl})
	socket.on("game-joined", function(gameState){
		populateGameWithLogic(gameState);
		game = gameState;
		$("body").append("Successfully joined room: "+game.room);
		console.log(game);
		createEmptyBoard();
	});
	socket.on("room-404", function(data){
		// alert("THIS FUCKING ROOM DOESNT EXIST!!!")
	})
	socket.on("new-player-joined", function(playerId){
		$("body").append("<p>Player joined: "+playerId+"</p>");
		console.log(playerId);
		game.addPlayer(playerId);
	});
});

var hexDiameter = 105; //must find a way to find this dynamically if we want responsive
function createEmptyBoard(){
	var board = $(".board");
	var yMargin = 6;
	var yJump = hexDiameter/2 + yMargin;
	createRow(board,1,400,0);
	createRow(board,2,400-hexDiameter,yJump);
	createRow(board,3,400-(hexDiameter*2),yJump*2);
	createRow(board,2,400-hexDiameter,yJump*3);
	createRow(board,3,400-(hexDiameter*2),yJump*4);
	createRow(board,2,400-hexDiameter,yJump*5);
	createRow(board,3,400-(hexDiameter*2),yJump*6);
	createRow(board,2,400-hexDiameter,yJump*7);
	createRow(board,1,400,yJump*8);

	createRoadDivs (board);
	// createCityDivs ();
}

function createRow(board, size, startX, yCoordinate){
	for(var i=0;i<size;i++){
		var index = hexagons.length;
		var hex = game.hexes[index];
		var hexagon = createHexagonDiv(index, yCoordinate, startX+(i*(hexDiameter*2)), colors[hex.type]);
		if(hex.token !== null)
			hexagon.append($('<p>'+index+'</p>')); //index should be hex.token.value
		board.append(hexagon);
		hexagons.push(hexagon);
	}
}

function createRoadDivs (board){
	createdRoads = {};
	for(var i=0;i<hexagons.length;i++){
		var hex = hexagons[i];
		var roadCorners = createRoadsForHexagon (createdRoads, i, hex);
		roadCorners.forEach(function(cornerDiv){
			if(cornerDiv !== null)
				board.append (cornerDiv);
		});
	}
}

/*Hand-drawn roads for a hexagon. checks for previously existing road*/
/*
top = self - 5
bottom = self + 5
top-right = self-2
top-left= self - 3
bottom-left = self+2
bottom-right = self + 3

exceptions: index 0, 1, 2, 16, 14, 17, 18
*/
function createRoadsForHexagon (added, index, hex){
	var roads = [];
	// keep these separate in case we want to change layout later
	var hexHeight = hexDiameter;
	var hexWidth = hexDiameter;

	var topY = parseInt(hex.css('top').replace(/[^-\d\.]/g, ''));
	var middleY = topY + hexHeight/2;
	var bottomY = topY + hexHeight;

	var topLeftX = parseInt(hex.css('left').replace(/[^-\d\.]/g, ''));
	var leftX = topLeftX - hexWidth/4;
	var topRightX = topLeftX + hexWidth/2;
	var rightX = leftX + hexWidth;

	var up = -5;
	var down = 5;
	var upLeft = -3;
	var downLeft = 2;
	var upRight = -2;
	var downRight = 3;

	if(index === 0){
		down--;
		downLeft--;
		downRight--;
	}
	if(index === 1)
		upRight++;
	if(index === 2)
		upLeft++;
	if(index === 4)
		up++;
	if(index === 18){
		upLeft++;
		up++;
		upRight++;
	}
	if(index === 16)
		downRight--;
	if(index === 14)
		down--;
	if(index === 17)
		downLeft--;
	


	roads.push(createRoad(topRightX+26,topY+5, 30, false, index, index + upRight, added)); //top right
	roads.push(createRoad(topLeftX-23,topY+6, -30, false, index, index + upLeft, added)); // top left

	roads.push(createRoad(rightX,middleY+7, -30, false, index, index + downRight, added)); // bottom right
	roads.push(createRoad(leftX+4,middleY+6, 30, false, index, index + downLeft, added)); // bottom left

	roads.push(createRoad(topRightX-46.5,bottomY+3, 0, true, index, index + down, added)); //bottom
	roads.push(createRoad(topLeftX+5,topY-6, 0, true, index, index + up, added)); // top
	return roads;
}

function createRoad (x, y, skew, horizontal, index, neighbour, added){
	var key = ""+index+","+neighbour;
	if(index > neighbour)
		key = ""+neighbour+","+index;
	if(!(key in added))
		added[key] = true;
	else
		return null;
	var cornerDiv = $("<div></div>");
	cornerDiv.addClass("road");
	cornerDiv.css("top", ""+y+"px");
	cornerDiv.css("left", ""+x+"px");
	if(horizontal){
		cornerDiv.addClass("horizontal");
	}else{
		cornerDiv.css("-webkit-transform", "skew("+skew+"deg)");
	}
	cornerDiv.addClass("belongsTo"+index)
	return cornerDiv;
}

function hexClicked (index){
}

function createHexagonDiv (index, y, x, background){
	var hexagon = $("<div></div>");
	hexagon.on('click',function(){
		hexClicked(index);
	});
	hexagon.addClass ("hex");
	hexagon.css("background-color", background);
	hexagon.append($("<div class='corner-1'></div>"));
	hexagon.append($("<div class='corner-2'></div>"));
	hexagon.css("left", x);
	hexagon.css("top", y);
	return hexagon;
}



