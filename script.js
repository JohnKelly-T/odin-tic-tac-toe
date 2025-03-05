let tileButtons = document.querySelectorAll(".tile");
let xIcons = document.querySelectorAll(".tile .x-icon");
let oIcons = document.querySelectorAll(".tile .o-icon");
let screenboardSlides = document.querySelectorAll(".slide-screen");

let xScoreDiv = document.querySelector("#x-score");
let oScoreDiv = document.querySelector("#o-score");
let turnDiv = document.querySelector("#turn");
let tiesDiv = document.querySelector("#ties");
let quitButton = document.querySelector("#quit-button");
let resetButton = document.querySelector("#reset-button");
let nextRoundButton = document.querySelector("#next-round-button");
let gameOverMessage = document.querySelector("#game-over-message");

let player1Name = document.querySelector("#player-1-name");
let player2Name = document.querySelector("#player-2-name");

// dialogs
let mainMenu = document.querySelector("#main-menu");

let vsCpuDialog = document.querySelector("#vs-cpu-dialog");
let vsPlayerDialog = document.querySelector("#vs-player-dialog");

let newGameCpuButton = document.querySelector(".new-game-cpu");
let newGamePlayerButton = document.querySelector(".new-game-player");

let vsCpuSubmitButton = document.querySelector
// main menu elements

let xOption = document.querySelector("#x-option");
let oOption = document.querySelector("#o-option");

// form elements

let vsCpuForm = document.querySelector("#vs-cpu-form");
let vsCpuNameInput = document.querySelector("#vs-cpu-form input[name='player1-name']");

let vsPlayerForm = document.querySelector("#vs-player-form");
let vsPlayer1NameInput = document.querySelector("#vs-player-form input[name='player1-name']");
let vsPlayer2NameInput = document.querySelector("#vs-player-form input[name='player2-name']");


// event listeners 
newGameCpuButton.addEventListener("click", (e) => {
    vsCpuDialog.show();
});

vsCpuForm.addEventListener("submit", (e) => {
    e.preventDefault();

    player1Name.textContent = vsCpuNameInput.value; 
    player2Name.textContent = "CPU";

    let playerMark = xOption.hasAttribute("data-selected") ? "X" : "O";
    let cpuMark = playerMark === "X" ? "O" : "X";

    // createPlayers
    const player = createPlayer(player1Name.textContent, playerMark);
    const cpu = createPlayer("Cpu", cpuMark, true);

    if (playerMark === "X") {
        player1Name.textContent = vsCpuNameInput.value; 
        player2Name.textContent = "CPU";

        gameController.startNewGame(player, cpu, "vsCPU");
    } else {
        player1Name.textContent = "CPU";
        player2Name.textContent = vsCpuNameInput.value; 

        gameController.startNewGame(cpu, player, "vsCPU");

        gameController.makeCpuMove();
        displayController.updateTiles();
    }

    vsCpuNameInput.value = "";
    
    mainMenu.close();
    vsCpuDialog.close();
})

newGamePlayerButton.addEventListener("click", (e) => {
    vsPlayerDialog.show();
});

vsPlayerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    player1Name.textContent = vsPlayer1NameInput.value; 
    player2Name.textContent = vsPlayer1NameInput.value;

    let player1Mark = xOption.hasAttribute("data-selected") ? "X" : "O";
    let player2Mark = player1Mark === "X" ? "O" : "X";

    // createPlayers
    const player1 = createPlayer(player1Name.textContent, player1Mark);
    const player2 = createPlayer(player1Name.textContent, player2Mark);

    if (player1Mark === "X") {
        player1Name.textContent = vsPlayer1NameInput.value; 
        player2Name.textContent = vsPlayer2NameInput.value;

        gameController.startNewGame(player1, player2);
    } else {
        player1Name.textContent = vsPlayer2NameInput.value;
        player2Name.textContent = vsPlayer1NameInput.value; 

        gameController.startNewGame(player2, player1);
    }

    vsPlayer1NameInput.value = "";
    vsPlayer2NameInput.value = "";
    
    mainMenu.close();
    vsPlayerDialog.close();
})


xOption.addEventListener("click", () => {
    xOption.setAttribute("data-selected", "");
    xOption.classList.add("selected-option");

    oOption.removeAttribute("data-selected");
    oOption.classList.remove("selected-option");
});

oOption.addEventListener("click", () => {
    oOption.setAttribute("data-selected", "");
    oOption.classList.add("selected-option");

    xOption.removeAttribute("data-selected");
    xOption.classList.remove("selected-option");
});

