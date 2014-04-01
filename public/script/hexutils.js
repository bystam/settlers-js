function setNeighboursOfHex (hex){
	hex.neighbours= {};
	var index = hex.boardIndex;
	var top = -5;
	var bottom = 5;
	var topLeft = -3;
	var bottomLeft = 2;
	var topRight = -2;
	var bottomRight = 3;

	if(index === 0){
		bottom--;
		bottomLeft--;
		bottomRight--;
	}
	if(index === 1)
		topRight++;
	if(index === 2)
		topLeft++;
	if(index === 4)
		top++;
	if(index === 18){
		topLeft++;
		top++;
		topRight++;
	}
	if(index === 16)
		bottomRight--;
	if(index === 14)
		bottom--;
	if(index === 17)
		bottomLeft--;

	var topLess = [0,1,2,3,5];
	var topLeftLess = [0,1,3,8,13];
	var topRightLess = [0,2,5,10,15];
	var bottomLess = [13,15,16,17,18];
	var bottomLeftLess = [3,8,13,16,18];
	var bottomRightLess = [5,10,15,17,18];

	if(topLess.indexOf(index) === -1)
		hex.neighbours.top = index + top;
	if(topLeftLess.indexOf(index) === -1)
		hex.neighbours.topLeft = index + topLeft;
	if(topRightLess.indexOf(index) === -1)
		hex.neighbours.topRight = index + topRight;
	if(bottomLess.indexOf(index) === -1)
		hex.neighbours.bottom = index + bottom;
	if(bottomLeftLess.indexOf(index) === -1)
		hex.neighbours.bottomLeft = index + bottomLeft;
	if(bottomRightLess.indexOf(index) === -1)
		hex.neighbours.bottomRight = index + bottomRight;
}