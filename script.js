function createGameboard() {
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    function getBoard() {
        let gameboardCopy = gameboard.map(row => [...row]);
        return gameboardCopy;
    };

    function placeMark(x, y, mark) {
        gameboard[x][y] = mark;
    };

    function checkWinner() {

        for (let i = 0; i < 3; i++) {
            // check rows
            if (gameboard[i][0] !== null && gameboard[i][0] === gameboard[i][1] && gameboard[i][1] === gameboard[i][2]) {
                return gameboard[i][0];
            }   

            // check columns
            if (gameboard[0][i] !== null && gameboard[0][i] === gameboard[1][i] && gameboard[1][i] === gameboard[2][i]) {
                return gameboard[0][i];
            }
        }

        // Check diagonals
        if (gameboard[1][1] !== null) {
            if (
                (gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) ||
                (gameboard[0][2] === gameboard[1][1] && gameboard[1][1] === gameboard[2][0])
            ) {
                return gameboard[1][1];
            }
        }

        return null;
    };

    function isGameOver() {
        // check if board is full or if a winner has been found
        if (gameboard.every(row => row.every(val => val !== null)) || checkWinner()) {
            return true;
        }

        return false;
    }

    return {getBoard, placeMark, checkWinner, isGameOver};
}

function createPlayer(name, mark) {
    const score = 0;

    return {
        getName: () => name,
        getMark: () => mark,
        incrementScore: () => score++,
        getScore: () => score
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
            let move = prompt(`Enter your move ${currentPlayer.getName()} (enter 2 numbers responding to x and y without spaces ex. 01)`);
            let moveX = parseInt(move.split("")[0]);
            let moveY = parseInt(move.split("")[1]);

            gameboard.placeMark(moveX, moveY, currentPlayer.getMark());

            displayGameToConsole(gameboard.getBoard());

            if (gameboard.isGameOver()) {
                break;
            }

            toggleCurrentPlayer();
            
        }

        let winner = (gameboard.checkWinner() === currentPlayer.getMark()) ? currentPlayer.getName() : "It's a tie";
        alert("Congrats " + winner);
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
const player2 = createPlayer("Kelly", "O");

gameController.startNewGame(player1, player2);
gameController.playRoundConsole();

