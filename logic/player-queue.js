
var addPlayer = function(user) {
	this.queue.push(user);
}

exports.Queue = function () {
	this.queue = []
	this.addPlayer = addPlayer;
}