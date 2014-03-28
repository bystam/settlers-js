$ (document).ready(function(){
	var roomUrl = window.location.href.split("/").pop();
	io.emit("room", {playerId:Math.random(), room:roomUrl})
	io.on("room-joined", function(data){
		$("body").append("Successfully joined room: "+data.room);
	});
	io.on("new-player-joined", function(data){
		$("body").append("Player joined: "+data.playerId);
	});

});