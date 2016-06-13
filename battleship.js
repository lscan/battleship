// because scope
var currentShipSize;
var currentShipOrientation;

var battleshipGame = {
	ships: []
};
var grid;
var columns = [null,'A','B','C','D','E','F','G','H','I','J'];
var shipBeingPlaced = 0;
var errorMessageHolder;

// ****************************** game stuff ******************************

// messing with stuff
function newGame(grid1, grid2) {
	this.grid1 = grid1;
	this.grid2 = grid2;
}
newGame.prototype.turn = function() {
	if(player1) {

	} else if(player2) {

	}
}

// ****************************** grid stuff ******************************
// use vectors for grid coordinates
function Vector(x, y) {
  this.x = x;
  this.y = y;
}
// add a plus method to return this vector added to another
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

// create the Grid constructor
function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = parseInt(width);
  this.height = parseInt(height);
  this.board = "";
}
// method to return whether a vector is inside the grid
Grid.prototype.isInside = function(vector) {
  return vector.x > 0 && vector.x < this.width+1 &&
         vector.y > 0 && vector.y < this.height+1;
};
// method to return what's at a vector from the grid
Grid.prototype.get = function(vector) {
  return this.space[vector.x + this.width * vector.y];
};
// method to set a chosen value at a vector on the grid
Grid.prototype.set = function(vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};
// method to create a visual reference of the grid
Grid.prototype.paintBoard = function() {
	this.board = "";
	// i = y coordinate
	for(var i=1; i<this.width+1; i++) {
		// z = x coordinate
		for(var z=1; z<this.height+1; z++) {
			// if nothing on the grid, set vector to be "_"
			if( this.get( new Vector(z,i) ) == undefined )  {
				this.board = this.board + "_";
			}
			// if something is at this vector, return that character and put it in the DOM (and log it)
			else {
				this.board = this.board + grid.get( new Vector(z,i) );
				// paint the ships in the DOM
				var currentRow = document.getElementById('row' + i );
				var currentColumn = currentRow.getElementsByClassName('column' + columns[z])[0];
				currentColumn.getElementsByClassName('back')[0].innerHTML = grid.get( new Vector(z,i) );
			}
		}
		this.board = this.board + "\n";
	}
	console.log(grid.board);
	console.log(grid.space);
}

// ****************************** ship stuff ******************************

