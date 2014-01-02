
var addPlayer = function(player) {
	this.queue.push(user);
}

var getNextPlayer = function() {
	return null
}

var setCurrentPlayer = function (player) {

}

exports.Queue = function () {
	this.queue = []
	this.addPlayer = addPlayer
	this.getNextPlayer = getNextPlayer
	this.setCurrentPlayer = setCurrentPlayer
}