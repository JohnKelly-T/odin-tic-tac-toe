function createGameboard() {
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    function getBoard() {
        let gameboardCopy = gameboard.slice();
        return gameboardCopy;
    };

    function placeMark(x, y, mark) {
        gameboard[x][y] = mark;
    };

    return {getBoard, placeMark};
}

let game = createGameboard();

console.log(game.getBoard());

game.placeMark(0, 0, "X");
console.log(game.getBoard());

