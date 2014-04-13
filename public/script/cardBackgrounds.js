function getBackgroundForCardType(canvas, type){
	if(type === 'hidden')
		return getHiddenResourceBackground(canvas);
	else if(type === 'development') // add types of development, different for each. (figure out how to draw icons!)
		return getDevelopmentBackground (canvas, type);
	else	
		return colors[type];
}

function getDevelopmentBackground(canvas, type){
	var rect = canvas.rect(60,350, 100, 70);
	var text = canvas.text (65,400, "DEV");
	text.attr({
		"font-size":20,
		fill:"white"
	});
	var pattern = canvas.g(rect, text).pattern();
	return 'black';
}

//returns a black/grey backgorund pattern for use on enemy cards
function getHiddenResourceBackground(canvas){
	var pRect = canvas.rect(0,0,50,50).attr({fill:'#282828'});
	var c1 = canvas.circle(3,4.3,1.8).attr({fill:'#393939'});
	var c2 = canvas.circle(3,3,1.8).attr({fill:'black'});
	var c3 = canvas.circle(10.5,12.5,1.8).attr({fill:'#393939'});	
	var c4 = canvas.circle(10.5,11.3,1.8).attr({fill:'black'});
	return canvas.g(pRect,c1,c2,c3,c4).pattern(0,0,10,10);

}