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

    function isGameOver() {

        for (let i = 0; i < 3; i++) {
            // check rows
            if (gameboard[i][0] !== null && gameboard[i][0] === gameboard[i][1] && gameboard[i][1] === gameboard[i][2]) {
                return true;
            }   

            // check columns
            if (gameboard[0][i] !== null && gameboard[0][i] === gameboard[1][i] && gameboard[1][i] === gameboard[2][i]) {
                return true;
            }
        }

        // Check diagonals
        if (gameboard[1][1] !== null) {
            if (
                (gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]) ||
                (gameboard[0][2] === gameboard[1][1] && gameboard[1][1] === gameboard[2][0])
            ) {
                return true;
            }
        }

        // check if board is full
        return gameboard.every(row => row.every(val => val !== null));
    };

    return {getBoard, placeMark, isGameOver};
}

let game = createGameboard();

game.placeMark(0, 0, "X");
game.placeMark(0, 1, "O");
game.placeMark(0, 2, "X");

game.placeMark(1, 0, "X");
game.placeMark(1, 1, "O");
game.placeMark(1, 2, "X");

game.placeMark(2, 0, "O");
game.placeMark(2, 1, "X");
game.placeMark(2, 2, "O");

console.log(game.isGameOver());
console.log(game.getBoard());

