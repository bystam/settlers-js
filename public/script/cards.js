
function getCardArea(canvas, cornerX, cornerY, cardWidth, playerId, isLocalPlayer, areaBelow, maxRows, maxColumns){
	var area = {cards:[], shapeGroup:canvas.g(), corner:{x:cornerX, y:cornerY}, startCorner:{x:cornerX, y:cornerY}};
	if(!areaBelow)
		areaBelow = {setYPosition:function(){}};
	area.maxRows = isLocalPlayer ? maxRows : 1;
	area.maxColumns = maxColumns;
	var cardHeight = cardWidth * (4/3);
	coords = {width:cardWidth, height:cardHeight};
	var xJump = cardWidth - 15;
	var yJump = isLocalPlayer ? cardHeight + 20 : cardHeight + 5;

	area.addCard = function(card, clickFunction){
		if(area.position.row >= area.maxRows){
			return;
		}
		coords.x = area.corner.x + (area.position.column-1)*xJump;
		coords.y = area.corner.y + area.position.row*yJump;
		var shape = getShape(
			canvas, coords, stashObjectTypes.card, 
			playerId, isLocalPlayer, {cardType:card, clickFunction:clickFunction});
		if(area.position.column % area.maxColumns == 0){
			area.position.row++;
			area.position.column = 0;
		}
		area.position.column++;
		shape.card = card;
		shape.clickFunction = clickFunction;
		area.cards.push(shape);
		area.shapeGroup.add(shape);
		areaBelow.setYPosition (coords.y + yJump);
		return shape;
	}

	area.removeCards = function(cards, animate){
		var toRemove = canvas.g();
		cards.forEach(function (card){
			toRemove.add(area.removeCard(card));
		});
		var time = animate ? 500 : 0;
		toRemove.animate({opacity:0}, time, undefined, function(){
			toRemove.remove();
			area.reshuffle();
		});
	}

	area.removeCard = function(card, reshuffle){
		for(var i=area.cards.length-1;i>=0;i--){
			if(area.cards[i].card == card){
				var toRemove = area.cards[i];
				area.cards.splice(i, 1);
				return toRemove;
			}
		}
	}
	area.reshuffle = function (){
		area.reset();
		var cardsCopy = area.cards;
		area.cards = [];
		cardsCopy.forEach(function(card){
			area.addCard(card.card, card.clickFunction);
		});
	}

	area.reset = function (){
		area.position = {row:0, column:1};
		area.corner = {x:area.startCorner.x, y:area.startCorner.y};
		areaBelow.setYPosition(cornerY);
		area.shapeGroup.remove();
		area.shapeGroup = canvas.g();
	}

	area.setYPosition = function (yPos){
		area.startCorner.y = yPos;
		area.reshuffle();
	}

	area.reset();
	return area;
}



function getCardShape (canvas, coords, playerId, isLocalPlayer, params){
	var filter = canvas.filter(Snap.filter.sepia(0.5));
	var imageUrl = '../img/'+params.cardType+'.png';
	var image = canvas.image(imageUrl,coords.x, coords.y, coords.width, coords.height);
	image.attr({
		filter:filter
	})
	var border = canvas.rect(coords.x, coords.y, coords.width, coords.height, 10, 10);
	border.attr({
		fill:'transparent',
		strokeWidth:2,
		stroke:buildingColors[playerId]
	});
	var card = canvas.g(image, border);
	card.image = image;
	card.border = border;
	card.type = params.cardType;
	card.playerId = playerId;
	//make card larger on mouse hover
	if(isLocalPlayer){
		card.hover(function (){
			image.attr({
				width:coords.width*(3/2),
				height:coords.height*(6/5)
			});
			border.attr({
				width:coords.width*(3/2),
				height:coords.height*(6/5)
			});
			card.parentGroup = card.parent();
			card.parent().after(card);
		}, function (){
			image.attr({
				width:coords.width,
				height:coords.height
			});
			border.attr({
				width:coords.width,
				height:coords.height
			});
			card.parentGroup.append(card);
		})
	}
	card.click(function(){
		params.clickFunction(card);
	});
	///////
	return card;
}