tileButtons.forEach((button, index) => {
    button.addEventListener("click", (e) => {

        let row = Math.floor( index / 3 );
        let col= index % 3;

        gameController.updateGameState(row, col);
        displayController.updateTiles();
        displayController.updateTurnDiv();

        if (gameController.getMode() === "vsCPU") {
            screenboardSlides.forEach(slide => {slide.style.transform = "translateY(-120%)"});
            displayController.disableTileButtons();

            gameController.makeCpuMove();
            
            setTimeout(() => {
                displayController.enableEmptyButtons();
                displayController.updateScoreboard();
                screenboardSlides.forEach(slide => {slide.style.transform = ""});
    
                displayController.updateTiles();
                displayController.updateTurnDiv();
                displayController.updateScoreboard();

                if (gameController.isGameOver()) {
                    displayController.updateGameOverMessage();
                    screenboardSlides.forEach(slide => {slide.style.transform = "translateY(120%)"});
                    displayController.disableTileButtons();
                    gameController.updateScores();
                    displayController.updateScoreboard();
                }
            }, 1000);
        } else if (gameController.getMode() === "vsPlayer") {
            if (gameController.isGameOver()) {
                displayController.updateGameOverMessage();
                screenboardSlides.forEach(slide => {slide.style.transform = "translateY(120%)"});
                displayController.disableTileButtons();
                gameController.updateScores();
                displayController.updateScoreboard();
            }
        }

        button.disabled = true;
    });                                                                          
});

quitButton.addEventListener("click", () => {
    mainMenu.show();
    displayController.resetDisplay();
});

resetButton.addEventListener("click", (e) => {
    gameController.resetGame();
    displayController.updateScoreboard();
    displayController.resetDisplay();
    screenboardSlides.forEach(slide => {slide.style.transform = ""});
});

nextRoundButton.addEventListener("click", (e) => {
    screenboardSlides.forEach(slide => {slide.style.transform = ""});
    gameController.clearBoard();
    displayController.resetDisplay();
});


// factory functions

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

    function placeMark(row, col, mark) {
        gameboard[row][col] = mark;
    }

    return {getBoard, placeMark};
}

function createPlayer(name, mark, isAI=false) {
    let score = 0;

    return {
        getName: () => name,
        getMark: () => mark,
        incrementScore: () => score++,
        getScore: () => score,
        resetScore: () => {score = 0},
        isAI
    }
}

