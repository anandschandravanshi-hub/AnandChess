// ===============================
// Anand Chess
// Piece Movement
// ===============================

function getWhitePawnMoves(row, col) {

    let moves = [];

    if (row > 0 && board[row - 1][col] === "") {

        moves.push([row - 1, col]);

        if (row === 6 && board[row - 2][col] === "") {
            moves.push([row - 2, col]);
        }
    }

    // Capture Left
    if (
        row > 0 &&
        col > 0 &&
        isBlackPiece(board[row - 1][col - 1])
    ) {
        moves.push([row - 1, col - 1]);
    }

    // Capture Right
    if (
        row > 0 &&
        col < 7 &&
        isBlackPiece(board[row - 1][col + 1])
    ) {
        moves.push([row - 1, col + 1]);
    }
    // En Passant
if (
    row === 3 &&
    enPassantSquare &&
    Math.abs(col - enPassantSquare[1]) === 1 &&
    enPassantSquare[0] === 2
) {
    moves.push([2, enPassantSquare[1]]);
}
    return moves;
}

function getBlackPawnMoves(row, col) {

    let moves = [];

    if (row < 7 && board[row + 1][col] === "") {

        moves.push([row + 1, col]);

        if (row === 1 && board[row + 2][col] === "") {
            moves.push([row + 2, col]);
        }
    }

    // Capture Left
    if (
        row < 7 &&
        col > 0 &&
        isWhitePiece(board[row + 1][col - 1])
    ) {
        moves.push([row + 1, col - 1]);
    }

    // Capture Right
    if (
        row < 7 &&
        col < 7 &&
        isWhitePiece(board[row + 1][col + 1])
    ) {
        moves.push([row + 1, col + 1]);
    }
    // En Passant
if (
    row === 4 &&
    enPassantSquare &&
    Math.abs(col - enPassantSquare[1]) === 1 &&
    enPassantSquare[0] === 5
) {
    moves.push([5, enPassantSquare[1]]);
}

    return moves;
}

function getKnightMoves(row, col, color) {

    let moves = [];

    const knightMoves = [
        [-2,-1],[-2,1],
        [-1,-2],[-1,2],
        [1,-2],[1,2],
        [2,-1],[2,1]
    ];

    for (const [dr, dc] of knightMoves) {

        let r = row + dr;
        let c = col + dc;

        if (r < 0 || r > 7 || c < 0 || c > 7) continue;

        let target = board[r][c];

        if (target === "") {
            moves.push([r, c]);
        }
        else if (color === "white") {

            if (isBlackPiece(target)) {
                moves.push([r, c]);
            }

        }
        else {

            if (isWhitePiece(target)) {
                moves.push([r, c]);
            }

        }

    }

    return moves;
}
function getBishopMoves(row, col, color) {

    let moves = [];

    const directions = [
        [-1,-1],
        [-1,1],
        [1,-1],
        [1,1]
    ];

    for (const [dr, dc] of directions) {

        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {

            let target = board[r][c];

            if (target === "") {
                moves.push([r, c]);
            }

            else if (color === "white") {

                if (isBlackPiece(target)) {
                    moves.push([r, c]);
                }

                break;
            }

            else {

                if (isWhitePiece(target)) {
                    moves.push([r, c]);
                }

                break;
            }

            r += dr;
            c += dc;
        }
    }

    return moves;
}
function getRookMoves(row, col, color) {

    let moves = [];

    const directions = [
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
    ];

    for (const [dr, dc] of directions) {

        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {

            let target = board[r][c];

            if (target === "") {
                moves.push([r, c]);
            }

            else if (color === "white") {

                if (isBlackPiece(target)) {
                    moves.push([r, c]);
                }

                break;
            }

            else {

                if (isWhitePiece(target)) {
                    moves.push([r, c]);
                }

                break;
            }

            r += dr;
            c += dc;
        }
    }

    return moves;
}
function getQueenMoves(row, col, color) {

    return [
        ...getBishopMoves(row, col, color),
        ...getRookMoves(row, col, color)
    ];

}
function getKingMoves(row, col, color) {

    let moves = [];

    const directions = [
        [-1,-1],[-1,0],[-1,1],
        [0,-1],         [0,1],
        [1,-1],[1,0],[1,1]
    ];

    for (const [dr, dc] of directions) {

        let r = row + dr;
        let c = col + dc;

        if (r < 0 || r > 7 || c < 0 || c > 7) {
            continue;
        }

        let target = board[r][c];

        if (target === "") {
            moves.push([r, c]);
        }

        else if (color === "white") {

            if (isBlackPiece(target)) {
                moves.push([r, c]);
            }

        }

        else if (color === "black") {

            if (isWhitePiece(target)) {
                moves.push([r, c]);
            }

        }

    }

    // ======================
    // WHITE KING SIDE
    // ======================

    if (
        color === "white" &&
        !whiteKingMoved &&
        !whiteRightRookMoved &&
        !isKingInCheck("white") &&
        !isSquareAttacked(7, 5, "black") &&
        !isSquareAttacked(7, 6, "black") &&
        row === 7 &&
        col === 4 &&
        board[7][5] === "" &&
        board[7][6] === "" &&
        board[7][7] === "♖"
    ) {
        moves.push([7, 6]);
    }

    // ======================
    // WHITE QUEEN SIDE
    // ======================

    if (
        color === "white" &&
        !whiteKingMoved &&
        !whiteLeftRookMoved &&
        !isKingInCheck("white") &&
        !isSquareAttacked(7, 3, "black") &&
        !isSquareAttacked(7, 2, "black") &&
        row === 7 &&
        col === 4 &&
        board[7][1] === "" &&
        board[7][2] === "" &&
        board[7][3] === "" &&
        board[7][0] === "♖"
    ) {
        moves.push([7, 2]);
    }

    // ======================
    // BLACK KING SIDE
    // ======================

    if (
        color === "black" &&
        !blackKingMoved &&
        !blackRightRookMoved &&
        !isKingInCheck("black") &&
        !isSquareAttacked(0, 5, "white") &&
        !isSquareAttacked(0, 6, "white") &&
        row === 0 &&
        col === 4 &&
        board[0][5] === "" &&
        board[0][6] === "" &&
        board[0][7] === "♜"
    ) {
        moves.push([0, 6]);
    }

    // ======================
    // BLACK QUEEN SIDE
    // ======================

    if (
        color === "black" &&
        !blackKingMoved &&
        !blackLeftRookMoved &&
        !isKingInCheck("black") &&
        !isSquareAttacked(0, 3, "white") &&
        !isSquareAttacked(0, 2, "white") &&
        row === 0 &&
        col === 4 &&
        board[0][1] === "" &&
        board[0][2] === "" &&
        board[0][3] === "" &&
        board[0][0] === "♜"
    ) {
        moves.push([0, 2]);
    }

    return moves;

}

console.log("pieces.js loaded");