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
		1, 4);
	tradePanel.left = left;
	tradePanel.stashCardsForTrade = [];
}

function addToTrade(resource){
	if(tradePanel.left.cards.length > 3)
		return;
	console.log(tradePanel.left.cards.length);
	var tempResource = tradePanel.left.addCard(resource.type, function(){removeFromTrade(resource)});
	tradePanel.stashCardsForTrade.push(resource);
	console.log("adding to trade");
	resource.border.attr({
		stroke:'black',
	});
	resource.unclick(null);
}

function removeFromTrade(resource){
	tradePanel.left.removeCards([resource.type], false);
	resource.unclick(null);
	resource.click(function(){
		addToTrade(resource);
	});
	resource.border.attr({
		stroke:buildingColors[resource.playerId]
	});
}

function displayTrade(from, to){
	//to is a list of options, from is what youre getting
}