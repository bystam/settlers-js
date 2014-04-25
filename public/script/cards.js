
/*works for now, but could use refactoring.

*/

/*
How things *should* work:

Stash - responsible for creating new cards and keeping track
of total inventory. Needs to know which cards are up for trade.

methods:
CreateCard(type)
payCards(type[])
tradeAwayCards(type[])

CardBox - responsible for updating position of cards inside it
3 cardboxes - tradePanel, resource cards and dev cards

methods:
addCard(shape){
	shape.attr(x,y) (kanske animera...)
}
removeCard(type){
	ta bort firsta besta av samma typ
}


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

	area.addCard = function(cardShape){
		if(area.position.row >= area.maxRows){
			return;
		}
		area.updatePosition();
		area.cards.push(cardShape);
		area.shapeGroup.add(cardShape);
	}

	area.createCardOfType = function(type, clickFunction){
		var shape = getShape(
			dimensions, stashObjectTypes.card, 
			playerId, isLocalPlayer, {cardType:type, clickFunction:clickFunction});
		area.addCard(shape);
		return shape;
	}

	area.updateDimensions = function (){
		dimensions.x = area.corner.x + (area.position.column-1)*xJump;
		dimensions.y = area.corner.y + area.position.row*yJump;
		areaBelow.setYPosition (dimensions.y + yJump);
	}

	area.updatePosition = function(){
		if(area.position.column % area.maxColumns == 0){
			area.position.row++;
			area.position.column = 0;
		}
		area.position.column++;
		area.updateDimensions();
	}

	area.removeCards = function(cards, animate){
		var toRemove = canvas.g();
		var removingFromTradePanel = false;
		var nonExistent = [];
		cards.forEach(function (card){
			var cardToRemove = area.removeCard(card);
			if(cardToRemove)
				toRemove.add(cardToRemove);
			else
				nonExistent.push(card);
		});
		var time = animate ? 500 : 0;
		toRemove.animate({opacity:0}, time, undefined, function(){
			toRemove.remove();
			area.reshuffle();
		});
		return nonExistent;
	}

	area.removeCard = function(card, reshuffle){
		for(var i=area.cards.length-1;i>=0;i--){
			if(area.cards[i].cardType == card){
				var toRemove = area.cards[i];
				area.cards.splice(i, 1);
				return toRemove;
			}
		}
	}
	area.reshuffle = function (){
		area.reset();
		area.cards.forEach(function(card){
			card.border.animate({x:dimensions.x, y:dimensions.y}, 500, mina.easein, function(){});
			card.image.animate({x:dimensions.x, y:dimensions.y}, 500, mina.easein, function(){});			
			area.updatePosition();
		});
	}

	area.reset = function (){
		area.position = {row:0, column:1};
		area.corner = {x:area.startCorner.x, y:area.startCorner.y};
		area.updateDimensions();
		areaBelow.setYPosition(cornerY);
	}

	area.setYPosition = function (yPos){
		if(area.startCorner.y != yPos){
			area.startCorner.y = yPos;
			area.reshuffle();
		}
	}
	area.reset();
	return area;
}

function getCardShape (dimensions, playerId, isLocalPlayer, params){
	var imageUrl = getImageUrl(params.cardType);
	var image = canvas.image(imageUrl,dimensions.x, dimensions.y, dimensions.width, dimensions.height);
	setSepia(image, 0.5);

	var border = canvas.rect(dimensions.x, dimensions.y, dimensions.width, dimensions.height, 10, 10);
	drawBorder(border, buildingColors[playerId], 2);
	drawFill(border, 'transparent');

	var card = canvas.g(image, border);
	card.image = image;
	card.border = border;
	card.cardType = params.cardType;
	card.playerId = playerId;
	if(isLocalPlayer){
		card.hover(function (){
			enlargeCard(card, dimensions);
		}, function (){
			shrinkCard(card, dimensions);
		})
	}
	if(!params.clickFunction)
		params.clickFunction = function(){ addToTrade(card)};
	card.click(function(){
		params.clickFunction(card);
	});
	return card;
}