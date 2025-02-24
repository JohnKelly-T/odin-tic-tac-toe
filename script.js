function createGameboard() {
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    function getBoard() {
        return gameboard;
    };

    return {getBoard};
}

let game = createGameboard();

console.log(game.getBoard());