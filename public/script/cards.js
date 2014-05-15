
/*
Card area
Is responsible for keeping track of and reshuffling (when neccessary) cards
that are created inside it. Moving cards around, for example from the trade
panel to the stash area, is done by removing the cards at the origin
and adding them at the destination.

This means that we can't control exactly which shape is moved, but also
means we don't need to keep track of individual shapes, only their types.

*/


function getCardArea(cornerX, cornerY, playerId, isLocalPlayer, areaBelow, maxRows, maxColumns){
	var area = {cards:[], shapeGroup:canvas.g(), corner:{x:cornerX, y:cornerY}, startCorner:{x:cornerX, y:cornerY}};
	if(!areaBelow)
		areaBelow = {setYPosition:function(){}};
	area.maxRows = isLocalPlayer ? maxRows : 1;
	area.maxColumns = maxColumns;
	var cardWidth = 50;
	var cardHeight = cardWidth * (4/3);
	var dimensions = {width:cardWidth, height:cardHeight};
	var xJump = cardWidth - 15;
	var yJump = isLocalPlayer ? cardHeight + 20 : cardHeight + 5;

	//Place the given shape in this areas array
	area.addCard = function(cardShape){
		area.updatePosition();
		area.cards.push(cardShape);
		area.shapeGroup.add(cardShape);
	}
	//create a card of a given type, with an optional function when clicked,
	//and add it to this area
	area.createCardOfType = function(type, clickFunction){
		if(area.position.row >= area.maxRows){
			return;
		}
		var shape = getCardShape(
			dimensions, playerId, 
			isLocalPlayer, type, clickFunction);
		area.addCard(shape);
		return shape;
	}
	//Update where this area will put the next card added to it
	area.updateDimensions = function (){
		dimensions.x = area.corner.x + (area.position.column-1)*xJump;
		dimensions.y = area.corner.y + area.position.row*yJump;
		areaBelow.setYPosition (dimensions.y + yJump);
	}
	//Update which row/column this area will put the next card added to it
	area.updatePosition = function(){
		if(area.position.column % area.maxColumns == 0){
			area.position.row++;
			area.position.column = 0;
		}
		area.position.column++;
		area.updateDimensions();
	}
	//Remove the cards, specified as card types ("names")by the cards array
	//the callback is executed with an array containing the cards which
	//were specified for removal, but could not be found in this area (if any)
	area.removeCards = function(cards, callback){
		var toRemove = canvas.g();
		var removingFromTradePanel = false;
		var nonexistent = [];
		cards.forEach(function (card){
			var cardToRemove = area.removeCard(card);
			if(cardToRemove)
				toRemove.add(cardToRemove);
			else
				nonexistent.push(card);
		});
		toRemove.remove();
		area.reshuffle();
		callback(nonexistent);
	}
	//remove a specific card form this areas array
	//(only for internal use)
	area.removeCard = function(card){
		for(var i=area.cards.length-1;i>=0;i--){
			if(area.cards[i].cardType == card){
				var toRemove = area.cards[i];
				area.cards.splice(i, 1);
				return toRemove;
			}
		}
	}
	//reshuffle the cards in this area
	area.reshuffle = function (){
		area.reset();
		area.cards.forEach(function(card){
			card.border.animate({x:dimensions.x, y:dimensions.y}, 500, mina.easein, function(){});
			card.image.animate({x:dimensions.x, y:dimensions.y}, 500, mina.easein, function(){});			
			area.updatePosition();
		});
	}
	//reset the position of the current card pointer (where to put the next
	//added card)
	area.reset = function (){
		area.position = {row:0, column:1};
		area.corner = {x:area.startCorner.x, y:area.startCorner.y};
		area.updateDimensions();
		areaBelow.setYPosition(cornerY);
	}

	//Move the starting point of this area to the given y position
	//Used for moving down an area below another area when it grows
	area.setYPosition = function (yPos){
		if(area.startCorner.y != yPos){
			area.startCorner.y = yPos;
			area.reshuffle();
		}
	}
	area.reset();
	return area;
}

function getCardShape (dimensions, playerId, isLocalPlayer, type, clickFunction){
	var image = canvas.image(getImageUrl(type), dimensions.x, dimensions.y, dimensions.width, dimensions.height);
	setSepia(image, 0.5);

	var border = canvas.rect(dimensions.x, dimensions.y, dimensions.width, dimensions.height, 10, 10);
	drawBorder(border, buildingColors[playerId], 2);
	drawFill(border, 'transparent');

	var card = canvas.g(image, border);
	card.image = image;
	card.border = border;
	card.cardType = type;
	card.playerId = playerId;
	if(isLocalPlayer){
		card.hover(function (){
			enlargeCard(card, dimensions);
		}, function (){
			shrinkCard(card, dimensions);
		})
	}
	var click = clickFunction ? function(){clickFunction(card)} : function(){ addToTrade(card)};
	card.click(click);
	return card;
}