// ==================================================
// White Pawn
// ==================================================

function getWhitePawnMoves(row, col) {

    const moves = [];

    // Forward

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
        enPassantSquare[0] === 2 &&
        Math.abs(col - enPassantSquare[1]) === 1

    ) {

        moves.push([2, enPassantSquare[1]]);

    }

    return moves;

}

// ==================================================
// Black Pawn
// ==================================================

function getBlackPawnMoves(row, col) {

    const moves = [];

    // Forward

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
        enPassantSquare[0] === 5 &&
        Math.abs(col - enPassantSquare[1]) === 1

    ) {

        moves.push([5, enPassantSquare[1]]);

    }

    return moves;

}
// ==================================================
// Sliding Pieces Helper
// ==================================================

// ==================================================
// Knight
// ==================================================

function getKnightMoves(row, col, color) {

    const moves = [];

    const directions = [
        [-2,-1], [-2,1],
        [-1,-2], [-1,2],
        [ 1,-2], [ 1,2],
        [ 2,-1], [ 2,1]
    ];

    for (const [dr, dc] of directions) {

        const r = row + dr;
        const c = col + dc;

        if (r < 0 || r > 7 || c < 0 || c > 7) continue;

        const target = board[r][c];

        if (
            target === "" ||
            (color === "white" && isBlackPiece(target)) ||
            (color === "black" && isWhitePiece(target))
        ) {

            moves.push([r, c]);

        }

    }

    return moves;

}
function getSlidingMoves(row, col, color, directions) {

    const moves = [];

    for (const [dr, dc] of directions) {

        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {

            const target = board[r][c];

            if (target === "") {

                moves.push([r, c]);

            } else {

                if (
                    (color === "white" && isBlackPiece(target)) ||
                    (color === "black" && isWhitePiece(target))
                ) {

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
// ==================================================
// Bishop
// ==================================================

function getBishopMoves(row, col, color) {

    return getSlidingMoves(

        row,

        col,

        color,

        [
            [-1,-1],
            [-1,1],
            [1,-1],
            [1,1]
        ]

    );

}
// ==================================================
// Rook
// ==================================================

function getRookMoves(row, col, color) {

    return getSlidingMoves(

        row,

        col,

        color,

        [
            [-1,0],
            [1,0],
            [0,-1],
            [0,1]
        ]

    );

}
function getQueenMoves(row, col, color) {

    return [

        ...getBishopMoves(row, col, color),

        ...getRookMoves(row, col, color)

    ];

}
// ==================================================
// King
// ==================================================

function getKingMoves(row, col, color) {

    const moves = [];

    const directions = [

        [-1,-1], [-1,0], [-1,1],
        [ 0,-1],          [0,1],
        [ 1,-1], [1,0], [1,1]

    ];

    // Normal Moves

    for (const [dr, dc] of directions) {

        const r = row + dr;
        const c = col + dc;

        if (r < 0 || r > 7 || c < 0 || c > 7) continue;

        const target = board[r][c];

        if (

            target === "" ||

            (color === "white" && isBlackPiece(target)) ||

            (color === "black" && isWhitePiece(target))

        ) {

            moves.push([r, c]);

        }

    }

    // ==========================
    // Castling
    // ==========================

    if (color === "white") {

        // King Side

        if (

            !whiteKingMoved &&
            !whiteRightRookMoved &&
            row === 7 &&
            col === 4 &&
            !isKingInCheck("white") &&
            board[7][5] === "" &&
            board[7][6] === "" &&
            board[7][7] === "♖" &&
            !isSquareAttacked(7,5,"black") &&
            !isSquareAttacked(7,6,"black")

        ) {

            moves.push([7,6]);

        }

        // Queen Side

        if (

            !whiteKingMoved &&
            !whiteLeftRookMoved &&
            row === 7 &&
            col === 4 &&
            !isKingInCheck("white") &&
            board[7][1] === "" &&
            board[7][2] === "" &&
            board[7][3] === "" &&
            board[7][0] === "♖" &&
            !isSquareAttacked(7,3,"black") &&
            !isSquareAttacked(7,2,"black")

        ) {

            moves.push([7,2]);

        }

    } else {

        // King Side

        if (

            !blackKingMoved &&
            !blackRightRookMoved &&
            row === 0 &&
            col === 4 &&
            !isKingInCheck("black") &&
            board[0][5] === "" &&
            board[0][6] === "" &&
            board[0][7] === "♜" &&
            !isSquareAttacked(0,5,"white") &&
            !isSquareAttacked(0,6,"white")

        ) {

            moves.push([0,6]);

        }

        // Queen Side

        if (

            !blackKingMoved &&
            !blackLeftRookMoved &&
            row === 0 &&
            col === 4 &&
            !isKingInCheck("black") &&
            board[0][1] === "" &&
            board[0][2] === "" &&
            board[0][3] === "" &&
            board[0][0] === "♜" &&
            !isSquareAttacked(0,3,"white") &&
            !isSquareAttacked(0,2,"white")

        ) {

            moves.push([0,2]);

        }

    }

    return moves;

}
console.log("pieces.js loaded");