// create the ship constructor
// horizontalOrientation is a boolean (true for horizontal)
function Ship(size, horizontalOrientation) {
	this.size = size;
	this.horizontalOrientation = horizontalOrientation;
}
// this places the ship in the location (startingVector) on the grid
Ship.prototype.placeShip = function(startingVector) {
	var cantPlaceShipBecauseSomethingElse = false;

	// placing horizontal ship
	if(this.horizontalOrientation == true) {
		// does the whole ship fit inside the grid?
		if( grid.isInside( startingVector ) == true &&
				grid.isInside( startingVector.plus(new Vector(this.size-1, 0)) ) == true ) {

			// if yes, is there anything in the way of where we're trying to place it?
			for(var i=0; i<startingVector.x+this.size-1; i++) {
				if( grid.get( startingVector.plus( new Vector(i,0) ) ) != undefined ) {
					console.log("There's something in the way");
					console.log( grid.get( startingVector.plus( new Vector(i,0) ) ) );
					console.log(startingVector.plus(new Vector(i,0)));
					// setting cantPlaceShipBecauseSomethingElse to true so that we can evaluate...
					// ...whether or not we're allowed to set a ship on the grid
					cantPlaceShipBecauseSomethingElse = true;
					// break gets us out of the loop (because no need to keep checking if something's in the way)
					break;
				}
			}

			if(cantPlaceShipBecauseSomethingElse == true) {
				// if something is in the way, try, try again
				console.warn('You can\'t place your ship there. Something else is in the way.');
				errorMessageHolder.innerHTML = 'You can\'t place your ship there. Something else is in the way. Please try again.';
				errorMessageHolder.style.display = 'inline-block';
			}

			else if(cantPlaceShipBecauseSomethingElse == false) {
				// we didn't run into anything, so now let's place the ship pieces
				for(var i=0; i<this.size; i++) {
					grid.set(startingVector.plus(new Vector(i, 0)), this.symbol);
				}
				// increment shipBeingPlaced so that the createShip function works properly
				// remember, this is used as the index for the array of ships to be placed
				shipBeingPlaced++;
			}

		}	else {
			// the ship doesn't fit inside the grid
			console.warn('You tried placing a ship outside the grid.');
			errorMessageHolder.innerHTML = 'You tried placing a ship outside the grid. Please try again.';
			errorMessageHolder.style.display = 'inline-block';
		}
	}

	// placing vertical ship
	else if(this.horizontalOrientation == false) {
		// does the whole ship fit inside the grid?
		if( grid.isInside( startingVector ) == true &&
				grid.isInside( startingVector.plus(new Vector(0, this.size-1)) ) == true ) {
			
			// if yes, is there anything in the way of where we're trying to place it?
			for(var i=0; i<startingVector.y+this.size-1; i++) {
				if( grid.get( startingVector.plus( new Vector(0,i) ) ) != undefined ) {
					console.log("There's something in the way: ");
					console.log( grid.get( startingVector.plus( new Vector(i,0) ) ) );
					// setting cantPlaceShipBecauseSomethingElse to true so that we can evaluate...
					// ...whether or not we're allowed to set a ship on the grid
					cantPlaceShipBecauseSomethingElse = true;
					// break gets us out of the loop (because no need to keep checking if something's in the way)
					break;
				}
			}

			if(cantPlaceShipBecauseSomethingElse == true) {
				// if something is in the way, try, try again
				console.warn('You can\'t place your ship there. Something else is in the way.');
				errorMessageHolder.innerHTML = 'You can\'t place your ship there. Something else is in the way. Please try again.';
				errorMessageHolder.style.display = 'inline-block';
			}

			else if(cantPlaceShipBecauseSomethingElse == false) {
				// we didn't run into anything, so now let's place the ship pieces
				for(var i=0; i<this.size; i++) {
					grid.set(startingVector.plus(new Vector(0, i)), this.symbol);
				}
				// increment shipBeingPlaced so that the createShip function works properly
				// remember, this is used as the index for the array of ships to be placed
				shipBeingPlaced++;
			}

		} else {
			// the ship doesn't fit inside the grid
			console.warn('You tried placing a ship outside the grid.');
			errorMessageHolder.innerHTML = 'You tried placing a ship outside the grid. Please try again.';
			errorMessageHolder.style.display = 'inline-block';
		}
	}

	else {
		// if the horizontalOrientation isn't true or false... ¯\_(ツ)_/¯
		console.warn("Something isn't right.");
		errorMessageHolder.innerHTML = 'I\'m not sure what you\'ve done.';
		errorMessageHolder.style.display = 'inline-block';
	}

};

