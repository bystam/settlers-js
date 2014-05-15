var newTurnButton, coloredUnderlay, dices;
function createNewTurnButton(socket, middleX){
	var buttonWidth = 100;
	var buttonX = 60;
	var buttonY = 600;
	var buttonHeight = 80;
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
		if(gameStarted){
			socket.emit(serverCommands.endTurn, {});
		} else{
			socket.emit(serverCommands.startGame, {});
		}
		newTurnButton.animate({"x":buttonX, "y":buttonY+3}, 200, undefined, function(){
			newTurnButton.animate({"x":buttonX, "y":buttonY}, 200, undefined, function(){});
		});
	});
}

function displayNewTurn (diceToDisplay, currentPlayer){
	var boardWidth = parseInt(canvas.attr("width").substring(0, canvas.attr("width").length - 2));
	var boardHeight = parseInt(canvas.attr("height").substring(0, canvas.attr("height").length - 2));
	
	var color = buildingColors[currentPlayer];
	if(!coloredUnderlay){
		createnewTurnColoredUnderlay(color);
	}
	coloredUnderlay.attr({fill:color});
	// keep this commented until a workaround for chrome bug is found
	// coloredUnderlay.animate({r:(newTurnButton.width*2)}, 500, mina.easein, function(){
	// 	coloredUnderlay.animate({r:(newTurnButton.width)}, 500, mina.easein, function(){})
	// })
	if(diceToDisplay)
		rollDice(diceToDisplay);
}

function createnewTurnColoredUnderlay(color){
	coloredUnderlay = canvas.circle(newTurnButton.x + (newTurnButton.width/2), newTurnButton.y+(newTurnButton.height/2), newTurnButton.width);
	coloredUnderlay.attr({
		fill:color,
		opacity:0.3,
	});
	canvas.prepend(coloredUnderlay);
}

function rollDice(diceToDisplay){
	count = 0;
	var timeout = function(){
		setTimeout(function(){
			if(count > 10){
				dices.setDice(diceToDisplay.first, diceToDisplay.second);
			} else{
				dices.setDice(getRandomInt(1,6), getRandomInt(1,6));
				count++;
				timeout();
			}
		}, 100);
	}
	timeout();
}



function drawStartGameButton(){
	var text = canvas.text(newTurnButton.x, newTurnButton.y-10, "START");
	text.attr({
		fontSize:30,
		stroke:'transparent',
		fontFamily:'Comic sans, Arial'
	});
	newTurnButton.startText = text;
}

function startGame(){
	newTurnButton.startText.remove();
	gameStarted = true;
}

function drawDices(){
	var dicePositions = {one:230, two:290}
	dices = 
	{
		one:getDiceShape(dicePositions.one, 0), 
		two:getDiceShape(dicePositions.two, 0)
	};
	dices.setDice = function(first, second){
		dices.one.remove();
		dices.two.remove();
		dices.one = getDiceShape(dicePositions.one, first);
		dices.two = getDiceShape(dicePositions.two, second);
	}
}

function getDiceShape(x, number){
	var diceShape = canvas.rect(x, 620, 50, 50, 5, 5);
	drawFill(diceShape, 'white');
	var dots = getDots(x, 620, 50, number);
	return canvas.g(diceShape, dots);
}

function getDots(x,y,width, number){
	var radius = 6;
	var xMargin = 8;
	var yMargin = 8;
	var dots = {
		nw:function(){ return getDot(x+xMargin, y+yMargin, radius)},
		sw:function(){ return getDot(x+xMargin, y-yMargin+width, radius)},
		ne:function(){ return getDot(x-xMargin+width, y+yMargin, radius)},
		se:function(){ return getDot(x-xMargin+width, y-yMargin+width, radius)},
		w:function(){ return getDot(x+xMargin, y+(width/2), radius)},
		e:function(){ return getDot(x-xMargin+width, y+(width/2), radius)},
		mid:function(){ return getDot(x+(width/2), y+(width/2), radius)},
	}
	switch(number){
		case 0: return canvas.g();
		case 1: return canvas.g(dots.mid());
		case 2: return canvas.g(dots.sw(), dots.ne());
		case 3: return canvas.g(dots.nw(), dots.mid(), dots.se());
		case 4: return canvas.g(dots.nw(), dots.sw(), dots.ne(), dots.se());
		case 5: return canvas.g(dots.nw(), dots.sw(), dots.ne(), dots.se(), dots.mid());
		case 6: return canvas.g(dots.nw(), dots.sw(), dots.ne(), dots.se(), dots.w(), dots.e());
	}
}

function getDot(x, y, radius){
	var dot = canvas.circle(x, y, radius);
	var gradient = canvas.gradient("r(0.5, 0.5, 0.5)#fff-#000");
	drawFill(dot, gradient);
	return dot;
}



