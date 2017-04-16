$("document").ready(function() {
	// original board
	var board = [0, 1, 2,
				 3, 4, 5,
				 6, 7, 8];


	var winningCases = [[0, 1, 2], // horizontal
						[3, 4, 5],
						[6, 7, 8],
						[0, 3, 6], // vertical
						[1, 4, 7],
						[2, 5, 8],
						[0, 4, 8], // diagonal
						[2, 4, 6]
						];

	var human;
	var computer;
	var humanSymbol;
	var computerSymbol;
	var humanScore = 0;
	var computerScore = 0;
	var move;

	updateScore();
	randomFirstTurn();


	// display modal
	$("#myModal").modal();

	// choose symbol
	$("#xSymbol").on("click", function() {
		humanSymbol = "<i class='fa fa-times' style='color: #e97a2e'></i>";
		computerSymbol = "<i class='fa fa-circle' style='color: #fec842'></i>";
		human = "X";
		computer = "O";
		$("#myModal").modal('hide');
	});

	$("#oSymbol").on("click", function() {
		humanSymbol = "<i class='fa fa-circle' style='color: #fec842'></i>";
		computerSymbol = "<i class='fa fa-times' style='color: #e97a2e'></i>";
		human = "O";
		computer = "X";
		$("#myModal").modal('hide');
	});



	// reset the game
	$("#reset").on("click", function() {		
		humanScore = 0;
		computerScore = 0;

		updateScore();

		// let player choose symbol
		$("#myModal").modal();
		// run newGame() after the modal is closed
		$("#myModal").on("hidden.bs.modal", function() {
			newGame();
		});		
	});



	// event handler for tiles on click 
	$("td").on("click", function() {
		// prevent computer from playing when player accidentally clicks on a claimed tile 
		if ($(this).html() == "") {
			$(this).html(humanSymbol);
			updateBoard( $(this).attr("id"), human );
			$(this).addClass("claimed");					
			computerAI();
			checkWin();
		}
	});




	// update players' score
	function updateScore() {
		$("#humanScore").html("<i class='fa fa-user-o'></i>" + humanScore);
		$("#computerScore").html("<i class='fa fa-desktop'></i>" + computerScore);
	}


	// start a new game after the game is over
	function newGame() {
		board = [0, 1, 2,
				 3, 4, 5,
				 6, 7, 8];

	 	winningCases = [[0, 1, 2], // horizontal
						[3, 4, 5],
						[6, 7, 8],
						[0, 3, 6], // vertical
						[1, 4, 7],
						[2, 5, 8],
						[0, 4, 8], // diagonal
						[2, 4, 6]
						];

		$("td").html("");
		$("td").removeClass("claimed");
		$("#gameState").text("");

		randomFirstTurn();
	}
	


	// randomly decide who gets the first turn
	function randomFirstTurn() {
		var random =  Number( Math.random().toFixed() );
		
		// if random == 0, computer goes first. Else, human goes first 
		if (random == 0) {
			console.log("computer goes first");
			randomMove();
		} else {
			console.log("human goes first");
		}				
 	}


 	// if computer has first move, choose a random tile
 	function randomMove() {
		var availTiles = emptyTiles(board);
		random = Math.floor( Math.random() * availTiles.length );
		move = availTiles[random];
		computerPlays(move);
 	}


	// update the board after each move
	function updateBoard(claimedTile, player) {
		board[claimedTile] = player;

		for (var i = 0; i < winningCases.length; i++) {
			for (var j = 0; j < winningCases[i].length; j++) {
				if (winningCases[i][j] == claimedTile) {winningCases[i][j] = player};
			}
		}
	}


	// returns list of the indexes of empty spots on the board
	function emptyTiles(board){
	  return  board.filter(tile => tile != "O" && tile != "X");
	}


	// check if player wins. If so, announce the winner and start a new game
	function checkWin() {
		var availTiles = emptyTiles(board);

		for (var i = 0; i < winningCases.length; i++) {
			if (winningCases[i][0] == winningCases[i][1] && winningCases[i][1] == winningCases[i][2] && winningCases[i][2] == human) {
				$("#gameState").text("You win!");
				$("td").addClass("claimed");
				humanScore++;
				updateScore(); 
				setTimeout(newGame, 1500);
				return
			} else if (winningCases[i][0] == winningCases[i][1] && winningCases[i][1] == winningCases[i][2] && winningCases[i][2] == computer) {
				$("#gameState").text("Computer wins!");
				$("td").addClass("claimed");
				computerScore++;
				updateScore();
				setTimeout(newGame, 1500);
				return;
			}  
		}

		if (availTiles.length == 0) {
			$("#gameState").text("It's a tie.");
			setTimeout(newGame, 1500);
		}
	}


	// computer makes a move
	function computerPlays(move) {
		$("#" + move).html(computerSymbol);
		$("#" + move).addClass("claimed");
		updateBoard(move, computer);
	}


	// find a row that a player can win
	function twoInARow(player) {
		for (var i = 0; i < winningCases.length; i++) {
			if (winningCases[i][0] == player && winningCases[i][1] == player && typeof(winningCases[i][2]) == "number") {
				move = winningCases[i][2];
				return true;
			} else if (winningCases[i][0] == player && typeof(winningCases[i][1]) == "number" && winningCases[i][2] == player) {
				move = winningCases[i][1];
				return true;
			} else if (typeof(winningCases[i][0]) == "number" && winningCases[i][1] == player && winningCases[i][2] == player) {
				move = winningCases[i][0];
				return true;
			}			
		}
		return false;
	}


	// create a fork
	function createFork() {
		if (board[0] == computer && board[4] == human && board[8] == 8) {
			move = 8;
			return true;
		} else if (board[0] == 0 && board[4] == human && board[8] == computer) {
			move = 0;
			return true;
		} else if (board[2] == computer && board[4] == human && board[6] == 6) {
			move = 6;
			return true;
		} else if (board[2] == 2 && board[4] == human && board[6] == computer) {
			move = 2;
			return true;
		}
		return false;
	}


	// find and block a fork
	function blockFork() {
		if (board[0] == human && board[4] == computer && board[8] == human ||
			board[2] == human && board[4] == computer && board[6] == human) {
			
			// if find any fork, play any middle tile
			var random = Math.floor( Math.random() * findMiddle().length);
			move = findMiddle()[random];
			return true;
		}
		return false;
	}


	// find available corner tiles
	function findCorner() {
		var availTiles = emptyTiles(board);
		
		var corner = availTiles.filter(tile => tile == 0 || tile == 2 || tile == 6 || tile == 8);

		return corner;
	}


	// find available middle tiles
	function findMiddle() {
		var availTiles = emptyTiles(board);

		var middle = availTiles.filter(tile => tile == 1 || tile == 3 || tile == 5 || tile == 7);

		return middle;
	}



	// logic for computer to make a move
	function computerAI() {
		var random;		

		// if computer has 2 in a row and the third spot is free, take it to WIN
		if (twoInARow(computer)) {
			computerPlays(move);
			return;			
		}
		// if human has 2 in a row and the third spot is free, take it to BLOCK
		else if (twoInARow(human)) {
			computerPlays(move);
			return;			
		}
		// create a fork
		else if (createFork()) {
			computerPlays(move);
			return;
		}
		// block a fork
		else if (blockFork()) {
			computerPlays(move);
			return;
		}
		// if center spot is free, take it
		if (board[4] == 4) {
			computerPlays(4);			
		}
		// if human has one corner and the opposite corner is available, take it
		else if (board[0] == human && board[8] == 8) {
			computerPlays(8);			
		}
		else if (board[8] == human && board[0] == 0) {
			computerPlays(0);			
		}
		else if (board[2] == human && board[6] == 6) {
			computerPlays(6);			
		}
		else if (board[6] == human && board[2] == 2) {
			computerPlays(2);			
		}
		// if there is any available corner, take it
		else if (findCorner().length > 0) {
			random = Math.floor( Math.random() * findCorner().length);
			move = findCorner()[random];
			computerPlays(move);
			return;

		}
		// if there is any available middle tile, take it
		else if (findMiddle().length > 0) {
			random = Math.floor( Math.random() * findMiddle().length);
			move = findMiddle()[random];
			computerPlays(move);
			return;
		}
	}		
});