var battleshipGame = {
	ships: []
};
var grid;
var columns = [null,'A','B','C','D','E','F','G','H','I','J'];
// var battleship = battleship || {};
// var battleship = {
// 	ships: []
// };

// ****************************** grid stuff ******************************
//use vectors to set things on the grid
//create the Vector constructor
function Vector(x, y) {
  this.x = x;
  this.y = y;
}
//add a plus method to return this vector added to another
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

//create the Grid constructor
function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = parseInt(width);
  this.height = parseInt(height);
  this.board = "";
}
//method to return whether a vector exists inside the grid
Grid.prototype.isInside = function(vector) {
  return vector.x > 0 && vector.x < this.width+1 &&
         vector.y > 0 && vector.y < this.height+1;
};
//method to return a vector from the grid
Grid.prototype.get = function(vector) {
  return this.space[vector.x + this.width * vector.y];
};
//method to set a chosen value at a vector on the grid
Grid.prototype.set = function(vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};
Grid.prototype.paintBoard = function() {
	this.board = "";
	for(var i=1; i<this.width+1; i++) {
		for(var z=1; z<this.height+1; z++) {
			//if nothing on the grid, set vector to be "_"
			if( this.get( new Vector(z,i) ) == undefined )  {
				this.board = this.board + "_";
			}
			//if something at this vector, return that character and put it in the DOM
			else {
				this.board = this.board + grid.get( new Vector(z,i) );
				// paint the ships in the DOM
				var currentRow = document.getElementById('row' + i );
				var currentColumn = currentRow.getElementsByClassName('column' + columns[z])[0];
				currentColumn.getElementsByClassName('back')[0].innerHTML = "S";
			}
		}
		this.board = this.board + "\n";
	}
	console.log(grid.board);
}

// ****************************** ship stuff ******************************

//create the ship constructor
//horizontalOrientation can be a boolean (true for horizontal)
function Ship(size, horizontalOrientation) {
	this.size = size;
	this.horizontalOrientation = horizontalOrientation;
}
//this places the ship in the location (startingVector) on the grid
Ship.prototype.placeShip = function(startingVector) {
	// this needs:
	// if the ship can't be placed, to try again

	var cantPlaceShipBecauseSomethingElse = false;

	//check that all spaces are on the grid and available
	if(this.horizontalOrientation == true) {
		// does the whole ship fit inside the grid?
		if( grid.isInside( startingVector ) == true &&
				grid.isInside( startingVector.plus(new Vector(this.size-1, 0)) ) == true ) {

			// if yes:
			for(var i=0; i<startingVector.x+this.size; i++) {
				if( grid.get( startingVector.plus( new Vector(i,0) ) ) != undefined ) {
					console.log("There's something in the way");
					// break gets us out of the loop, but doesn't return the function
					// so we need to do something funky
					cantPlaceShipBecauseSomethingElse = true;
					break;
				}
			}

			// if something is in the way where we want to place the ship, try, try again
			if(cantPlaceShipBecauseSomethingElse == true) {
				alert('You can\'t place your ship there. Something else is in the way.');
				createShip(this);
				this.placeShip(this.startingVector);
			}
			//we didn't run into anything, so now let's place the ship pieces
			else if(cantPlaceShipBecauseSomethingElse == false) {
				for(var i=0; i<this.size; i++) {
					grid.set(startingVector.plus(new Vector(i, 0)), "S");
				}
			}
		}
		else {
			//this ship doesn't fit inside the grid
			console.log("The ship doesn't fit inside the grid.");
			alert('You tried placing a ship outside the grid.');
			createShip(this);
			this.placeShip(this.startingVector);
		}
	}

	else if(this.horizontalOrientation == false) {
		// does the whole ship fit inside the grid?
		if( grid.isInside( startingVector ) == true &&
				grid.isInside( startingVector.plus(new Vector(0, this.size-1)) ) == true ) {

			// if yes:
			for(var i=0; i<startingVector.y+this.size; i++) {
				if( grid.get( startingVector.plus( new Vector(0,i) ) ) != undefined ) {
					console.log("There's something in the way");
					// break gets us out of the loop, but doesn't return the function
					// so we need to do something funky
					cantPlaceShipBecauseSomethingElse = true;
					break;
				}
			}

			// if something is in the way where we want to place the ship, try, try again
			if(cantPlaceShipBecauseSomethingElse == true) {
				alert('You can\'t place your ship there. Something else is in the way.');
				createShip(this);
				this.placeShip(this.startingVector);
			}
			// we didn't run into anything, so now let's place the ship pieces
			else if(cantPlaceShipBecauseSomethingElse == false) {
				for(var i=0; i<this.size; i++) {
					grid.set(startingVector.plus(new Vector(0, i)), "S");
				}
			}
		}
		else {
			//this ship doesn't fit inside the grid
			console.log("The ship doesn't fit inside the grid.");
			alert('You tried placing a ship outside the grid.');
			createShip(this);
			this.placeShip(this.startingVector);
		}
	}
	else {
		// if the horizontalOrientation isn't true or false...
		console.log("Something isn't right.");
	}

};

