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

let xPlayerName = document.querySelector("#player-1-name");
let oPlayerName = document.querySelector("#player-2-name");

// dialogs

let mainMenu = document.querySelector("#main-menu");

let vsCpuDialog = document.querySelector("#vs-cpu-dialog");
let vsPlayerDialog = document.querySelector("#vs-player-dialog");

let newGameCpuButton = document.querySelector(".new-game-cpu");
let newGamePlayerButton = document.querySelector(".new-game-player");

// main menu elements

let xOption = document.querySelector("#x-option");
let oOption = document.querySelector("#o-option");

// form elements

let vsCpuForm = document.querySelector("#vs-cpu-form");
let vsCpuNameInput = document.querySelector("#vs-cpu-form input[name='player1-name']");

let vsPlayerForm = document.querySelector("#vs-player-form");
let vsPlayer1NameInput = document.querySelector("#vs-player-form input[name='player1-name']");
let vsPlayer2NameInput = document.querySelector("#vs-player-form input[name='player2-name']");

// audio 
const mainMenuMusic = new Audio("./audio/neon-gaming.mp3");
mainMenuMusic.loop = true;

const battleMusic = new Audio("./audio/chiptune-grooving.mp3");
battleMusic.loop = true;

const gameStartSound = new Audio("./audio/game-start.mp3");

const gameOverSound = new Audio("./audio/round-end.mp3");

const clickSound = new Audio("./audio/click-sound.mp3");
clickSound.preload = "auto";

function stopAllSounds() {
    mainMenuMusic.pause();
    mainMenuMusic.currentTime = 0;
    battleMusic.pause();
    mainMenuMusic.currentTime = 1;
}


// event listeners

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => clickSound.play());
});

newGameCpuButton.addEventListener("click", (e) => {
    mainMenuMusic.play()
    vsCpuDialog.show();
});

vsCpuForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let playerName = vsCpuNameInput.value;
    displayController.startNewGame(playerName);

    vsCpuNameInput.value = "";

    mainMenu.close();
    vsCpuDialog.close();
    
    stopAllSounds();
    gameStartSound.play();
    battleMusic.currentTime = 0;
    battleMusic.play();
})

newGamePlayerButton.addEventListener("click", (e) => {
    mainMenuMusic.play()
    vsPlayerDialog.show();
});

vsPlayerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let firstPlayerName = vsPlayer1NameInput.value;
    let secondPlayerName = vsPlayer2NameInput.value;

    displayController.startNewGame(firstPlayerName, secondPlayerName);

    vsPlayer1NameInput.value = "";
    vsPlayer2NameInput.value = "";
    
    mainMenu.close();
    vsPlayerDialog.close();

    stopAllSounds();
    gameStartSound.play();
    battleMusic.currentTime = 0;
    battleMusic.play();
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

        displayController.makeMove(row, col);
    });                                                                          
});

quitButton.addEventListener("click", () => {
    mainMenuMusic.play();
    mainMenu.show();
    gameController.resetGame();
    displayController.resetDisplay();
    displayController.showScoreboardScreen();

    stopAllSounds();
    mainMenuMusic.currentTime = 0;
    mainMenuMusic.pause();
    mainMenuMusic.play();
});

resetButton.addEventListener("click", (e) => {
    gameController.resetGame();
    displayController.updateScoreboard();
    gameController.clearBoard();
    displayController.resetDisplay();
    displayController.updateTiles();
    screenboardSlides.forEach(slide => {slide.style.transform = ""});
});