// add this to the battleshipGame object?
// function to grab user input from the DOM, create the ship, and then place the ship in the grid
function createShip(ship) {
	function paintShipInDOM(classToAdd, permanent) {
		ship.startingVector = currentStartingVector;
		// for horizontal
		if(ship.horizontalOrientation == true) {
			// can create a function for this to make DRY
			for(var i=0; i<currenShipSize; i++) {
				var nextSquare = ship.startingVector.plus( new Vector(i,0) );
				var nextSquareRow = "row" + nextSquare.y;
				var nextSquareColumn = "column" + columns[nextSquare.x];
				var getNextSquareRow = document.getElementById(nextSquareRow);
				var getNextSquareColumn = getNextSquareRow.getElementsByClassName(nextSquareColumn);
				var testFront = getNextSquareColumn[0].getElementsByClassName('front');
				testFront[0].className += " " + classToAdd;
				if(permanent == true) {
					testFront[0].innerHTML = ship.symbol;
				}
			}
		}
		// for vertical
		else if(ship.horizontalOrientation == false) {
			for(var i=0; i<currenShipSize; i++) {
				var nextSquare = ship.startingVector.plus( new Vector(0,i) );
				var nextSquareRow = "row" + nextSquare.y;
				var nextSquareColumn = "column" + columns[nextSquare.x];
				var getNextSquareRow = document.getElementById(nextSquareRow);
				var getNextSquareColumn = getNextSquareRow.getElementsByClassName(nextSquareColumn);
				var testFront = getNextSquareColumn[0].getElementsByClassName('front');
				testFront[0].className += " " + classToAdd;
				if(permanent == true) {
					testFront[0].innerHTML = ship.symbol;
				}
			}
		}
	}

	// on click this value will reset to whichever grid vector was clicked
	var currentStartingVector;
	ship.horizontalOrientation = true;

	// for changing ship orientation on button click in form
	var buttonHorizontal = document.getElementById('button-horizontal');
	var buttonVertical = document.getElementById('button-vertical');
	buttonHorizontal.addEventListener('click', function() {
		currentShipOrientation = true;
		ship.horizontalOrientation = true;
	});
	buttonVertical.addEventListener('click', function() {
		currentShipOrientation = false;
		ship.horizontalOrientation = false;
	});

	currentShipOrientation = true;
	currenShipSize = ship.size;

	// show form stuff
	// add relevant info about the ship that's being placed into the ship details section and then display that section
	document.getElementById('current-ship-name').innerHTML = ship.name;
	document.getElementById('current-ship-size').innerHTML = ship.size;
	document.getElementById('ship-details').style.display = 'block';


	// add listeners to all grid squares
	var gridSquares = document.getElementsByClassName('grid')[0].getElementsByTagName('td');

	// I had to name this function because you can't remove a listener for an anonymous function
	function listenerFuncForGetVector() {
		currentStartingVector = getVectorFromDom(this);
		console.log(currentStartingVector);
		// this removes temporarily placed ships from the grid
		// I feel like this snippet is getting repeated quite a bit
		var gridSquaresLocal = document.getElementsByClassName('grid')[0].getElementsByTagName('td');
		for(var i=0; i<gridSquaresLocal.length; i++) {
			var thisGridSquareLocal = gridSquaresLocal[i].getElementsByClassName('front');
			thisGridSquareLocal[0].className = thisGridSquareLocal[0].className.replace(/placed-ship-temporary/,'');
		}
		paintShipInDOM('placed-ship-temporary', false);
	}

	for(var i=0; i<gridSquares.length; i++) {
		// gridSquares[i].addEventListener('click', battleshipGame.guessLocation);
		gridSquares[i].addEventListener('mouseenter', placeHighlight);
		gridSquares[i].addEventListener('mouseleave', removeHighlight);
		gridSquares[i].addEventListener('click', listenerFuncForGetVector);
	}

	// button to confirm placement
	var submitShipDetails = document.getElementById('shipPlace');
	// function that runs on click of the place ship button
	function submitShipDetailsClick() {
		
		// remove the listener on the button, or else madness
		submitShipDetails.removeEventListener('click', submitShipDetailsClick);
		// remove some other listeners
		for(var i=0; i<gridSquares.length; i++) {
			gridSquares[i].removeEventListener('mouseenter', placeHighlight);
			gridSquares[i].removeEventListener('mouseleave', removeHighlight);
			gridSquares[i].removeEventListener('click', listenerFuncForGetVector);
		}

		// reset any previous error message from trying to place a ship
		errorMessageHolder.style.display = 'none';
		errorMessageHolder.innerHTML ='';

		// get the vector coordinates and ship orientation from user input
		var startingX = currentStartingVector.x;
		var startingY = currentStartingVector.y;
		var shipOrientationRadios = document.getElementsByName('orientation');
		// currentShipOrientation = true;
		// for(var i=0; i<shipOrientationRadios.length; i++) {
		// 	if(shipOrientationRadios[i].checked) {
		// 		currentShipOrientation = shipOrientationRadios[i].value;
		// 		break;
		// 	}
		// }
		// convert string to boolean for ship orientation
		if(currentShipOrientation == "true") {
			// currentShipOrientation = true;
			this.horizontalOrientation = true;
		} else {
			// currentShipOrientation = false;
			this.horizontalOrientation = false;
		}

		// place the ship
		ship.startingVector = currentStartingVector;
		ship.horizontalOrientation = currentShipOrientation;
		ship.placeShip(ship.startingVector);
		var gridSquaresLocal = document.getElementsByClassName('grid')[0].getElementsByTagName('td');
		for(var i=0; i<gridSquaresLocal.length; i++) {
			var thisGridSquareLocal = gridSquaresLocal[i].getElementsByClassName('front');
			thisGridSquareLocal[0].className = thisGridSquareLocal[0].className.replace(/placed-ship-temporary/,'');
		}
		paintShipInDOM('placed-ship', true);


		// should we try to place the next ship?
		if(shipBeingPlaced < battleshipGame.ships.length) {
			// yes, place the next ship
			createShip(battleshipGame.ships[shipBeingPlaced]);
		}
		else if(shipBeingPlaced == battleshipGame.ships.length) {
			// no, no more ships to place
			// hide the form input section
			document.getElementById('ship-details').style.display = 'none';
			// paint the grid
			grid.paintBoard();
		}

	}
	// re-add the listener for the next ship
	submitShipDetails.addEventListener('click', submitShipDetailsClick);

}

