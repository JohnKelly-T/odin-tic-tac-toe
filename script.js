function createGameboard() {
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    function getBoard() {
        let gameboardCopy = gameboard.map(row => [...row]);
        return gameboardCopy;
    }

    function placeMark(x, y, mark) {
        gameboard[x][y] = mark;
    }

    return {getBoard, placeMark};
}

function createPlayer(name, mark, isAI=false) {
    const score = 0;

    return {
        getName: () => name,
        getMark: () => mark,
        incrementScore: () => score++,
        getScore: () => score,
        isAI
    }
}

const gameController = (function () {
    let gameboard = createGameboard();
    let players;
    let currentPlayer;

    function startNewGame(xPlayer, oPlayer) {
        players = [xPlayer, oPlayer];
        currentPlayer = xPlayer;
    }

    function resetGameBoard() {
        gameboard = createGameboard();
    }

    function toggleCurrentPlayer() {
        currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
    } 

    function playRoundConsole() {
        while(true) {
            let move;
            let moveX;
            let moveY;

            if (!currentPlayer.isAI) {
                move = prompt(`Enter your move ${currentPlayer.getName()} (enter 2 numbers responding to x and y without spaces ex. 01)`);
                moveX = parseInt(move.split("")[0]);
                moveY = parseInt(move.split("")[1]);
            } else {
                move = getMinimaxMove(gameboard.getBoard());
                moveX = move[0];
                moveY = move[1];
            }

            gameboard.placeMark(moveX, moveY, currentPlayer.getMark());

            displayGameToConsole(gameboard.getBoard());

            if (isGameOver(gameboard.getBoard())) {
                break;
            }

            toggleCurrentPlayer();
            
        }

        let winner = (checkWinner(gameboard.getBoard()) === currentPlayer.getMark()) ? currentPlayer.getName() : "It's a tie";
        alert("Congrats " + winner);
    }

    function checkWinner(board) {

        for (let i = 0; i < 3; i++) {
            // check rows
            if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return board[i][0];
            }   

            // check columns
            if (board[0][i] !== null && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return board[0][i];
            }
        }

        // Check diagonals
        if (board[1][1] !== null) {
            if (
                (board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
                (board[0][2] === board[1][1] && board[1][1] === board[2][0])
            ) {
                return board[1][1];
            }
        }

        return null;
    }

    function isGameOver(board) {
        // check if board is full or if a winner has been found
        if (board.every(row => row.every(val => val !== null)) || checkWinner(board)) {
            return true;
        }

        return false;
    }

    function getValidMoves(board) {
        let validMoves = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === null) {
                    validMoves.push([i, j]);
                }
            }
        }

        return validMoves;
    }

    function getTurnPlayer(board) {
        let x = 0;
        let o = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "X") {
                    x++;
                } else if (board[i][j] === "O") {
                    o++;
                }
            }
        }

        return (x === o) ? "X" : "O";
        
    }
    
    function getMoveResult(board, move) {
        let boardCopy = board.map(row => [...row]);
        let validMoves = getValidMoves(board);

        try {
            if (validMoves.some(validMove => JSON.stringify(validMove) === JSON.stringify(move))) {
                boardCopy[move[0]][move[1]] = getTurnPlayer(board);
                return boardCopy;
            } else {
                throw "not a valid move";
            }
        } catch(error) {
            console.log("Error: " + error + ".");
            return null;
        }
    }

    function getBoardUtility(board) {

        let winner = checkWinner(board);
        let utility;

        if (winner === "X") {
            utility = 1;
        } else if (winner === "O") {
            utility = -1;
        } else if (winner === null) {
            utility = 0;
        }

        return utility;
    }

    function getMinimaxMove(board) {
        let boardCopy = board.map(row => [...row]);
        let currentTurn = getTurnPlayer(board);
        let validMoves = getValidMoves(board);
        let minimaxMove;
        let value;

        if (currentTurn === "X") {
            value = -Infinity;
            for (let move of validMoves) {
                let minVal = min(getMoveResult(boardCopy, move));
                if ( minVal > value) {
                    minimaxMove = move;
                    value = minVal;
                }
            }
        } else {
            value = Infinity;
            for (let move of validMoves) {
                let maxVal = max(getMoveResult(boardCopy, move));
                if (maxVal < value) {
                    minimaxMove = move;
                    value = maxVal;
                }
            }
        }

        return minimaxMove;
    }

    function max(board) {
        let boardCopy = board.map(row => [...row]);

        if (isGameOver(board)) {
            return getBoardUtility(board);
        }

        // state value
        let value = -Infinity;

        for (let move of getValidMoves(board)) {
            value = Math.max(value, min(getMoveResult(boardCopy, move)));
        }

        return value;
    }

    function min(board) {
        let boardCopy = board.map(row => [...row]);

        if (isGameOver(board)) {
            return getBoardUtility(board);
        }

        // state value
        let value = Infinity;

        for (let move of getValidMoves(board)) {
            value = Math.min(value, max(getMoveResult(boardCopy, move)));
        }

        return value;
    }

    return { startNewGame, playRoundConsole };
})();

function displayGameToConsole(board) {
    console.clear();
    console.log(
        "-------------------------\n" + 
        "|       |       |       |\n" +
        board[0].map(item => item === null ? "|       " :  "|   " + item + "   ").join("") + "|\n" +
        "|       |       |       |\n" +
        "-------------------------\n" + 
        "|       |       |       |\n" +
        board[1].map(item => item === null ? "|       " :  "|   " + item + "   ").join("") + "|\n" +
        "|       |       |       |\n" +
        "-------------------------\n" + 
        "|       |       |       |\n" +
        board[2].map(item => item === null ? "|       " :  "|   " + item + "   ").join("") + "|\n" +
        "|       |       |       |\n" +
        "-------------------------\n" 
    );
}

// createPlayers
const player1 = createPlayer("John", "X");
const player2 = createPlayer("Kelly", "O", true);

gameController.startNewGame(player1, player2);
gameController.playRoundConsole();