nextRoundButton.addEventListener("click", (e) => {
    screenboardSlides.forEach(slide => {slide.style.transform = ""});
    gameController.clearBoard();
    displayController.resetDisplay();
    displayController.updateTiles();

    battleMusic.currentTime = 1;
    battleMusic.play();
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
    let gameboard;
    let players;
    let tieCounter = 0;
    let currentPlayer;

    function createGame(xPlayer, oPlayer) {
        players = [xPlayer, oPlayer];
        currentPlayer = xPlayer;
        gameboard = createGameboard();
        
        if (xPlayer.isAI) {
            makeCpuMove();
        }
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
        currentPlayer = players[0];
        if (currentPlayer.isAI) {
            makeCpuMove();
        }
    }

    function toggleCurrentPlayer() {
        currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
    } 

    function updateGameState(row, col) {
        let validMoves = getValidMoves();
        
        if (validMoves.some(([r , c]) => r === row && c === col)) {
            gameboard.placeMark(row, col, currentPlayer.getMark());
        } else {
            return false;
        }

        toggleCurrentPlayer();
        return true;
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

    return { createGame, getBoard, clearBoard, getScores, updateScores, resetGame, isGameOver, updateGameState, getTurnPlayer, checkWinner, makeCpuMove };
})();

const displayController = (function () {
    let gamemode;

    function startNewGame(firstPlayerName, secondPlayerName="CPU") {

        let firstPlayerMark;
        let secondPlayerMark;

        // get player marks
        if (xOption.hasAttribute("data-selected")) {
            firstPlayerMark = "X";
            secondPlayerMark = "O";
            xPlayerName.textContent = firstPlayerName; 
            oPlayerName.textContent = secondPlayerName;
        } else {
            secondPlayerMark = "X";
            firstPlayerMark = "O";
            xPlayerName.textContent = secondPlayerName; 
            oPlayerName.textContent = firstPlayerName;
        }
    
        // createPlayers
        let xPlayer;
        let oPlayer;
        if (secondPlayerName === "CPU") {
            gamemode = "vsCpu";
            xPlayer = (firstPlayerMark === "X") ? createPlayer(firstPlayerName, firstPlayerMark) : createPlayer(secondPlayerName, secondPlayerMark, true);
            oPlayer = (firstPlayerMark === "O") ? createPlayer(firstPlayerName, firstPlayerMark) : createPlayer(secondPlayerName, secondPlayerMark, true);
        } else {
            gamemode = "vsPlayer";
            xPlayer = (firstPlayerMark === "X") ? createPlayer(firstPlayerName, firstPlayerMark) : createPlayer(secondPlayerName, secondPlayerMark);
            oPlayer = (firstPlayerMark === "O") ? createPlayer(firstPlayerName, firstPlayerMark) : createPlayer(secondPlayerName, secondPlayerMark);
        }
    
        gameController.createGame(xPlayer, oPlayer);
        updateTiles();
    }

    function makeMove(row, col) {
        let moveWasMade = gameController.updateGameState(row, col);
        updateTiles();

        let timeout = 0;

        if (gamemode === "vsCpu" && !gameController.isGameOver() && moveWasMade) {
            timeout = 1000;

            disableTileButtons();
            gameController.makeCpuMove();
            showCpuThinkingMessage();
        }

        setTimeout(() => {
            updateTurnDiv();
            showScoreboardScreen();
            updateTiles();
            enableTileButtons();

            if (gameController.isGameOver()) {
                gameController.updateScores();
                updateGameOverMessage();
                showGameOverMessage();
                disableTileButtons();
            }

            updateScoreboard();

        }, timeout);
    }

    function showCpuThinkingMessage() {
        screenboardSlides.forEach(slide => {slide.style.transform = "translateY(-120%)"});
    }

    function showScoreboardScreen() {
        screenboardSlides.forEach(slide => {slide.style.transform = ""})
    }

    function showGameOverMessage() {
        screenboardSlides.forEach(slide => {slide.style.transform = "translateY(120%)"});
    }

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
        gameOverSound.play();
        stopAllSounds();

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
            }

            if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
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
        updateScoreboard();
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

    return { startNewGame, makeMove, updateTiles, updateScoreboard, showScoreboardScreen, resetDisplay, updateGameOverMessage, disableTileButtons, enableTileButtons, updateTurnDiv };
})();

mainMenu.close();
mainMenu.show();