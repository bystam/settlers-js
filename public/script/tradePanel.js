var tradePanel;
function drawTradePanel (canvas){
	tradePanel = canvas.rect(350,0,480,120, 10, 10);
	tradePanel.attr({
		fill:'transparent',
		stroke:'black',
		strokeWidth:3
	});
	var left = getCardArea(
		canvas, 370, 20, 50, 
		localPlayerId, true, undefined,
		1, 5);
	tradePanel.left = left;
	tradePanel.stashCardsForTrade = [];
}

function addToTrade(resource){
	if(tradePanel.left.cards.length > 3)
		return;
	console.log("adding to trade");
	var tempResource = tradePanel.left.createCardOfType(resource.cardType, function(){removeFromTrade(resource)});
	stashObjects[resource.playerId].resourceCards.removeCards([resource.cardType], false);
	tradePanel.stashCardsForTrade.push(resource);
}

function removeFromTrade(resource){
	tradePanel.left.removeCards([resource.cardType], false);
	addResources([resource.cardType], resource.playerId);
}

function displayTrade(from, to){
	//to is a list of options, from is what youre getting
}