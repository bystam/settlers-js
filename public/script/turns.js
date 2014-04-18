var newTurnButton;
var end;
function createNewTurnButton(socket, canvas, middleX){
	var buttonWidth = 100;
	var buttonX = 60;
	var buttonY = 600;
	var buttonHeight = 50;
	var shadow = canvas.rect(buttonX, buttonY+6, buttonWidth, buttonHeight, 10, 10);
	shadow.attr({
		fill:'#458B00',
	});
	newTurnButton = canvas.rect(buttonX, buttonY, buttonWidth, buttonHeight, 10, 10);

	newTurnButton.y = buttonY;
	newTurnButton.x = buttonX;
	newTurnButton.width = buttonWidth;
	newTurnButton.height = buttonHeight
	newTurnButton.attr({
		fill:'#66CD00'
	});
	newTurnButton.click(function(){
		socket.emit(serverCommands.endTurn, {});
		newTurnButton.animate({"x":buttonX, "y":buttonY+3}, 70, undefined, function(){
			newTurnButton.animate({"x":buttonX, "y":buttonY}, 70, undefined, function(){});
		});
	});

	
}

function displayNewTurn (canvas, dices, currentPlayer){
	var boardWidth = parseInt(canvas.attr("width").substring(0, canvas.attr("width").length - 2));
	var boardHeight = parseInt(canvas.attr("height").substring(0, canvas.attr("height").length - 2));
	
	var color = buildingColors[currentPlayer];
	if(!end){
		var overlay = canvas.circle(newTurnButton.x + (newTurnButton.width/2), newTurnButton.y+(newTurnButton.height/2), newTurnButton.width);
		end = canvas.g(overlay);
		end.attr({
			fill:color,
			opacity:0.3,
		});
		canvas.prepend(end);
	}
	end.animate({opacity:0.3, fill: color}, 2000, undefined, function(){
	});
}
