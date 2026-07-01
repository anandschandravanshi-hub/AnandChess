// ==================================================
// Anand Chess - History
// Handles move history, undo and replay.
// ==================================================

function saveMove(movingPiece, capturedPiece, fromRow, fromCol, toRow, toCol) {

    // Move History
    moveHistory.push({
    piece: movingPiece,
    from: files[fromCol] + (8 - fromRow),
    to: files[toCol] + (8 - toRow),
    captured: capturedPiece,

    notation: getMoveNotation(
    movingPiece,
    fromCol,
    toRow,
    toCol,
    capturedPiece
)
});
    // Last Move
    lastMove = {
        piece: movingPiece,
        fromRow,
        fromCol,
        toRow,
        toCol
    };
    lastMoveHighlight = {
    fromRow,
    fromCol,
    toRow,
    toCol
};

    // ======================
    // 50-Move Rule
    // ======================
    if (
        movingPiece === "♙" ||
        movingPiece === "♟" ||
        capturedPiece !== ""
    ) {
        halfMoveClock = 0;
    } else {
        halfMoveClock++;
    }

    // ======================
    // En Passant
    // ======================
    enPassantSquare = null;

    // White pawn moved 2 squares
    if (
        movingPiece === "♙" &&
        fromRow === 6 &&
        toRow === 4
    ) {
        enPassantSquare = [5, fromCol];
    }

    // Black pawn moved 2 squares
    if (
        movingPiece === "♟" &&
        fromRow === 1 &&
        toRow === 3
    ) {
        enPassantSquare = [2, fromCol];
    }

    // ======================
    // Threefold Repetition
    // ======================
    positionHistory.push(JSON.stringify(board));

    // Temporary Debug
    console.log(positionHistory.length);

}
function undoMove() {

    if (boardHistory.length === 0) {
        return;
    }

    const previousState = boardHistory.pop();
    
    currentPosition = boardHistory.length - 1;

    for (let displayRow = 0; displayRow < 8; displayRow++) {

    for (let displayCol = 0; displayCol < 8; displayCol++) {
        let row = boardFlipped
    ? 7 - displayRow
    : displayRow;

let col = boardFlipped
    ? 7 - displayCol
    : displayCol;

        board[row][col] = previousState.board[row][col];

    }

}

currentPlayer = previousState.currentPlayer;

lastMoveHighlight = previousState.lastMoveHighlight;

    moveHistory.pop();

    

    updateMoveHistory();

    updateCapturedPieces();

    renderBoard();

     console.log("Current Position:", currentPosition);

}

const firstMoveBtn = document.getElementById("first-move-btn");
const prevMoveBtn = document.getElementById("prev-move-btn");
const nextMoveBtn = document.getElementById("next-move-btn");
const lastMoveBtn = document.getElementById("last-move-btn");
firstMoveBtn.addEventListener("click", () => {

    if (boardHistory.length === 0) {
        return;
    }

    const firstState = boardHistory[0];

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            board[row][col] = firstState.board[row][col];

        }

    }

    currentPlayer = firstState.currentPlayer;

    lastMoveHighlight = firstState.lastMoveHighlight;

    renderBoard();

});

prevMoveBtn.addEventListener("click", () => {

    if (currentPosition <= 0) {
        return;
    }

    currentPosition--;

    const state = boardHistory[currentPosition];

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            board[row][col] = state.board[row][col];

        }

    }

    currentPlayer = state.currentPlayer;

    lastMoveHighlight = state.lastMoveHighlight;
    

    renderBoard();

});

nextMoveBtn.addEventListener("click", () => {

    console.log("Next button clicked");

});

lastMoveBtn.addEventListener("click", () => {

    console.log("Last button clicked");

});