// prototypal inheritance!
// not sure if we need the horizontalOrientation parameter, but it's sorta baked in right now
function PatrolBoat(horizontalOrientation) {
	this.size = 2;
	this.horizontalOrientation = horizontalOrientation;
	this.name = "patrol boat";
	this.symbol = "P";
};
PatrolBoat.prototype = Object.create(Ship.prototype);
function Destroyer(horizontalOrientation) {
	this.size = 3;
	this.horizontalOrientation = horizontalOrientation;
	this.name = "destroyer";
	this.symbol = "D";
};
Destroyer.prototype = Object.create(Ship.prototype);
function Submarine(horizontalOrientation) {
	this.size = 3;
	this.horizontalOrientation = horizontalOrientation;
	this.name = "submarine";
	this.symbol = "S";
};
Submarine.prototype = Object.create(Ship.prototype);
function Battleship(horizontalOrientation) {
	this.size = 4;
	this.horizontalOrientation = horizontalOrientation;
	this.name = "battleship";
	this.symbol = "B";
};
Battleship.prototype = Object.create(Ship.prototype);
function AircraftCarrier(horizontalOrientation) {
	this.size = 5;
	this.horizontalOrientation = horizontalOrientation;
	this.name = "aircraft carrier";
	this.symbol = "A";
};
AircraftCarrier.prototype = Object.create(Ship.prototype);

// ****************************** turn stuff ******************************

// coming back to this
// function Turn() {}
// Turn.prototype.guessLocation = function(e) {
// 	e.preventDefault();
// 	console.log(this);
// }
battleshipGame.guessLocation = function() {
	// I created the thisGridSquare variable for the getYCoord function, which...
	// ...returns the Y coordinate of the grid square that's clicked
	// I did this because I don't feel like figuring out how to...
	// ...bind 'this' to that function

	var thisGridSquare = this;
	// the way I'm getting columnLetter seems janky, but works for now
	var columnLetter = this.className[6];
	var xCoord = columns.indexOf(columnLetter);

	// this could probably just be an IIFE
	var yCoord = Number(getYCoord());
	function getYCoord() {
		if(thisGridSquare.parentNode.id[4] != undefined) {
			return thisGridSquare.parentNode.id[3] + thisGridSquare.parentNode.id[4];
		} else {
			return thisGridSquare.parentNode.id[3];
		}
	}

	var guessVector = new Vector(xCoord, yCoord);
	console.log(guessVector);
	console.log(grid.get(guessVector));

	if(grid.get(guessVector) == undefined || grid.get(guessVector) == "O") {
		console.log('miss');
		grid.set(guessVector, 'O');
	} else {
		var thingAtGridSquare = grid.get(guessVector);
		console.log(thingAtGridSquare);
		grid.set(guessVector, 'X');

		switch(thingAtGridSquare) {
			case 'P':
				console.log('you found a P');
				break;
			case 'D':
				console.log('you found a D');
				break;
			case 'S':
				console.log('you found an S');
				break;
			case 'B':
				console.log('you found a B');
				break;
			case 'A':
				console.log('you found an A');
				break;
			default:
				console.log('wtf');
		}

	}

	grid.paintBoard();

	if(battleshipGame.ships.length == 0) {
		console.log('game over');
	}

}

// ship placement on DOM grid
battleshipGame.beginPlacement = function() {

	grid = new Grid(10,10);
	var ship1 = new PatrolBoat();
	var ship2 = new Destroyer();
	var ship3 = new Submarine();
	var ship4 = new Battleship();
	var ship5 = new AircraftCarrier();

	battleshipGame.ships = [ship1, ship2, ship3, ship4, ship5];
	shipBeingPlaced = 0;
	createShip(battleshipGame.ships[shipBeingPlaced]);
}

