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

function saveBoardState() {

    // Agar user previous position dekh raha tha,
    // aur naya move khel diya, to future history delete.

    if (currentPosition < boardHistory.length - 1) {

        boardHistory.splice(currentPosition + 1);

    }

    boardHistory.push({

        board: JSON.parse(JSON.stringify(board)),

        currentPlayer,

        lastMoveHighlight:
            lastMoveHighlight
                ? { ...lastMoveHighlight }
                : null

    });

    currentPosition = boardHistory.length - 1;
viewPosition = currentPosition;

}
// ==========================
// Undo
// ==========================

// ==================================================
// Restore Board State
// ==================================================

function restoreBoardState(state) {

    

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            board[row][col] = state.board[row][col];

        }

    }

    currentPlayer = state.currentPlayer;

    lastMoveHighlight = state.lastMoveHighlight
        ? { ...state.lastMoveHighlight }
        : null;

    

    updateCapturedPieces();

    updateMoveHistory();

    renderBoard();

}

function undoMove() {

    if (currentPosition <= 0) {
        return;
    }

    currentPosition--;

    restoreBoardState(
        boardHistory[currentPosition]
    );

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
    historyMode = true;

    if (boardHistory.length === 0) return;

    viewPosition = 0;

    restoreBoardState(
        boardHistory[viewPosition]
    );

});

prevMoveBtn.addEventListener("click", () => {

    historyMode = true;

    if (viewPosition <= 0) return;

    viewPosition--;

    restoreBoardState(
        boardHistory[viewPosition]
    );

});

nextMoveBtn.addEventListener("click", () => {

    if (viewPosition >= boardHistory.length - 1) return;

viewPosition++;

historyMode = (viewPosition !== currentPosition);

restoreBoardState(
    boardHistory[viewPosition]
);

});

lastMoveBtn.addEventListener("click", () => {

    historyMode = false;

    if (boardHistory.length === 0) return;

viewPosition = currentPosition;

historyMode = false;

restoreBoardState(
    boardHistory[viewPosition]
);

});