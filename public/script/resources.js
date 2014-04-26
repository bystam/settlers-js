
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
	unremoved = stashObjects[playerId].resourceCards.removeCards(toRemove, function(unremoved){
		if(unremoved.length > 0)
			tradePanel.left.removeCards(unremoved, function{});
	});
}

function addResources(resources, playerId){
	var toAdd = [];
	for(resource in resources){
		var amount = resources[resource];
		for(var i=0;i<amount;i++)
			toAdd.push(""+resource);
	}
	addResourcesList(toAdd, playerId);
}
function addResourcesList(toAdd, playerId){
	toAdd.forEach(function(resource){
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
	tradePanel.left.removeCards(toRemove, function(){});
}
