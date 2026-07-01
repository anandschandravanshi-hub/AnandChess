// ==================================================
// Move Generation
// ==================================================

function getLegalMoves(piece, row, col) {

    switch (piece) {

        case "♙": return getWhitePawnMoves(row, col);
        case "♟": return getBlackPawnMoves(row, col);

        case "♘": return getKnightMoves(row, col, "white");
        case "♞": return getKnightMoves(row, col, "black");

        case "♗": return getBishopMoves(row, col, "white");
        case "♝": return getBishopMoves(row, col, "black");

        case "♖": return getRookMoves(row, col, "white");
        case "♜": return getRookMoves(row, col, "black");

        case "♕": return getQueenMoves(row, col, "white");
        case "♛": return getQueenMoves(row, col, "black");

        case "♔": return getKingMoves(row, col, "white");
        case "♚": return getKingMoves(row, col, "black");

        default: return [];

    }

}

// ==================================================
// Legal Move Check
// ==================================================

function isLegalMove(row, col) {

    return legalMoves.some(

        ([moveRow, moveCol]) =>

            moveRow === row && moveCol === col

    );

}

// ==================================================
// Make Move
// ==================================================

async function makeMove(fromRow, fromCol, toRow, toCol) {

    const movingPiece = board[fromRow][fromCol];

    const capturedPiece = board[toRow][toCol];

    // Track castling rights

    trackPieceMovement(movingPiece, fromRow, fromCol);

    // Animate move

    await animateMove(

        movingPiece,

        fromRow,
        fromCol,

        toRow,
        toCol

    );

    // Update board

    executeMove(

        movingPiece,

        fromRow,
        fromCol,

        toRow,
        toCol

    );

    // Save board state

    boardHistory.push({

        board: JSON.parse(JSON.stringify(board)),

        currentPlayer,

        lastMoveHighlight: lastMoveHighlight
            ? { ...lastMoveHighlight }
            : null

    });

    currentPosition = boardHistory.length - 1;

    // Validate move

    if (

        !validateMove(

            movingPiece,
            capturedPiece,

            fromRow,
            fromCol,

            toRow,
            toCol

        )

    ) {

        return false;

    }

    // Save history

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

    // Update game state

    checkGameState();

    // Refresh UI

    updateMoveHistory();

    updateCapturedPieces();

    renderBoard();

    return true;

}

// ==================================================
// Execute Move
// ==================================================

function executeMove(movingPiece, fromRow, fromCol, toRow, toCol) {

    // ==========================
    // Normal Move
    // ==========================

    board[toRow][toCol] = movingPiece;

    board[fromRow][fromCol] = "";

    // ==========================
    // En Passant
    // ==========================

    if (

        movingPiece === "♙" &&
        enPassantSquare &&
        toRow === enPassantSquare[0] &&
        toCol === enPassantSquare[1]

    ) {

        board[toRow + 1][toCol] = "";

    }

    if (

        movingPiece === "♟" &&
        enPassantSquare &&
        toRow === enPassantSquare[0] &&
        toCol === enPassantSquare[1]

    ) {

        board[toRow - 1][toCol] = "";

    }

    // ==========================
    // Castling
    // ==========================

    if (

        movingPiece === "♔" &&
        fromRow === 7 &&
        fromCol === 4

    ) {

        // King Side

        if (toCol === 6) {

            board[7][5] = "♖";

            board[7][7] = "";

        }

        // Queen Side

        else if (toCol === 2) {

            board[7][3] = "♖";

            board[7][0] = "";

        }

    }

    if (

        movingPiece === "♚" &&
        fromRow === 0 &&
        fromCol === 4

    ) {

        // King Side

        if (toCol === 6) {

            board[0][5] = "♜";

            board[0][7] = "";

        }

        // Queen Side

        else if (toCol === 2) {

            board[0][3] = "♜";

            board[0][0] = "";

        }

    }

    // ==========================
    // Pawn Promotion
    // ==========================

    if (movingPiece === "♙" && toRow === 0) {

        board[toRow][toCol] = choosePromotion("white");

    }

    if (movingPiece === "♟" && toRow === 7) {

        board[toRow][toCol] = choosePromotion("black");

    }

}
// ==================================================
// Move Validation
// ==================================================

function validateMove(
    movingPiece,
    capturedPiece,
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    if (!isKingInCheck(currentPlayer)) {

        return true;

    }

    // Restore board

    board[fromRow][fromCol] = movingPiece;

    board[toRow][toCol] = capturedPiece;

    legalMoves = [];

    renderBoard();

    return false;

}

// ==================================================
// Finish Turn
// ==================================================

function finishTurn() {

    selectedRow = null;

    selectedCol = null;

    legalMoves = [];

    currentPlayer =
        currentPlayer === "white"
            ? "black"
            : "white";

}

// ==================================================
// Track Castling Rights
// ==================================================

function trackPieceMovement(movingPiece, fromRow, fromCol) {

    switch (movingPiece) {

        case "♔":

            whiteKingMoved = true;

            break;

        case "♚":

            blackKingMoved = true;

            break;

        case "♖":

            if (fromRow === 7) {

                if (fromCol === 0) {

                    whiteLeftRookMoved = true;

                } else if (fromCol === 7) {

                    whiteRightRookMoved = true;

                }

            }

            break;

        case "♜":

            if (fromRow === 0) {

                if (fromCol === 0) {

                    blackLeftRookMoved = true;

                } else if (fromCol === 7) {

                    blackRightRookMoved = true;

                }

            }

            break;

    }

}

// ==================================================
// Pawn Promotion
// ==================================================

function choosePromotion(color) {

    let choice = prompt(
`Promote Pawn

Q = Queen
R = Rook
B = Bishop
N = Knight`
    );

    choice = (choice || "Q").toUpperCase();

    if (color === "white") {

        switch (choice) {

            case "R": return "♖";
            case "B": return "♗";
            case "N": return "♘";
            default:  return "♕";

        }

    }

    switch (choice) {

        case "R": return "♜";
        case "B": return "♝";
        case "N": return "♞";
        default:  return "♛";

    }

}

// ==================================================
// Move Notation
// ==================================================

function getMoveNotation(
    piece,
    fromCol,
    toRow,
    toCol,
    captured
) {

    // Castling

    if ((piece === "♔" || piece === "♚") && Math.abs(toCol - fromCol) === 2) {

        return toCol === 6 ? "O-O" : "O-O-O";

    }

    const file = files[toCol];

    const rank = 8 - toRow;

    // Pawn

    if (piece === "♙" || piece === "♟") {

        return captured !== ""

            ? `${files[fromCol]}x${file}${rank}`

            : `${file}${rank}`;

    }

    // Piece Symbol

    const symbols = {

        "♔":"K",
        "♚":"K",

        "♕":"Q",
        "♛":"Q",

        "♖":"R",
        "♜":"R",

        "♗":"B",
        "♝":"B",

        "♘":"N",
        "♞":"N"

    };

    const symbol = symbols[piece];

    return captured !== ""

        ? `${symbol}x${file}${rank}`

        : `${symbol}${file}${rank}`;

}