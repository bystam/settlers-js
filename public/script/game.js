
function populateGameWithLogic(game) {
	game.addPlayer = function(playerId) {
		game.players.push(playerId);
	}
}
var game = null;

$ (document).ready(function(){
	createEmptyBoard();
	var roomUrl = window.location.href.split("/").pop();
	var socket = io.connect('http://localhost:5000');
	socket.emit("room", {playerId:Math.random(), room:roomUrl})
	socket.on("game-joined", function(gameState){
		populateGameWithLogic(gameState);
		game = gameState;
		$("body").append("Successfully joined room: "+game.room);
		console.log(game);
	});
	socket.on("room-404", function(data){
		alert("THIS FUCKING ROOM DOESNT EXIST!!!")
	})
	socket.on("new-player-joined", function(playerId){
		$("body").append("<p>Player joined: "+playerId+"</p>");
		console.log(playerId);
		game.addPlayer(playerId);
	});
});
var hexagons = [];
function createEmptyBoard(){
	var board = $(".board");
	var height = "55px";
	var width = "100px";
	for(var i = 0;i<5;i++){
		var hexagon = createHexagon(i);
		board.append(hexagon);
		hexagons.push(hexagon);
	}
}

function createHexagon (index){
	var hexagon = $("<div></div>");
	hexagon.addClass ("hex");
	hexagon.css("background-color", '#'+Math.floor(Math.random()*16777215).toString(16));
	hexagon.append($("<div class='corner-1'></div>"));
	hexagon.append($("<div class='corner-2'></div>"));
	return hexagon;
}