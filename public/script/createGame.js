
function createGame(){
	var socket = io.connect('http://localhost:5000');
	socket.emit("KNULLA", {jens:"balle"});
}

