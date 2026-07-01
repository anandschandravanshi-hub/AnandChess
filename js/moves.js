// ===============================
// Anand Chess
// Move Engine
// ===============================

function getLegalMoves(piece, row, col) {

    switch (piece) {

        case "♙":
            return getWhitePawnMoves(row, col);

        case "♟":
            return getBlackPawnMoves(row, col);

        case "♘":
            return getKnightMoves(row, col, "white");

        case "♞":
            return getKnightMoves(row, col, "black");

        case "♗":
            return getBishopMoves(row, col, "white");

        case "♝":
            return getBishopMoves(row, col, "black");

        case "♖":
            return getRookMoves(row, col, "white");

        case "♜":
            return getRookMoves(row, col, "black");

        case "♕":
            return getQueenMoves(row, col, "white");

        case "♛":
            return getQueenMoves(row, col, "black");

        case "♔":
        return getKingMoves(row, col, "white");

        case "♚":
        return getKingMoves(row, col, "black");
        default:
            return [];
    }
}
function isLegalMove(row, col) {

    for (const move of legalMoves) {

        if (move[0] === row && move[1] === col) {
            return true;
        }

    }

    return false;
}
async function makeMove(fromRow, fromCol, toRow, toCol) {

   

    const movingPiece = board[fromRow][fromCol];
    const capturedPiece = board[toRow][toCol];

    // Track king & rook movement
    trackPieceMovement(movingPiece, fromRow, fromCol);

    // Animate first
await animateMove(
    movingPiece,
    fromRow,
    fromCol,
    toRow,
    toCol
);

// Then update board
executeMove(
    movingPiece,
    fromRow,
    fromCol,
    toRow,
    toCol
);
 boardHistory.push({

    board: JSON.parse(JSON.stringify(board)),

    currentPlayer: currentPlayer,

    lastMoveHighlight: lastMoveHighlight
        ? { ...lastMoveHighlight }
        : null

});
    currentPosition = boardHistory.length - 1;

    // Validate move
    if (!validateMove(
        movingPiece,
        capturedPiece,
        fromRow,
        fromCol,
        toRow,
        toCol
    )) {
        return false;
    }

    // Save move
    saveMove(
        movingPiece,
        capturedPiece,
        fromRow,
        fromCol,
        toRow,
        toCol
    );

    // Finish turn
    finishTurn();
    console.log("Half Move:", halfMoveClock);

    // Check game state
    checkGameState();

    // Update UI
    updateMoveHistory();
    updateCapturedPieces();
    renderBoard();

    return true;

}
function executeMove(movingPiece, fromRow, fromCol, toRow, toCol) {

    // Normal move
    board[toRow][toCol] = movingPiece;
    board[fromRow][fromCol] = "";
    // ======================
// EN PASSANT
// ======================

// White En Passant
if (
    movingPiece === "♙" &&
    enPassantSquare &&
    toRow === enPassantSquare[0] &&
    toCol === enPassantSquare[1]
) {
    board[toRow + 1][toCol] = "";
}

// Black En Passant
if (
    movingPiece === "♟" &&
    enPassantSquare &&
    toRow === enPassantSquare[0] &&
    toCol === enPassantSquare[1]
) {
    board[toRow - 1][toCol] = "";
}

    // ======================
    // CASTLING
    // ======================

    // White King Side
    if (
        movingPiece === "♔" &&
        fromRow === 7 &&
        fromCol === 4 &&
        toRow === 7 &&
        toCol === 6
    ) {
        board[7][5] = "♖";
        board[7][7] = "";
    }

    // White Queen Side
    if (
        movingPiece === "♔" &&
        fromRow === 7 &&
        fromCol === 4 &&
        toRow === 7 &&
        toCol === 2
    ) {
        board[7][3] = "♖";
        board[7][0] = "";
    }

    // Black King Side
    if (
        movingPiece === "♚" &&
        fromRow === 0 &&
        fromCol === 4 &&
        toRow === 0 &&
        toCol === 6
    ) {
        board[0][5] = "♜";
        board[0][7] = "";
    }

    // Black Queen Side
    if (
        movingPiece === "♚" &&
        fromRow === 0 &&
        fromCol === 4 &&
        toRow === 0 &&
        toCol === 2
    ) {
        board[0][3] = "♜";
        board[0][0] = "";
    }

    // ======================
// PAWN PROMOTION
// ======================

// White Promotion
if (movingPiece === "♙" && toRow === 0) {
    board[toRow][toCol] = choosePromotion("white");
}

// Black Promotion
if (movingPiece === "♟" && toRow === 7) {
    board[toRow][toCol] = choosePromotion("black");
}

}
function validateMove(movingPiece, capturedPiece, fromRow, fromCol, toRow, toCol) {

    // Illegal move?
    if (isKingInCheck(currentPlayer)) {

        // Undo move
        board[fromRow][fromCol] = movingPiece;
        board[toRow][toCol] = capturedPiece;

        legalMoves = [];
        renderBoard();

        return false;
    }

    return true;

}
function finishTurn() {

    selectedRow = null;
    selectedCol = null;

    legalMoves = [];

    currentPlayer =
        currentPlayer === "white"
        ? "black"
        : "white";

}
function trackPieceMovement(movingPiece, fromRow, fromCol) {

    // Track King movement
    if (movingPiece === "♔") {
        whiteKingMoved = true;
    }

    if (movingPiece === "♚") {
        blackKingMoved = true;
    }

    // Track White Rooks
    if (movingPiece === "♖") {

        if (fromRow === 7 && fromCol === 0) {
            whiteLeftRookMoved = true;
        }

        if (fromRow === 7 && fromCol === 7) {
            whiteRightRookMoved = true;
        }

    }

    // Track Black Rooks
    if (movingPiece === "♜") {

        if (fromRow === 0 && fromCol === 0) {
            blackLeftRookMoved = true;
        }

        if (fromRow === 0 && fromCol === 7) {
            blackRightRookMoved = true;
        }

    }

}
function choosePromotion(color) {

    let choice = prompt(
`Promote Pawn

Q = Queen
R = Rook
B = Bishop
N = Knight`
    );

    if (!choice) choice = "Q";

    choice = choice.toUpperCase();

    if (color === "white") {

        if (choice === "R") return "♖";
        if (choice === "B") return "♗";
        if (choice === "N") return "♘";

        return "♕";

    }

    else {

        if (choice === "R") return "♜";
        if (choice === "B") return "♝";
        if (choice === "N") return "♞";

        return "♛";

    }

}
function getMoveNotation(
    piece,
    fromCol,
    toRow,
    toCol,
    captured
){

    // =========================
    // Castling
    // =========================
    if (
        (piece === "♔" || piece === "♚") &&
        Math.abs(toCol - fromCol) === 2
    ) {

        if (toCol === 6) {
            return "O-O";
        }

        if (toCol === 2) {
            return "O-O-O";
        }

    }

    const file = files[toCol];
    const rank = 8 - toRow;

    let symbol = "";

    switch (piece) {

        case "♔":
        case "♚":
            symbol = "K";
            break;

        case "♕":
        case "♛":
            symbol = "Q";
            break;

        case "♖":
        case "♜":
            symbol = "R";
            break;

        case "♗":
        case "♝":
            symbol = "B";
            break;

        case "♘":
        case "♞":
            symbol = "N";
            break;

        case "♙":
        case "♟":

            if (captured !== "") {

                return (
                    files[fromCol] +
                    "x" +
                    file +
                    rank
                );

            }

            return file + rank;

    }

    if (captured !== "") {

        return (
            symbol +
            "x" +
            file +
            rank
        );

    }

    return symbol + file + rank;

}