// this prompts the user to enter a vector and orientation for the ship being placed
function createShip(ship) {
	var startingX = parseInt(prompt('gimme an X coordinate'));
	var startingY = parseInt(prompt('gimme a Y coordinate'));
	var shipOrientation = prompt('gimme an orientation');
	ship.startingVector = new Vector(startingX, startingY);
	if(shipOrientation == "true") {
		ship.horizontalOrientation = true;
	} else {ship.horizontalOrientation = false;}
	// not sure if this is needed, but...
	// this pushes each of our newly created ships into an array
	battleshipGame.ships.push(ship);
}

// prototypal inheritance!
// not sure if we need the horizontalOrientation parameter
function PatrolBoat(horizontalOrientation) {
	this.size = 2;
	this.horizontalOrientation = horizontalOrientation;
};
PatrolBoat.prototype = Object.create(Ship.prototype);
function Destroyer(horizontalOrientation) {
	this.size = 3;
	this.horizontalOrientation = horizontalOrientation;
};
Destroyer.prototype = Object.create(Ship.prototype);
function Submarine(horizontalOrientation) {
	this.size = 3;
	this.horizontalOrientation = horizontalOrientation;
};
Submarine.prototype = Object.create(Ship.prototype);
function Battleship(horizontalOrientation) {
	this.size = 4;
	this.horizontalOrientation = horizontalOrientation;
};
Battleship.prototype = Object.create(Ship.prototype);
function AircraftCarrier(horizontalOrientation) {
	this.size = 5;
	this.horizontalOrientation = horizontalOrientation;
};
AircraftCarrier.prototype = Object.create(Ship.prototype);

// ****************************** turn stuff ******************************

// function Turn() {}
// Turn.prototype.guessLocation = function(e) {
// 	e.preventDefault();
// 	console.log(this);
// }
battleshipGame.guessLocation = function() {
	// I created this variable for the getYCoord function, which...
	// ...returns the Y coordinate of the grid square that's clicked
	// I did this because I don't feel like figuring out how to...
	// ...bind 'this' to that function
	var thisGridSquare = this;
	// the way we're getting columnLetter seems janky
	var columnLetter = this.className[6];
	var xCoord = columns.indexOf(columnLetter);

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
}

// ****************************** DOM stuff ******************************

window.onload = function() {
	var gridButton = document.getElementById('gridButton');
	var startButton = document.getElementById('startButton');
	startButton.addEventListener('click', function(e) {
		e.preventDefault();

		// removing the grid size functionality for now, since Battleship...
		// ...is normally just a 10x10 grid

		// var gridSize = gridButton.value;
		// grid = new Grid(gridSize, gridSize);
		// grid.paintBoard(grid.width, grid.height);

		// // place 2 ships
		// if(gridSize >= 5 && gridSize <= 10) {
		// 	var ship1 = new PatrolBoat();
		// 	var ship2 = new Destroyer();
		// 	var currentGameShips = [ship1, ship2];
		// 	for(var i=0; i<currentGameShips.length; i++) {
		// 		createShip(currentGameShips[i]);
		// 		currentGameShips[i].placeShip(currentGameShips[i].startingVector);
		// 	}
		// 	grid.paintBoard();
		// }
		// // place 3 ships
		// else if(gridSize >= 11 && gridSize <= 15) {
		// 	var ship1 = new PatrolBoat();
		// 	var ship2 = new Destroyer();
		// 	var ship3 = new Submarine();
		// 	var currentGameShips = [ship1, ship2, ship3];
		// 	for(var i=0; i<currentGameShips.length; i++) {
		// 		createShip(currentGameShips[i]);
		// 		currentGameShips[i].placeShip(currentGameShips[i].startingVector);
		// 	}
		// 	grid.paintBoard();
		// }
		// // place 4 ships
		// else if(gridSize >= 16 && gridSize <= 20) {
		// 	var ship1 = new PatrolBoat();
		// 	var ship2 = new Destroyer();
		// 	var ship3 = new Submarine();
		// 	var ship4 = new Battleship();
		// 	var currentGameShips = [ship1, ship2, ship3, ship4];
		// 	for(var i=0; i<currentGameShips.length; i++) {
		// 		createShip(currentGameShips[i]);
		// 		currentGameShips[i].placeShip(currentGameShips[i].startingVector);
		// 	}
		// 	grid.paintBoard();
		// }

		// for a standard 10x10 game
		grid = new Grid(10,10);
		var ship1 = new PatrolBoat();
		var ship2 = new Destroyer();
		var ship3 = new Submarine();
		var ship4 = new Battleship();
		var ship5 = new AircraftCarrier();
		var currentGameShips = [ship1, ship2, ship3, ship4, ship5];
		for(var i=0; i<currentGameShips.length; i++) {
			createShip(currentGameShips[i]);
			currentGameShips[i].placeShip(currentGameShips[i].startingVector);
		}
		grid.paintBoard();

	}); // end startButton click

	var gridSquares = document.getElementsByClassName('grid')[0].getElementsByTagName('td');
	for(var i=0; i<gridSquares.length; i++) {
		gridSquares[i].addEventListener('click', battleshipGame.guessLocation);
	}

}