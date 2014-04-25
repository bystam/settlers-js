
function payResources(resources, playerId){
	var toRemove = [];
	for(resource in resources){
		var amount = resources[resource];
		for(var i=0;i<amount;i++)
			toRemove.push(""+resource);
	}
	payResourcesList(toRemove, playerId);
}

function payResourcesList(toRemove, playerId){
	unremoved = stashObjects[playerId].resourceCards.removeCards(toRemove, false);
	if(unremoved.length > 0)
		tradePanel.left.removeCards(unremoved);
}

function addResources(resources, playerId){
	resources.forEach(function(resource){
		stashObjects[playerId].resourceCards.createCardOfType (resource);
	});
}

function tradeAwayResources(resources){
	var toRemove = [];
	for(resource in resources){
		var amount = resources[resource];
		for(var i=0;i<amount;i++)
			toRemove.push(""+resource);
	}
	tradePanel.left.removeCards(toRemove);
}
