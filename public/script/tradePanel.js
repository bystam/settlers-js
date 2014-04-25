var tradePanel;
function drawTradePanel (canvas){
	tradePanel = canvas.rect(350,5,480,100, 10, 10);
	tradePanel.attr({
		fill:'transparent',
		stroke:'black',
		strokeWidth:3
	});
	var left = getCardArea(
		canvas, 370, 20, 50, 
		localPlayerId, true, undefined,
		1, 6);
	tradePanel.left = left;
	var resourceTypes = ['grain', 'wool', 'ore', 'brick', 'lumber'];
	tradePanel.currentTrade = {resourceTypes:[], borders:[]};
	drawPanelButtons(canvas, 325, 8, resourceTypes);
	drawPostTradeButtons(canvas, 350, 110);
}

function drawPostTradeButtons(canvas, x, y){
	// var stockTradeButtonShadow = canvas.rect(x, y+6, 70, 20);
	// stockTradeButtonShadow.attr({fill:'pink', strokeWidth:2, stroke:'black'});
	var stockTradeButton = canvas.rect(x, y, 70, 20);
	stockTradeButton.attr({fill:'red', strokeWidth:2, stroke:'black'});
	
	stockTradeButton.enableTrade = function(){
		drawFill(stockTradeButton, 'green');
		stockTradeButton.click(function(){
			tradeWithStock();
			stockTradeButton.animate({"x":x+3, "y":y+3}, 70, undefined, function(){
				stockTradeButton.animate({"x":x, "y":y}, 70, undefined, function(){});
			});
		});
	}
	stockTradeButton.disableTrade = function(){
		drawFill(stockTradeButton, 'red');
		stockTradeButton.unclick(null);
	}
	tradePanel.stockTradeButton = stockTradeButton;

	var playerTradeButton = canvas.rect(x+75, y, 70, 20);
	playerTradeButton.attr({fill:'transparent', strokeWidth:2, stroke:'black'});
	playerTradeButton.click(function(){
		postPlayerTrade();
	});
}

function drawPanelButtons(canvas, x, y, types){
	var rect = {x:x,y:y, width:18, height:18};
	for (var i = types.length - 1; i >= 0; i--) {
		var type = types[i];
		drawResourceButton(canvas, type, rect);
		rect.y = rect.y + rect.height + 4;
	};
}
//todo later...
function postPlayerTrade(){
	clearTrade();
}

function tradeWithStock(){
	socket.emit(serverCommands.stockTrade, 
		{
			fromResource:tradePanel.left.cards[0].cardType, 
			toResource:tradePanel.currentTrade.resourceTypes[0]
		});
	clearTrade();
}

//todo
function clearTrade(){
	tradePanel.currentTrade.resourceTypes = [];
	tradePanel.currentTrade.borders.forEach(function(border){
		border.remove();
	});
	tradePanel.currentTrade.borders = [];
}

function drawResourceButton(canvas, type, resourceRect){
	var rect = {x:resourceRect.x, y:resourceRect.y, width:resourceRect.width, height:resourceRect.height};
	var imageUrl = '../img/'+type+'.png';
	var image = canvas.image(imageUrl,rect.x, rect.y, rect.width, rect.height);
	image.click(function(){
		if(tradePanel.currentTrade.resourceTypes.length > 0)
			return;
		tradePanel.currentTrade.resourceTypes.push(type);
		var border = canvas.rect(rect.x, rect.y, rect.width, rect.height,2,2);
		border.attr({fill:'transparent', strokeWidth:2, stroke:'black'});
		tradePanel.currentTrade.borders.push(border);
	});
}

function addToTrade(resource){
	if(tradePanel.left.cards.length > 4)
		return;
	if(tradeContainsOther(resource))
		return;
	var tempResource = tradePanel.left.createCardOfType(resource.cardType, function(){removeFromTrade(resource)});
	stashObjects[resource.playerId].resourceCards.removeCards([resource.cardType], false);
	if(canStockTrade(resource))
		tradePanel.stockTradeButton.enableTrade();
}

function canStockTrade(resource){
	var counter = 0;
	for (var i = tradePanel.left.cards.length - 1; i >= 0; i--) {
		if(tradePanel.left.cards[i].cardType === resource.cardType)
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
	tradePanel.left.removeCards([resource.cardType], false);
	addResources([resource.cardType], resource.playerId);
	if(!canStockTrade(resource))
		tradePanel.stockTradeButton.disableTrade();
}

function displayTrade(from, to){
	//to is a list of options, from is what youre getting
}