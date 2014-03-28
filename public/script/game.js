$ (document).ready(function(){
	var roomUrl = window.location.href.split("/").pop();
	var socket = io.connect('http://localhost:5000');
	socket.emit("room", {playerId:Math.random(), room:roomUrl})
	socket.on("room-joined", function(data){
		$("body").append("Successfully joined room: "+data.room);
	});
	socket.on("new-player-joined", function(data){
		$("body").append("<p>Player joined: "+data.playerId+"</p>");
	});

});