// pass in a DOM element (a grid square) and you get its vector
// could maybe use a lil' work
function getVectorFromDom(elementFromDom) {
	var thisGridSquare = elementFromDom;
	// the way I'm getting columnLetter seems janky, but works for now
	var columnLetter = elementFromDom.className[6];
	var xCoord = columns.indexOf(columnLetter);

	// this could probably just be an IIFE
	var yCoord = Number(getYCoord());
	function getYCoord() {
		if(thisGridSquare.parentNode.id[4] != undefined) {
			return thisGridSquare.parentNode.id[3] + thisGridSquare.parentNode.id[4];
		} else {
			return thisGridSquare.parentNode.id[3];
		}
	}
	// var thisVector = new Vector(xCoord,yCoord);
	return new Vector(xCoord, yCoord);

}


	// testing ship placement interface
	// abandon hope all ye who enter here
	function placeHighlight() {

		var thisVector = getVectorFromDom(this);

		if(currentShipOrientation == true) {
			// need to highlight red if part of the ship falls off the grid
			if( grid.isInside( thisVector.plus(new Vector(currenShipSize-1, 0)) ) == false ) {
				// iterate through each grid square
				for(var i=0; i<currenShipSize; i++) {
					// get the next (or first for the first time through (since we're starting at i=0)) grid square
					var nextSquare = thisVector.plus( new Vector(i,0) );
					if(grid.isInside(nextSquare) == true) {
						var nextSquareRow = "row" + nextSquare.y;
						var nextSquareColumn = "column" + columns[nextSquare.x];
						var getNextSquareRow = document.getElementById(nextSquareRow);
						var getNextSquareColumn = getNextSquareRow.getElementsByClassName(nextSquareColumn);
						// console.log(getNextSquareColumn);
						if(getNextSquareColumn.length != 0) {
							var testFront = getNextSquareColumn[0].getElementsByClassName('front');
							testFront[0].style.backgroundColor = "red";
						}
					} else {break;}
				}
			}
			// otherwise highlight the whole ship
			else {
				for(var i=0; i<currenShipSize; i++) {
					var nextSquare = thisVector.plus( new Vector(i,0) );
					var nextSquareRow = "row" + nextSquare.y;
					var nextSquareColumn = "column" + columns[nextSquare.x];
					var getNextSquareRow = document.getElementById(nextSquareRow);
					var getNextSquareColumn = getNextSquareRow.getElementsByClassName(nextSquareColumn);
					// console.log(getNextSquareColumn);
					var testFront = getNextSquareColumn[0].getElementsByClassName('front');
					testFront[0].style.backgroundColor = "yellow";
				}
			}
		} else if(currentShipOrientation == false) {
			// need to highlight red if you can't
			if( grid.isInside( thisVector.plus(new Vector(0,currenShipSize-1)) ) == false ) {
				for(var i=0; i<currenShipSize; i++) {
					var nextSquare = thisVector.plus( new Vector(0,i) );
					if(grid.isInside(nextSquare) == true) {
						var nextSquare = thisVector.plus( new Vector(0,i) );
						var nextSquareRow = "row" + nextSquare.y;
						var nextSquareColumn = "column" + columns[nextSquare.x];
						var getNextSquareRow = document.getElementById(nextSquareRow);
						if(getNextSquareRow) {
							var getNextSquareColumn = getNextSquareRow.getElementsByClassName(nextSquareColumn);
							// console.log(getNextSquareColumn);
							var testFront = getNextSquareColumn[0].getElementsByClassName('front');
							testFront[0].style.backgroundColor = "red";
						}
					} else {break;}
				}
			}
			else {
				// highlight shit
				for(var i=0; i<currenShipSize; i++) {
					var nextSquare = thisVector.plus( new Vector(0,i) );
					var nextSquareRow = "row" + nextSquare.y;
					var nextSquareColumn = "column" + columns[nextSquare.x];
					var getNextSquareRow = document.getElementById(nextSquareRow);
					var getNextSquareColumn = getNextSquareRow.getElementsByClassName(nextSquareColumn);
					// console.log(getNextSquareColumn);
					var testFront = getNextSquareColumn[0].getElementsByClassName('front');
					testFront[0].style.backgroundColor = "yellow";
				}
			}
		}
	} // end placeHighlight()

	// function for removing background color of ships that are no longer being highlighted during placement
	function removeHighlight() {
		var gridSquaresLocal = document.getElementsByClassName('grid')[0].getElementsByTagName('td');
		for(var i=0; i<gridSquaresLocal.length; i++) {
			var thisGridSquareLocal = gridSquaresLocal[i].getElementsByClassName('front');
			thisGridSquareLocal[0].style.backgroundColor = "black";
		}
	}

// ****************************** DOM stuff ******************************

window.onload = function() {
	errorMessageHolder = document.getElementById('error-message');
	var gridButton = document.getElementById('gridButton');
	var startButton = document.getElementById('startButton');
	
	// trying DOM click placement for now
	startButton.addEventListener('click', battleshipGame.beginPlacement);

	// add the guessLocation listener to all grid squares
	// var gridSquares = document.getElementsByClassName('grid')[0].getElementsByTagName('td');
	// for(var i=0; i<gridSquares.length; i++) {
	// 	gridSquares[i].addEventListener('click', battleshipGame.guessLocation);
	// 	// testing
	// 	gridSquares[i].addEventListener('mouseenter', placeHighlight);
	// 	gridSquares[i].addEventListener('mouseleave', removeHighlight);
	// }

}

// this belongs elsewhere
// if(this.classList.contains('revealed')) {
// 	this.className = this.className.replace(/ revealed/,'');
// } else {
// 	this.className += " revealed";
// }