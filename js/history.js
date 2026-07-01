// ==================================================
// Anand Chess - History
// Handles move history, undo and replay.
// ==================================================

// ==========================
// Save Move
// ==========================

function saveMove(movingPiece, capturedPiece, fromRow, fromCol, toRow, toCol) {

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

    // 50 Move Rule

    halfMoveClock = (

        movingPiece === "♙" ||
        movingPiece === "♟" ||
        capturedPiece !== ""

    ) ? 0 : halfMoveClock + 1;

    // En Passant

    enPassantSquare = null;

    if (movingPiece === "♙" && fromRow === 6 && toRow === 4) {

        enPassantSquare = [5, fromCol];

    }

    if (movingPiece === "♟" && fromRow === 1 && toRow === 3) {

        enPassantSquare = [2, fromCol];

    }

    // Threefold

    positionHistory.push(JSON.stringify(board));

}

// ==========================
// Undo
// ==========================

function undoMove() {

    if (boardHistory.length === 0) return;

    const previousState = boardHistory.pop();

    currentPosition = boardHistory.length - 1;

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            board[row][col] = previousState.board[row][col];

        }

    }

    currentPlayer = previousState.currentPlayer;

    lastMoveHighlight = previousState.lastMoveHighlight;

    moveHistory.pop();

    updateMoveHistory();

    updateCapturedPieces();

    renderBoard();

}

// ==========================
// DOM
// ==========================

const firstMoveBtn = document.getElementById("first-move-btn");

const prevMoveBtn = document.getElementById("prev-move-btn");

const nextMoveBtn = document.getElementById("next-move-btn");

const lastMoveBtn = document.getElementById("last-move-btn");

// ==========================
// History Navigation
// ==========================

firstMoveBtn.addEventListener("click", () => {

    if (boardHistory.length === 0) return;

    const state = boardHistory[0];

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            board[row][col] = state.board[row][col];

        }

    }

    currentPlayer = state.currentPlayer;

    lastMoveHighlight = state.lastMoveHighlight;

    renderBoard();

});

prevMoveBtn.addEventListener("click", () => {

    if (currentPosition <= 0) return;

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