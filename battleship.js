// because scope
var currentShipSize;
var currentShipOrientation;

var battleshipGame = {
	ships: [],
	health: undefined,
	guesses:undefined
};
var grid;
var columns = [null,'A','B','C','D','E','F','G','H','I','J'];
var shipBeingPlaced = 0;
var errorMessageHolder;

var remainingHealth;
var totalGuesses;
var guessDetails;

// ****************************** game stuff ******************************

// messing with stuff
// function newGame(grid1, grid2) {
// 	this.grid1 = grid1;
// 	this.grid2 = grid2;
// }
// newGame.prototype.turn = function() {
// 	if(player1) {

// 	} else if(player2) {

// 	}
// }

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
			// for(var i=0; i<startingVector.x+this.size-1; i++) {
			for(var i=0; i<this.size; i++) {
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
			// for(var i=0; i<startingVector.y+this.size-1; i++) {
			for(var i=0; i<this.size; i++) {
				if( grid.get( startingVector.plus( new Vector(0,i) ) ) != undefined ) {
					console.log("There's something in the way: ");
					console.log( grid.get( startingVector.plus( new Vector(0,i) ) ) );
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

// ****************************** game stuff ******************************

// add this to the battleshipGame object?
// function to grab user input from the DOM, create the ship, and then place the ship in the grid
// can probably add getGridSquare() to this
battleshipGame.createShip = function(ship) {
	function paintShipInDOM(classToAdd, permanent) {
		ship.startingVector = currentStartingVector;
		// for horizontal
		if(ship.horizontalOrientation == true) {
			// can create a function for this to make DRY
			for(var i=0; i<currentShipSize; i++) {
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
			for(var i=0; i<currentShipSize; i++) {
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
	// this really just indicates if the ship has been placed
	// if it has, it's set to false, meaning it can be placed
	// it's a fix for a bug where this (whether or not the ship can be placed) was being reset to false when hovering over
	// ...a grid square where the ship would be unplaceable, even if where you had actually clicked was placeable=
	var shipIsUnplaceable = true;

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
	// this needs to be named and removed after each placement
	document.addEventListener('keydown', function(e) {
		if(e.which == 32) {
			if(currentShipOrientation == true) {
				currentShipOrientation = false;
				ship.horizontalOrientation = false;
			} else if(currentShipOrientation == false) {
				currentShipOrientation = true;
				ship.horizontalOrientation = true;
			}
		}
	});

	currentShipOrientation = true;
	currentShipSize = ship.size;

	// show form stuff
	// add relevant info about the ship that's being placed into the ship details section and then display that section
	document.getElementById('current-ship-name').innerHTML = ship.name;
	document.getElementById('current-ship-size').innerHTML = ship.size;
	document.getElementById('ship-details').style.display = 'block';


	// add listeners to all grid squares
	var gridSquares = document.getElementsByClassName('grid')[0].getElementsByTagName('td');

	// I had to name this function because you can't remove a listener for an anonymous function
	function listenerFuncForGetVector() {
		var tempCurrentStartingVector = getVectorFromDom(this);
		
		// is the end vector on the grid?
		var currentEndingVector;
		if(ship.horizontalOrientation == true) {
			currentEndingVector = tempCurrentStartingVector.plus(new Vector(ship.size-1,0));
		} else if(ship.horizontalOrientation == false) {
			currentEndingVector = tempCurrentStartingVector.plus(new Vector(0,ship.size-1));
		}

		// if the whole ship fits in the grid
		if(grid.isInside(currentEndingVector) == true) {
			// if nothing is in the way
			if(somethingInTheWay == false) {
				currentStartingVector = getVectorFromDom(this);
				// console.log(currentStartingVector);
				// this removes temporarily placed ships from the grid
				// I feel like this snippet is getting repeated quite a bit
				var gridSquaresLocal = document.getElementsByClassName('grid')[0].getElementsByTagName('td');
				for(var i=0; i<gridSquaresLocal.length; i++) {
					var thisGridSquareLocal = gridSquaresLocal[i].getElementsByClassName('front');
					thisGridSquareLocal[0].className = thisGridSquareLocal[0].className.replace(/placed-ship-temporary/,'');
				}
				paintShipInDOM('placed-ship-temporary', false);
				shipIsUnplaceable = false;
			}
			// else if(somethingInTheWay == true) {
			// 	shipIsUnplaceable = true;
			// }
		}

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
		
		if(shipIsUnplaceable == false) {

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
				battleshipGame.createShip(battleshipGame.ships[shipBeingPlaced]);
			}
			else if(shipBeingPlaced == battleshipGame.ships.length) {
				// no, no more ships to place
				// hide the form input section
				document.getElementById('ship-details').style.display = 'none';
				// paint the grid
				grid.paintBoard();
				// show button to begin guessing
				guessButton.style.display = "block";
			}
		}
	}
	// re-add the listener for the next ship
	submitShipDetails.addEventListener('click', submitShipDetailsClick);

} // end battleshipGame.createShip()

// ship placement on DOM grid
battleshipGame.beginPlacement = function() {
	startButton.style.display = "none";
	this.blur();
	var somethingInTheWay = false;

	grid = new Grid(10,10);
	var ship1 = new PatrolBoat();
	var ship2 = new Destroyer();
	var ship3 = new Submarine();
	var ship4 = new Battleship();
	var ship5 = new AircraftCarrier();

	battleshipGame.ships = [ship1, ship2, ship3, ship4, ship5];
	shipBeingPlaced = 0;
	battleshipGame.createShip(battleshipGame.ships[shipBeingPlaced]);
}

// begin ability to guess where ships are in the grid
battleshipGame.beginGuessing = function() {
	guessDetails = document.getElementById('guess-details');
	guessButton.style.display = "none";
	guessDetails.style.display = "block";
	//reset the board, but not the grid on the back-end
	battleshipGame.resetBoard();
	var gridSquaresLocal = document.getElementsByClassName('grid')[0].getElementsByTagName('td');
	for(var i=0; i<gridSquaresLocal.length; i++) {
		gridSquaresLocal[i].addEventListener('click', battleshipGame.guess);
		gridSquaresLocal[i].style.cursor = 'url(http://cdn2.hubspot.net/hubfs/481197/Crosshair-059934-edited.png) 25 15, auto';
	}
	battleshipGame.health = 17;
	battleshipGame.guesses = 0;
	remainingHealth.innerHTML = battleshipGame.health;
	totalGuesses.innerHTML = battleshipGame.guesses;
}
battleshipGame.resetBoard = function() {
	var gridSquaresLocal = document.getElementsByClassName('grid')[0].getElementsByTagName('td');
	for(var i=0; i<gridSquaresLocal.length; i++) {
		var thisGridSquareLocal = gridSquaresLocal[i].getElementsByClassName('front');
		thisGridSquareLocal[0].className = thisGridSquareLocal[0].className.replace(/placed-ship/,'');
		thisGridSquareLocal[0].innerHTML = "";
		var thisGridSquareLocalBack = gridSquaresLocal[i].getElementsByClassName('back');
		thisGridSquareLocalBack[0].innerHTML = "";
	}
}
// return a guess from the grid
battleshipGame.guess = function() {
	var guessVector = getVectorFromDom(this);
	// don't increment the number of guesses if this square is already guessed
	if(grid.get(guessVector) != "X" && grid.get(guessVector) != "O") {
		battleshipGame.guesses++;
	}
	// if this square hasn't been guessed but has something in it
	if(grid.get(guessVector) != undefined && grid.get(guessVector) != "X" && grid.get(guessVector) != "O") {
		var thingInSquare = grid.get(guessVector);
		this.getElementsByClassName('back')[0].innerHTML = thingInSquare;
		battleshipGame.health--;
		remainingHealth.innerHTML = battleshipGame.health;
		grid.set(guessVector, "X");
	} else if(grid.get(guessVector) == undefined) {
		grid.set(guessVector, "O");
	}
	var regex = new RegExp("revealed")
	if(regex.test(this.className) == false) {
		this.className += " revealed";
	}
	totalGuesses.innerHTML = battleshipGame.guesses;
	if(battleshipGame.health == 0) {
		guessDetails.style.display = "none";
		document.getElementsByClassName('grid')[0].style.display = "none";
		document.getElementsByClassName('controls')[0].innerHTML = "<p class=\"game-over\">Game over!</p>";
	}
}

// the functions below: getVectorFromDom(), placeHighlight(), removeHighlight(), and getGridSquare()
// ...are just floating in the global scope right now

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
	return new Vector(xCoord, yCoord);

}

// abandon hope all ye who enter here
// this function highlights in yellow any grid squares where you're trying to place a ship
function placeHighlight() {

	// var for whether or not something is in the way of where you're trying to place a ship
	somethingInTheWay = false;
	// current vector of where you're placing ship
	// this gets updated in the various loops below
	var thisVector = getVectorFromDom(this);

	// if this is a horizontal ship
	if(currentShipOrientation == true) {
		// need to highlight red if part of the ship falls off the grid
		if( grid.isInside( thisVector.plus(new Vector(currentShipSize-1, 0)) ) == false ) {
			// iterate through each grid square of the ship
			for(var i=0; i<currentShipSize; i++) {
				// update the grid square we're looking at as we loop through
				var currentGridSquare = getGridSquare(thisVector, true, i);
				// if the grid square is on the grid, set the color to red
				if(currentGridSquare != undefined) {
					currentGridSquare.style.backgroundColor = 'red';
				}
			}
		}
		// the whole ship is inside the grid
		// now we check to see if there's anything in the way of placing the ship
		else {
			// iterate through each grid square of the ship
			for(var i=0; i<currentShipSize; i++) {
				// if we don't get an undefined response from the grid.get() method, it means there's something in the way
				if (grid.get(thisVector.plus( new Vector(i,0) )) != undefined) {
					// set somethingInTheWay to true
					somethingInTheWay = true;
					// no need to loop any longer because there was something in the way
					break;
				}
			}

			// now highlight the whole ship red or yellow, depending on if something was in the way
			// iterate through each grid square of the ship
			for(var i=0; i<currentShipSize; i++) {
				// the square we're looking at as we loop through
				var currentGridSquare = getGridSquare(thisVector, true, i);
				// highlight red because something's in the way
				if(somethingInTheWay == true) {
					currentGridSquare.style.backgroundColor = "red";
				}
				// highlight yellow because you're good to go
				else {
					currentGridSquare.style.backgroundColor = "yellow";
				}
			}
		}
	}
	// if this is a vertical ship
	else if(currentShipOrientation == false) {
		// need to highlight red if part of the ship falls off the grid
		if( grid.isInside( thisVector.plus(new Vector(0,currentShipSize-1)) ) == false ) {
			// iterate through each grid square of the ship
			for(var i=0; i<currentShipSize; i++) {
				// update the grid square we're looking at as we loop through
				var currentGridSquare = getGridSquare(thisVector, false, i);
				// if the grid square is on the grid, set the color to red
				if(currentGridSquare != undefined) {
					currentGridSquare.style.backgroundColor = "red";
				}
			}
		}
		// the whole ship is inside the grid
		// now we check to see if there's anything in the way of placing the ship
		else {
			// iterate through each grid square of the ship
			for(var i=0; i<currentShipSize; i++) {
				// if we don't get an undefined response from the grid.get() method, it means there's something in the way
				// bug?
				if (grid.get(thisVector.plus( new Vector(0,i) )) != undefined) {
					// set somethingInTheWay to true
					somethingInTheWay = true;
					// no need to loop any longer because there was something in the way
					break;
				}
			}

			// now highlight the whole ship red or yellow, depending on if something was in the way
			// iterate through each grid square of the ship
			for(var i=0; i<currentShipSize; i++) {
				// the square we're looking at as we loop through
				var currentGridSquare = getGridSquare(thisVector, false, i);
				// highlight red because something's in the way
				if(somethingInTheWay == true) {
					currentGridSquare.style.backgroundColor = "red";
				}
				// highlight yellow because you're good to go
				else {
					currentGridSquare.style.backgroundColor = "yellow";
				}
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

// this function is used inside a loop to get all DOM grid squares that are being highlighted
// namely, this is used several times in the placeHighlight() function
// could probably scope it only to that function
function getGridSquare(startingVector, isHorizontal, iterator) {
	var vectorToAdd;
	if(isHorizontal == true) {
		vectorToAdd = new Vector(iterator,0);
	} else if(isHorizontal == false) {
		vectorToAdd = new Vector(0,iterator);
	}
	var nextSquare = startingVector.plus(vectorToAdd);
	// if the square is inside the grid
	if(grid.isInside(nextSquare) == true) {
		var nextSquareRow = "row" + nextSquare.y;
		var nextSquareColumn = "column" + columns[nextSquare.x];
		var getNextSquareRow = document.getElementById(nextSquareRow);
		var getNextSquareColumn = getNextSquareRow.getElementsByClassName(nextSquareColumn);
		// if horizontal
		if(isHorizontal == true) {
			// if there's another square horizontally
			if(getNextSquareColumn.length != 0) {
				var getNextSquareColumn = getNextSquareRow.getElementsByClassName(nextSquareColumn);
				// return the square
				return getNextSquareColumn[0].getElementsByClassName('front')[0];
			}
		}
		// if vertical
		else if(isHorizontal == false) {
			// if there's another row vertically
			if(getNextSquareRow) {
				var getNextSquareColumn = getNextSquareRow.getElementsByClassName(nextSquareColumn);
				//return the square
				return getNextSquareColumn[0].getElementsByClassName('front')[0];
			}
		}
	}
}

// ****************************** DOM stuff ******************************

window.onload = function() {
	errorMessageHolder = document.getElementById('error-message');
	var gridButton = document.getElementById('gridButton');
	var startButton = document.getElementById('startButton');
	
	// listener to begin ship placement
	startButton.addEventListener('click', battleshipGame.beginPlacement);

	// listener to begin ship guessing on grid
	// this will need to be adapted when we have server stuff working
	var guessButton = document.getElementById('guessButton');
	guessButton.addEventListener('click', battleshipGame.beginGuessing);
	remainingHealth = document.getElementById('remaining-health');
	totalGuesses = document.getElementById('total-guesses');
}