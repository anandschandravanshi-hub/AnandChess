// ==================================================
// Anand Chess - Game Rules
// Handles all chess rules and game state validation.
// Does not generate moves or render the UI.
// ==================================================
function isKingInCheck(color) {

    const king = findKing(color);

    if (!king) return false;

    const attackerColor = color === "white" ? "black" : "white";

    return isSquareAttacked(
        king.row,
        king.col,
        attackerColor
    );

}
function getRemainingPieces() {

    const pieces = [];

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            if (board[row][col] !== "") {
                pieces.push(board[row][col]);
            }

        }

    }

    return pieces;

}
function isThreefoldRepetition() {

    const currentPosition = JSON.stringify(board);

    let count = 0;

    for (const position of positionHistory) {

        if (position === currentPosition) {
            count++;
        }

    }

    return count >= 3;

}
function isInsufficientMaterial() {

    const pieces = getRemainingPieces();

    // King vs King
    if (
        pieces.length === 2 &&
        pieces.includes("♔") &&
        pieces.includes("♚")
    ) {
        return true;
    }

    // King + Bishop vs King
    if (
        pieces.length === 3 &&
        (
            pieces.includes("♗") ||
            pieces.includes("♝")
        )
    ) {
        return true;
    }

    // King + Knight vs King
    if (
        pieces.length === 3 &&
        (
            pieces.includes("♘") ||
            pieces.includes("♞")
        )
    ) {
        return true;
    }

    return false;

}
function checkGameState() {

    // ======================
    // Check / Checkmate
    // ======================
    if (isKingInCheck(currentPlayer)) {

        if (hasAnyLegalMove(currentPlayer)) {

           document.querySelector("#game-status .status-title").textContent = "Check!";

        } else {

            showGameOver(
    "🏆 Game Over",
    `${currentPlayer === "white" ? "Black" : "White"} wins by Checkmate!`
);

return;

            return;
        }

    }

    // ======================
    // Stalemate
    // ======================
    else {

        if (!hasAnyLegalMove(currentPlayer)) {

            showGameOver(
    "🤝 Draw",
    "Game drawn by Stalemate."
);

return;

            return;
        }

    }

    // ======================
    // 50-Move Rule
    // ======================
    if (halfMoveClock >= 100) {

        showGameOver(
    "🤝 Draw",
    "Game drawn by 50-Move Rule."
);

return;

        return;

    }

    // ======================
    // Threefold Repetition
    // ======================
    if (isThreefoldRepetition()) {

    showGameOver(
    "🤝 Draw",
    "Game drawn by Threefold Repetition."
);

return;

    return;

}

    // ======================
    // Insufficient Material
    // ======================
    if (isInsufficientMaterial()) {

        showGameOver(
    "🤝 Draw",
    "Game drawn by Insufficient Material."
);

return;

        return;

    }

}
function getKingAttackSquares(row, col) {

    const attacks = [];

    const directions = [
        [-1,-1],[-1,0],[-1,1],
        [0,-1],         [0,1],
        [1,-1],[1,0],[1,1]
    ];

    for (const [dr, dc] of directions) {

        const r = row + dr;
        const c = col + dc;

        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            attacks.push([r, c]);
        }

    }

    return attacks;

}
function findKing(color) {

    const king = color === "white" ? "♔" : "♚";

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            if (board[row][col] === king) {
                return { row, col };
            }

        }

    }

    return null;

}
function getPawnAttackSquares(row, col, color) {

    const attacks = [];

    if (color === "white") {

        if (row > 0 && col > 0)
            attacks.push([row - 1, col - 1]);

        if (row > 0 && col < 7)
            attacks.push([row - 1, col + 1]);

    } else {

        if (row < 7 && col > 0)
            attacks.push([row + 1, col - 1]);

        if (row < 7 && col < 7)
            attacks.push([row + 1, col + 1]);

    }

    return attacks;

}
function getAttackSquares(piece, row, col) {

    switch (piece) {

        case "♙":
            return getPawnAttackSquares(row, col, "white");

        case "♟":
            return getPawnAttackSquares(row, col, "black");

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
        case "♚":
            return getKingAttackSquares(row, col);

        default:
            return [];
    }

}
function isSquareAttacked(row, col, attackerColor) {

    for (let r = 0; r < 8; r++) {

        for (let c = 0; c < 8; c++) {

            const piece = board[r][c];

            if (piece === "") continue;

            if (attackerColor === "white" && !isWhitePiece(piece)) continue;
            if (attackerColor === "black" && !isBlackPiece(piece)) continue;

            const moves = getAttackSquares(piece, r, c);

            for (const move of moves) {

                if (move[0] === row && move[1] === col) {
                    return true;
                }

            }

        }

    }

    return false;

}
function tryMove(fromRow, fromCol, toRow, toCol, color) {

    const movingPiece = board[fromRow][fromCol];
    const capturedPiece = board[toRow][toCol];

    // Temporary move
    board[toRow][toCol] = movingPiece;
    board[fromRow][fromCol] = "";

    const safe = !isKingInCheck(color);

    // Undo move
    board[fromRow][fromCol] = movingPiece;
    board[toRow][toCol] = capturedPiece;

    return safe;

}
function hasAnyLegalMove(color) {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = board[row][col];

            if (piece === "") continue;

            if (color === "white" && !isWhitePiece(piece)) continue;
            if (color === "black" && !isBlackPiece(piece)) continue;

            const moves = getLegalMoves(piece, row, col);

            for (const move of moves) {

                if (tryMove(row, col, move[0], move[1], color)) {
                    return true;
                }

            }

        }

    }

    return false;

}
function isInsideBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}