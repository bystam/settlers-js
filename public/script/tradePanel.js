var tradePanel;

//move some stuff out of here - keep drawing code, remove trade code
function drawTradePanel (){
	tradePanel = canvas.rect(350,5,480,100, 10, 10);
	tradePanel.attr({
		fill:'transparent',
		stroke:'black',
		strokeWidth:3
	});
	tradePanel.left = getCardArea(
		370, 20, localPlayerId, true, undefined,
		1, 6);
	var resourceTypes = ['grain', 'wool', 'ore', 'brick', 'lumber'];
	tradePanel.currentTrade = {resourceTypes:[], borders:[]};
	drawPanelButtons(resourceTypes);
	drawPostTradeButtons(350, 110);
}

function drawPostTradeButtons(x, y){
	var chestUrl = getImageUrl('treasure');
	var stockTradeButton = canvas.image(chestUrl, x, y, 70, 70);
	setSepia(stockTradeButton, 1.0);
	
	stockTradeButton.enableTrade = function(){
		setSepia(stockTradeButton, 0.0);
		removeMouseHandlers(stockTradeButton);
		//havent decided what feels best, regular clickhandler or responsive?
		stockTradeButton.mousedown(function(){
			stockTradeButton.animate({"x":x+3, "y":y+3}, 70, undefined, function(){});
		});
		stockTradeButton.mouseup(function(){
			tradeWithStock();
			stockTradeButton.animate({"x":x, "y":y}, 70, undefined, function(){});
		});
		stockTradeButton.mouseout(function(){
			stockTradeButton.animate({"x":x, "y":y}, 70, undefined, function(){});
		})
		// stockTradeButton.click(function(){
		// 	tradeWithStock();
		// 	stockTradeButton.animate({"x":x+3, "y":y+3}, 70, undefined, function(){
		// 		stockTradeButton.animate({"x":x, "y":y}, 70, undefined, function(){});
		// 	});
		// });
	}
	stockTradeButton.disableTrade = function(){
		setSepia(stockTradeButton, 1.0);
		removeMouseHandlers(stockTradeButton);
	}
	tradePanel.stockTradeButton = stockTradeButton;

	var playerTradeIconUrl = getImageUrl('bystam');
	var playerTradeButton = canvas.image(playerTradeIconUrl, x+75, y, 70, 70);
	// Super important code below DO NOT TOUCH
	setSepia(playerTradeButton, 1.0);
	var fiddy = true;
	playerTradeButton.dblclick(function(){
		if(fiddy)
			setSepia(playerTradeButton, 0.0);
		else
			setSepia(playerTradeButton, 1.0);
		var movementX = fiddy ? -1 : 1;
		movementX *= getRandomInt(0,100);
		var movementY = fiddy ? -1 : 1;
		movementY *= getRandomInt(0,100);
		playerTradeButton.animate({x:(x+75+movementX), y:y+movementY}, 3000, mina.elastic, function(){
			var bubble = canvas.rect ((x+55+movementX)-80, y+movementY-60, 270, 50, 50, 50);
			drawFill(bubble, 'white');
			var swx = x+55+movementX+50;
			var swy = y+movementY-12;
			var wedge = canvas.polyline([swx, swy, swx+10, swy+10, swx+20, swy, swx, swy]);
			drawFill(wedge, 'white');
			var text = canvas.text((x+55+movementX)-60, y+movementY-25, "SUCH ANIMATE");
			text.attr({fontSize:30});
			var grp = canvas.g(bubble, wedge, text);
			grp.attr({transform:playerTradeButton.attr('transform')});
			grp.animate({opacity:0}, 3000, mina.linear, function(){
				grp.remove();
			})
		});
		fiddy = !fiddy;
		postPlayerTrade();
	});
	playerTradeButton.drag();
}

function removeMouseHandlers(button){
	button.unclick(null);
	button.unmousedown(null);
	button.unmouseup(null);
}

function updateTradeButtons (){
	if(tradePanel.left.cards.length < 1){
		tradePanel.stockTradeButton.disableTrade();
		return;
	}

	var resourceType = tradePanel.left.cards[0].cardType;
	if(canStockTrade(resourceType) && 
		tradePanel.currentTrade.resourceTypes.length > 0)
		tradePanel.stockTradeButton.enableTrade();
	else
		tradePanel.stockTradeButton.disableTrade();
}

function drawPanelButtons(types){
	var buttonWidth = 60;
	var originX = 350 - buttonWidth -10;
	var rect = {x:originX, y:5, width:buttonWidth, height:60};
	for (var i = 1; i <= types.length; i++) {
		var type = types[i-1];
		drawResourceButton(type, rect);
		rect.x = rect.x - rect.width - 4;
		if(i % 3 === 0){
			rect.y = rect.y + rect.height + 4;
			rect.x = originX;
		}
	};
}
//todo later...
function postPlayerTrade(){
	// clearSelectedTradeResources();
}

function tradeWithStock(){
	var data = 
		{
			fromResource:tradePanel.left.cards[0].cardType, 
			toResource:tradePanel.currentTrade.resourceTypes[0]
		}
	socket.emit(serverCommands.stockTrade, data);
	clearSelectedTradeResources();
}

function performTrade (data){
	tradeAwayResources(data.cost);
	addResources(data.gained, localPlayerId);
	updateTradeButtons();
}

//todo
function clearSelectedTradeResources(){
	tradePanel.currentTrade.resourceTypes = [];
	tradePanel.currentTrade.borders.forEach(function(border){
		border.remove();
	});
	tradePanel.currentTrade.borders = [];
}

function drawResourceButton(type, resourceRect){
	var rect = {x:resourceRect.x, y:resourceRect.y, width:resourceRect.width, height:resourceRect.height};
	var imageUrl = '../img/'+type+'.png';
	var image = canvas.image(imageUrl,rect.x, rect.y, rect.width, rect.height);
	image.click(function(){
		if(tradePanel.currentTrade.resourceTypes.length > 0)
			clearSelectedTradeResources();
		tradePanel.currentTrade.resourceTypes.push(type);
		var border = canvas.rect(rect.x, rect.y, rect.width, rect.height,6,6);
		drawBorder(border, 'black', 2);
		drawFill(border, 'transparent');
		tradePanel.currentTrade.borders.push(border);
		updateTradeButtons();
	});
}

function addToTrade(resource){
	if(tradePanel.left.cards.length > 4)
		return;
	if(tradeContainsOther(resource))
		return;
	var tempResource = tradePanel.left.createCardOfType(resource.cardType, function(){removeFromTrade(resource)});
	payResourcesList([resource.cardType], localPlayerId);
	updateTradeButtons();
}

function canStockTrade(resource){
	var counter = 0;
	for (var i = tradePanel.left.cards.length - 1; i >= 0; i--) {
		if(tradePanel.left.cards[i].cardType === resource)
			counter++;
	};
	return counter > 2;
}

function tradeContainsOther(resource){
	for (var i = tradePanel.left.cards.length - 1; i >= 0; i--) {
		if(tradePanel.left.cards[i].cardType !== resource.cardType)
			return true;
	};
	return false;
}

function removeFromTrade(resource){
	tradePanel.left.removeCards([resource.cardType], function(){});
	addResourcesList([resource.cardType], resource.playerId);
	updateTradeButtons();
}

function displayTrade(from, to){
	//to is a list of options, from is what youre getting
}