// game controller module
const gameController = (function () {
    let gameboard = createGameboard();
    let gamemode;
    let players;
    let tieCounter = 0;
    let currentPlayer;

    function startNewGame(xPlayer, oPlayer, mode="vsPlayer") {
        players = [xPlayer, oPlayer];
        currentPlayer = xPlayer;
        gamemode = mode;
    }

    function getMode() {
        return gamemode;
    }

    function getBoard() {
        return gameboard.getBoard();
    }

    function getScores() {
        let xScore = players[0].getScore();
        let oScore = players[1].getScore();
        let ties = tieCounter;
        return { xScore, oScore, ties };
    }

    function resetGame() {
        clearBoard();
        currentPlayer = players[0];
        players.forEach(player => player.resetScore());
        tieCounter = 0;
    }

    function clearBoard() {
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
                // move = prompt(`Enter your move ${currentPlayer.getName()} (enter 2 numbers responding to x and y without spaces ex. 01)`);
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

    function updateGameState(x, y) {
        gameboard.placeMark(x, y, currentPlayer.getMark());
        toggleCurrentPlayer();
    }

    function updateScores() {
        if (checkWinner() === "X") {
            players[0].incrementScore();
        } else if (checkWinner() === "O") {
            players[1].incrementScore();
        } else {
            tieCounter++;
        }
    }

    function checkWinner(board = gameboard.getBoard()) {

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

    function isGameOver(board = gameboard.getBoard()) {
        // check if board is full or if a winner has been found
        if (board.every(row => row.every(val => val !== null)) || checkWinner(board)) {
            return true;
        }

        return false;
    }

    function getValidMoves(board = gameboard.getBoard()) {
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

    function getTurnPlayer(board = gameboard.getBoard()) {
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

    function makeCpuMove() {
        if (!isGameOver()) {
            let move = getMinimaxMove();
            updateGameState(move[0], move[1]);
        }
    }

    function getMinimaxMove(board = gameboard.getBoard()) {
        let boardCopy = board.map(row => [...row]);
        let currentTurn = getTurnPlayer(board);
        let validMoves = getValidMoves(board);
        let minimaxMove;
        let value;
        // variables for alpha beta pruning
        let alpha = -Infinity;
        let beta = Infinity;

        if (currentTurn === "X") {
            value = -Infinity;
            for (let move of validMoves) {
                let minVal = min(getMoveResult(boardCopy, move), alpha, beta);
                if ( minVal > value) {
                    minimaxMove = move;
                    value = minVal;
                }

                alpha = Math.max(alpha, value);
                if (alpha >= beta) break;
            }
        } else {
            value = Infinity;
            for (let move of validMoves) {
                let maxVal = max(getMoveResult(boardCopy, move), alpha, beta);
                if (maxVal < value) {
                    minimaxMove = move;
                    value = maxVal;
                }

                beta = Math.min(beta, value);
                if (alpha >= beta) break;
            }
        }

        return minimaxMove;
    }

    function max(board, alpha, beta) {
        let boardCopy = board.map(row => [...row]);

        if (isGameOver(board)) {
            return getBoardUtility(board);
        }

        // state value
        let value = -Infinity;

        for (let move of getValidMoves(board)) {
            value = Math.max(value, min(getMoveResult(boardCopy, move), alpha, beta));
            alpha = Math.max(alpha, value);
            if (alpha >= beta) break;
        }

        return value;
    }

    function min(board, alpha, beta) {
        let boardCopy = board.map(row => [...row]);

        if (isGameOver(board)) {
            return getBoardUtility(board);
        }

        // state value
        let value = Infinity;

        for (let move of getValidMoves(board)) {
            value = Math.min(value, max(getMoveResult(boardCopy, move), alpha, beta));
            beta = Math.min(beta, value);
            if (alpha >= beta) break;
        }

        return value;
    }

    return { startNewGame, getMode, getBoard, clearBoard, getScores, updateScores, resetGame, isGameOver, playRoundConsole, updateGameState, getTurnPlayer, checkWinner, makeCpuMove };
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

const displayController = (function () {

    function updateTiles() {
        let gameboard = gameController.getBoard();

        gameboard.flat().forEach((mark, index) => {
            if (mark === "X") {
                xIcons[index].style.display = "block";
            } else if (mark === "O") {
                oIcons[index].style.display = "block";
            }
        });
    }

    function updateScoreboard() {
        let scores = gameController.getScores();

        xScoreDiv.textContent = scores.xScore.toString();
        oScoreDiv.textContent = scores.oScore.toString();
        tiesDiv.textContent = scores.ties.toString();
    }

    function updateTurnDiv() {
        let turn = gameController.getTurnPlayer();
        turnDiv.textContent = turn;
    }

    function updateGameOverMessage() {
        let winner = gameController.checkWinner();

        if (winner === "X") {
            gameOverMessage.textContent = "X takes the round!";
        } else if (winner === "O") {
            gameOverMessage.textContent = "O takes the round!";
        } else {
            gameOverMessage.textContent = "It's a tie!";
        }

        highlightWinnerTiles(winner);
    }

    function highlightWinnerTiles(winner) {
        let board = gameController.getBoard();
        let winnerTiles = [];

        if (winner === null) {
            return;
        }

        // get winner Tile indexes
        for (let i = 0; i < 3; i++) {
            // check rows
            if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                winnerTiles.push([i, 0], [i, 1], [i, 2]);
            }   

            // check columns
            if (board[0][i] !== null && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                winnerTiles.push([0, i], [1, i], [2, i]);
            }
        }

        // Check diagonals
        if (board[1][1] !== null) {
            if ((board[0][0] === board[1][1] && board[1][1] === board[2][2])) {
                winnerTiles.push([0, 0], [1, 1], [2, 2]);
            } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
                winnerTiles.push([0, 2], [1, 1], [2, 0]);
            }
        }

        let tileColor = (winner === "X") ? "red-surface" : "cyan-surface";

        for (let index2d of winnerTiles) {
            let index1d = (index2d[0] * 3) + (index2d[1] % 3);
            xIcons[index1d].classList.add("dark-icon");
            oIcons[index1d].classList.add("dark-icon");
            tileButtons[index1d].classList.add(tileColor);
        }

    }

    function resetDisplay() {
        document.querySelectorAll(".tile .tile-icon").forEach(tileIcon => {
            tileIcon.style.display = "none";
            tileIcon.classList.remove("dark-icon");
        });

        tileButtons.forEach(button => {
            button.classList.remove("red-surface");
            button.classList.remove("cyan-surface");
        })

        turnDiv.textContent = "X";
        enableTileButtons();

        gameController.startNewGame(player1, player2);
    }

    function disableTileButtons() {
        tileButtons.forEach(button => {
            button.disabled = true;
        });
    }

    function enableTileButtons() {
        tileButtons.forEach(button => {
            button.disabled = false;
        });
    }

    function disableMarkedButtons() {
        let board = gameController.getBoard().flat();

        board.forEach( (mark, index) => {
            if (mark !== null) {
                tileButtons[index].disabled = true;
            }
        });
    }

    function enableEmptyButtons() {
        let board = gameController.getBoard().flat();

        board.forEach( (mark, index) => {
            if (mark === null) {
                tileButtons[index].disabled = false;
            }
        });
    }

    return { updateTiles, updateScoreboard, resetDisplay, updateGameOverMessage, disableTileButtons, enableTileButtons, disableMarkedButtons, enableEmptyButtons, updateTurnDiv };
})();


