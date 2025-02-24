function createGameboard() {
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    function getBoard() {
        const gameboardCopy = gameboard.map(row => [...row]);
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

    return {getBoard, placeMark, isGameOver};
}

let game = createGameboard();

game.placeMark(0, 0, "X");
game.placeMark(0, 1, "O");
game.placeMark(0, 2, "X");

game.placeMark(1, 0, "X");
game.placeMark(1, 1, "O");
game.placeMark(1, 2, "X");

game.placeMark(2, 0, "X");
game.placeMark(2, 1, "X");
game.placeMark(2, 2, "O");

console.log(game.getBoard());

