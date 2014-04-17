
function getCardArea(canvas, cornerX, cornerY, cardWidth, playerId, isLocalPlayer, areaBelow){
	var area = {cards:[], shapeGroup:canvas.g(), corner:{x:cornerX, y:cornerY}, startCorner:{x:cornerX, y:cornerY}};
	area.maxRows = isLocalPlayer ? 3 : 1;
	area.maxColumns = 8;
	var cardHeight = cardWidth * (4/3);
	coords = {width:cardWidth, height:cardHeight};
	var xJump = cardWidth - 15;
	var yJump = isLocalPlayer ? cardHeight + 20 : cardHeight + 5;

	area.addCard = function(card){
		if(area.position.row >= area.maxRows){
			return;
		}
		coords.x = area.corner.x + (area.position.column-1)*xJump;
		coords.y = area.corner.y + area.position.row*yJump;
		var shape = getShape(canvas, coords, stashObjectTypes.card, playerId, isLocalPlayer, card);
		if(area.position.column % area.maxColumns == 0){
			area.position.row++;
			area.position.column = 0;
		}
		area.position.column++;
		shape.card = card;
		area.cards.push(shape);
		area.shapeGroup.add(shape);
		areaBelow.setYPosition (coords.y + yJump);
	}

	area.removeCards = function(cards){
		var toRemove = canvas.g();
		cards.forEach(function (card){
			toRemove.add(area.removeCard(card));
		});
		toRemove.animate({opacity:0}, 1000, undefined, function(){
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
			area.addCard(card.card);
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


function getCardShape (canvas, coords, playerId, isLocalPlayer, cardType){
	var filter = canvas.filter(Snap.filter.sepia(0.5));
	// var filter = canvas.filter(Snap.filter.blur(1,1));

	var imageUrl = '../img/'+cardType+'.png';
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
	var resource = canvas.g(image, border);
	//make card larger on mouse hover
	if(isLocalPlayer){
		resource.hover(function (){
			image.attr({
				width:coords.width*(3/2),
				height:coords.height*(6/5)
			});
			border.attr({
				width:coords.width*(3/2),
				height:coords.height*(6/5)
			});
			resource.parentGroup = resource.parent();
			resource.parent().after(resource);
		}, function (){
			image.attr({
				width:coords.width,
				height:coords.height
			});
			border.attr({
				width:coords.width,
				height:coords.height
			});
			resource.parentGroup.append(resource);
		})
	}
	//TODO: remove this
	resource.click(function(){
		stashObjects[playerId].resourceCards.removeCard(cardType);
	})
	///////
	return resource;
}