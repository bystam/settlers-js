
/*works for now, but could use refactoring.

*/
function getCardArea(canvas, cornerX, cornerY, cardWidth, playerId, isLocalPlayer, areaBelow, maxRows, maxColumns){
	var area = {cards:[], shapeGroup:canvas.g(), corner:{x:cornerX, y:cornerY}, startCorner:{x:cornerX, y:cornerY}};
	if(!areaBelow)
		areaBelow = {setYPosition:function(){}};
	area.maxRows = isLocalPlayer ? maxRows : 1;
	area.maxColumns = maxColumns;
	var cardHeight = cardWidth * (4/3);
	var cardRect = {width:cardWidth, height:cardHeight};
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
			canvas, cardRect, stashObjectTypes.card, 
			playerId, isLocalPlayer, {cardType:type, clickFunction:clickFunction});
		shape.clickFunction = clickFunction;
		area.addCard(shape);
		return shape;
	}

	area.getCurrentCardRect = function (){
		cardRect.x = area.corner.x + (area.position.column-1)*xJump;
		cardRect.y = area.corner.y + area.position.row*yJump;
		areaBelow.setYPosition (cardRect.y + yJump);
	}

	area.updatePosition = function(){
		if(area.position.column % area.maxColumns == 0){
			area.position.row++;
			area.position.column = 0;
		}
		area.position.column++;
		area.getCurrentCardRect();
	}

	area.removeCards = function(cards, animate){
		var toRemove = canvas.g();
		var removingFromTradePanel = false;
		cards.forEach(function (card){
			var cardToRemove = area.removeCard(card);
			if(!cardToRemove){
				cardToRemove = tradePanel.left.removeCard(card);
				removingFromTradePanel = true;
			}
			toRemove.add(cardToRemove);
		});
		var time = animate ? 500 : 0;
		toRemove.animate({opacity:0}, time, undefined, function(){
			toRemove.remove();
			area.reshuffle();
			if(removingFromTradePanel)
				tradePanel.left.reshuffle();
		});
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
		area.cards.sort(function(a, b){
		    if(a.cardType < b.cardType) return -1;
		    if(a.cardType > b.cardType) return 1;
		    return 0;
		});
		area.cards.forEach(function(card){
			card.border.animate({x:cardRect.x, y:cardRect.y}, 500, mina.easein, function(){});
			card.image.animate({x:cardRect.x, y:cardRect.y}, 500, mina.easein, function(){});			
			area.updatePosition();
		});
	}

	area.reset = function (){
		area.position = {row:0, column:1};
		area.corner = {x:area.startCorner.x, y:area.startCorner.y};
		area.getCurrentCardRect();
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



function getCardShape (canvas, cardRect, playerId, isLocalPlayer, params){
	var filter = canvas.filter(Snap.filter.sepia(0.5));
	var imageUrl = '../img/'+params.cardType+'.png';
	var image = canvas.image(imageUrl,cardRect.x, cardRect.y, cardRect.width, cardRect.height);
	image.attr({
		filter:filter
	})
	var border = canvas.rect(cardRect.x, cardRect.y, cardRect.width, cardRect.height, 10, 10);
	border.attr({
		fill:'transparent',
		strokeWidth:2,
		stroke:buildingColors[playerId]
	});
	var card = canvas.g(image, border);
	card.image = image;
	card.border = border;
	card.cardType = params.cardType;
	card.playerId = playerId;
	//make card larger on mouse hover
	if(isLocalPlayer){
		card.hover(function (){
			image.attr({
				width:cardRect.width*(3/2),
				height:cardRect.height*(6/5)
			});
			border.attr({
				width:cardRect.width*(3/2),
				height:cardRect.height*(6/5)
			});
			card.parentGroup = card.parent();
			card.parent().after(card);
		}, function (){
			image.attr({
				width:cardRect.width,
				height:cardRect.height
			});
			border.attr({
				width:cardRect.width,
				height:cardRect.height
			});
			card.parentGroup.append(card);
		})
	}
	if(!params.clickFunction)
		params.clickFunction = function(){ addToTrade(card)};
	card.click(function(){
		params.clickFunction(card);
	});
	///////
	return card;
}