let selectedRow = null;
let selectedCol = null;
let currentPlayer = "white";
let whiteKingMoved = false;
let blackKingMoved = false;

let whiteLeftRookMoved = false;
let whiteRightRookMoved = false;

let blackLeftRookMoved = false;
let blackRightRookMoved = false;

const chessboard = document.getElementById("chessboard");

const capturedWhite =
    document.getElementById("captured-white");

const capturedBlack =
    document.getElementById("captured-black");

const board = [
    ["♜","♞","♝","♛","♚","♝","♞","♜"],
    ["♟","♟","♟","♟","♟","♟","♟","♟"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["♙","♙","♙","♙","♙","♙","♙","♙"],
    ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

const files = ["a","b","c","d","e","f","g","h"];

let legalMoves = [];
let moveHistory = [];
let lastMove = null;
let enPassantSquare = null;
let halfMoveClock = 0;
let positionHistory = [];
let lastMoveHighlight = null;
let boardHistory = [];
let currentPosition = -1;
let currentHistoryIndex = -1;
let historyMode = false;

function animateMove(toRow, toCol) {

    requestAnimationFrame(() => {

        const square = document.querySelector(
            `[data-row="${toRow}"][data-col="${toCol}"]`
        );

        if (!square) return;

        square.style.transform = "scale(1.25)";

        setTimeout(() => {
            square.style.transform = "scale(1)";
        }, 180);

    });

}
function createBoard() {

    chessboard.innerHTML = "";

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square = document.createElement("div");

            square.classList.add("square");

            if ((row + col) % 2 === 0) {
                square.classList.add("dark");
            }
            else {
                square.classList.add("light");
            }

            square.dataset.row = row;
            square.dataset.col = col;

            square.addEventListener(
                "click",
                () => handleClick(row, col)
            );

            chessboard.appendChild(square);

        }

    }

}
function renderBoard() {

    chessboard.innerHTML = "";

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square = document.createElement("div");

            square.classList.add("square");

            // Square Color
            if ((row + col) % 2 === 0) {
                square.classList.add("dark");
            } else {
                square.classList.add("light");
            }

            // Data Attributes
            square.dataset.row = row;
            square.dataset.col = col;
            square.dataset.square = files[col] + (8 - row);

            // ======================
            // Last Move Highlight
            // ======================
            if (
    lastMoveHighlight &&
    (
        (row === lastMoveHighlight.fromRow &&
         col === lastMoveHighlight.fromCol) ||

        (row === lastMoveHighlight.toRow &&
         col === lastMoveHighlight.toCol)
    )
) {

    if ((row + col) % 2 === 0) {
        square.classList.add("last-move-dark");
    } else {
        square.classList.add("last-move-light");
    }

}
            // Piece
            const piece = document.createElement("div");

            piece.classList.add("piece");

            piece.textContent = board[row][col];

            square.appendChild(piece);
            // Rank (1-8)
if (col === 0) {

    const rank = document.createElement("span");

    rank.className = "rank-coordinate";

    rank.textContent = 8 - row;

    square.appendChild(rank);

}

// File (a-h)
if (row === 7) {

    const file = document.createElement("span");

    file.className = "file-coordinate";

    file.textContent = files[col];

    square.appendChild(file);

}

            // Selected Piece
            if (row === selectedRow && col === selectedCol) {
                square.classList.add("selected");
            }

            // Check Highlight
            if (board[row][col] === "♔" && isKingInCheck("white")) {
                square.style.boxShadow = "inset 0 0 0 4px red";
            }

            if (board[row][col] === "♚" && isKingInCheck("black")) {
                square.style.boxShadow = "inset 0 0 0 4px red";
            }

            // Legal Move Highlight
            if (isLegalMove(row, col)) {

    if (board[row][col] === "") {

        const dot = document.createElement("div");
        dot.classList.add("move-dot");
        square.appendChild(dot);

    } else {

        const ring = document.createElement("div");
        ring.classList.add("capture-ring");
        square.appendChild(ring);

    }

}

            // Click Event
            square.addEventListener("click", () => handleClick(row, col));

            chessboard.appendChild(square);

        }

    }

}
function animateMove(piece, fromRow, fromCol, toRow, toCol) {

    const fromSquare = document.querySelector(
        `[data-row="${fromRow}"][data-col="${fromCol}"]`
    );

    const toSquare = document.querySelector(
        `[data-row="${toRow}"][data-col="${toCol}"]`
    );

    if (!fromSquare || !toSquare) return Promise.resolve();

    const fromRect = fromSquare.getBoundingClientRect();
    const toRect = toSquare.getBoundingClientRect();

    const pieceElement = fromSquare.querySelector(".piece");

    if (pieceElement) {
    pieceElement.style.visibility = "hidden";
}

    const clone = document.createElement("div");

    clone.className = "flying-piece";
    clone.textContent = piece;

    clone.style.left =
    fromRect.left + (fromRect.width - 52) / 2 + "px";

clone.style.top =
    fromRect.top + (fromRect.height - 52) / 2 + "px";

    document.body.appendChild(clone);

    return new Promise(resolve => {

        requestAnimationFrame(() => {

            clone.style.left =
            toRect.left + (toRect.width - 52) / 2 + "px";

            clone.style.top =
            toRect.top + (toRect.height - 52) / 2 + "px";

        });

        clone.addEventListener("transitionend", () => {

            clone.remove();
            if (pieceElement) {
    pieceElement.style.visibility = "visible";
}

            resolve();

        }, { once:true });

    });

}
function handleClick(row, col) {

    // Agar selected legal move par click hua
    if (isLegalMove(row, col)) {
        makeMove(selectedRow, selectedCol, row, col);
        return;
    }

    const piece = board[row][col];

    // Empty square
    if (piece === "") {
        return;
    }

    // Wrong color
    if (currentPlayer === "white" && !isWhitePiece(piece)) {
        return;
    }

    if (currentPlayer === "black" && !isBlackPiece(piece)) {
        return;
    }

    // Select piece
    selectedRow = row;
    selectedCol = col;

    // Generate legal moves
    legalMoves = getLegalMoves(piece, row, col);
    

renderBoard();
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
function finishTurn() {

    selectedRow = null;
    selectedCol = null;

    legalMoves = [];

    currentPlayer =
        currentPlayer === "white"
        ? "black"
        : "white";

}
function getRemainingPieces() {

    let pieces = [];

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
console.log(getRemainingPieces());
function checkGameState() {

    // ======================
    // Check / Checkmate
    // ======================
    if (isKingInCheck(currentPlayer)) {

        if (hasAnyLegalMove(currentPlayer)) {

            alert("Check!");

        } else {

            alert("Checkmate!");

            return;
        }

    }

    // ======================
    // Stalemate
    // ======================
    else {

        if (!hasAnyLegalMove(currentPlayer)) {

            alert("Stalemate!");

            return;
        }

    }

    // ======================
    // 50-Move Rule
    // ======================
    if (halfMoveClock >= 100) {

        alert("Draw by 50-Move Rule!");

        return;

    }

    // ======================
    // Threefold Repetition
    // ======================
    if (isThreefoldRepetition()) {

    alert("Draw by Threefold Repetition!");

    return;

}

    // ======================
    // Insufficient Material
    // ======================
    if (isInsufficientMaterial()) {

        alert("Draw by Insufficient Material!");

        return;

    }

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
function undoMove() {

    if (boardHistory.length === 0) {
        return;
    }

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

    currentPlayer = currentPlayer === "white"
        ? "black"
        : "white";

    updateMoveHistory();
    renderBoard();
    console.log("Current Position:", currentPosition);

}
function updateMoveHistory() {

    const movesDiv = document.getElementById("moves");

    movesDiv.innerHTML = "";

    for (let i = 0; i < moveHistory.length; i += 2) {

        const row = document.createElement("div");

        row.className = "move-row";

        const moveNumber = document.createElement("div");
        moveNumber.className = "move-number";
        moveNumber.textContent = (Math.floor(i / 2) + 1) + ".";

        const whiteMove = document.createElement("div");
        whiteMove.className = "white-move";
        whiteMove.textContent = moveHistory[i]?.notation || "";

        const blackMove = document.createElement("div");
        blackMove.className = "black-move";
        blackMove.textContent = moveHistory[i + 1]?.notation || "";

        row.appendChild(moveNumber);
        row.appendChild(whiteMove);
        row.appendChild(blackMove);

        movesDiv.appendChild(row);

    }

}
function updateCapturedPieces() {

    capturedWhite.innerHTML = "";
    capturedBlack.innerHTML = "";

    const whiteCounts = {
        "♕":0,
        "♖":0,
        "♗":0,
        "♘":0,
        "♙":0
    };

    const blackCounts = {
        "♛":0,
        "♜":0,
        "♝":0,
        "♞":0,
        "♟":0
    };

    for (const move of moveHistory) {

        if (move.captured === "") continue;

        if (isWhitePiece(move.captured)) {

            whiteCounts[move.captured]++;

        } else {

            blackCounts[move.captured]++;

        }

    }

    function render(container, counts) {

        for (const piece in counts) {

            if (counts[piece] === 0) continue;

            const item = document.createElement("div");

            item.className = "captured-item";

            item.innerHTML = `
                <span class="captured-piece">${piece}</span>
                <span class="captured-count">×${counts[piece]}</span>
            `;

            container.appendChild(item);

        }

    }

    render(capturedBlack, blackCounts);
    render(capturedWhite, whiteCounts);

}
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
function getKingAttackSquares(row, col) {

    let attacks = [];

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

    let attacks = [];

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
function isWhitePiece(piece) {
    return piece !== "" && "♔♕♖♗♘♙".includes(piece);
}

function isBlackPiece(piece) {
    return piece !== "" && "♚♛♜♝♞♟".includes(piece);
}
function isLegalMove(row, col) {

    for (const move of legalMoves) {

        if (move[0] === row && move[1] === col) {
            return true;
        }

    }

    return false;
}
console.log(lastMove);
renderBoard();
const movesTab = document.getElementById("moves-tab");
const analysisTab = document.getElementById("analysis-tab");

movesTab.addEventListener("click", () => {

    movesTab.classList.add("active");
    analysisTab.classList.remove("active");

});

analysisTab.addEventListener("click", () => {

    analysisTab.classList.add("active");
    movesTab.classList.remove("active");

});
// ==========================
// New Game Button
// ==========================

document
.getElementById("new-game-btn")
.addEventListener("click", () => {

    alert("Coming Soon");

});


// ==========================
// Undo Button
// ==========================

document
.getElementById("undo-btn")
.addEventListener("click", () => {

    undoMove();

});


// ==========================
// Flip Board Button
// ==========================

document
.getElementById("flip-btn")
.addEventListener("click", () => {

    alert("Coming Soon");

});


// ==========================
// Settings Button
// ==========================

document
.getElementById("settings-btn")
.addEventListener("click", () => {

    alert("Coming Soon");

});
document.addEventListener("keydown", function(event){

    if(event.ctrlKey && event.key.toLowerCase() === "z"){

        event.preventDefault();

        undoMove();

    }

});
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
    boardHistory.push({

    board: JSON.parse(JSON.stringify(board)),

    currentPlayer: currentPlayer,

    lastMoveHighlight: null

});

currentPosition = 0;

    renderBoard();

});

nextMoveBtn.addEventListener("click", () => {

    console.log("Next button clicked");

});

lastMoveBtn.addEventListener("click", () => {

    console.log("Last button clicked");

});