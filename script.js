let selectedRow = null;
let selectedCol = null;
let currentPlayer = "white";

const chessboard = document.getElementById("chessboard");

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

function renderBoard() {

    chessboard.innerHTML = "";

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square = document.createElement("div");

            square.classList.add("square");

            if ((row + col) % 2 === 0) {
                square.classList.add("dark");
            } else {
                square.classList.add("light");
            }

            square.dataset.row = row;
            square.dataset.col = col;
            square.dataset.square = files[col] + (8 - row);

            square.textContent = board[row][col];
            if (row === selectedRow && col === selectedCol) {
            square.classList.add("selected");
}
            if (board[row][col] === "♔" && isKingInCheck("white")) {
            square.style.boxShadow = "inset 0 0 0 4px red";
}
            if (board[row][col] === "♚" && isKingInCheck("black")) {
            square.style.boxShadow = "inset 0 0 0 4px red";
}
            if (isLegalMove(row, col)) {
                square.style.boxShadow = "inset 0 0 0 4px gold";
            }

            square.addEventListener("click", () => handleClick(row, col));

            chessboard.appendChild(square);

        }

    }

}
function handleClick(row, col) {

    // Move selected piece
    if (isLegalMove(row, col)) {

        const fromPiece = board[selectedRow][selectedCol];
const capturedPiece = board[row][col];

// Temporary move
makeMove(selectedRow, selectedCol, row, col);
return;

// Check if own king is in check
const myColor = currentPlayer;

if (isKingInCheck(myColor)) {

    // Undo move
    board[selectedRow][selectedCol] = fromPiece;
    board[row][col] = capturedPiece;

    legalMoves = [];
    renderBoard();
    return;
}

// Move accepted
selectedRow = null;
selectedCol = null;
legalMoves = [];

currentPlayer = currentPlayer === "white" ? "black" : "white";

renderBoard();
return;
    }

    const piece = board[row][col];

    if (piece === "") {
        return;
    }

    if (currentPlayer === "white" && !isWhitePiece(piece)) {
        return;
    }

    if (currentPlayer === "black" && !isBlackPiece(piece)) {
        return;
    }

    selectedRow = row;
    selectedCol = col;

    legalMoves = getLegalMoves(piece, row, col);

    renderBoard();
}
function makeMove(fromRow, fromCol, toRow, toCol) {

    const movingPiece = board[fromRow][fromCol];
    const capturedPiece = board[toRow][toCol];

    // Temporary move
    board[toRow][toCol] = movingPiece;
    board[fromRow][fromCol] = "";

    // Auto Promotion
    if (movingPiece === "♙" && toRow === 0) {
        board[toRow][toCol] = "♕";
    }

    if (movingPiece === "♟" && toRow === 7) {
        board[toRow][toCol] = "♛";
    }

    // Illegal move?
    if (isKingInCheck(currentPlayer)) {

        // Undo move
        board[fromRow][fromCol] = movingPiece;
        board[toRow][toCol] = capturedPiece;

        legalMoves = [];
        renderBoard();

        return false;
    }

    // Save move history
    moveHistory.push({
        piece: movingPiece,
        from: files[fromCol] + (8 - fromRow),
        to: files[toCol] + (8 - toRow),
        captured: capturedPiece
    });

    selectedRow = null;
    selectedCol = null;
    legalMoves = [];

    currentPlayer = currentPlayer === "white"
        ? "black"
        : "white";

    console.table(moveHistory);

    updateMoveHistory();
    renderBoard();

    return true;
}
function updateMoveHistory() {

    const movesDiv = document.getElementById("moves");

    movesDiv.innerHTML = "";

    moveHistory.forEach((move, index) => {

        movesDiv.innerHTML +=
            (index + 1) +
            ". " +
            move.from +
            " → " +
            move.to +
            "<br>";

    });

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
function getKingMoves(row, col) {

    let moves = [];

    const directions = [
        [-1,-1],[-1,0],[-1,1],
        [0,-1],         [0,1],
        [1,-1],[1,0],[1,1]
    ];

    for(const [dr,dc] of directions){

        let r = row + dr;
        let c = col + dc;

        if(r<0 || r>7 || c<0 || c>7){
            continue;
        }

        let target = board[r][c];

        if(target===""){
            moves.push([r,c]);
        }

        else if(currentPlayer==="white"){

            if(isBlackPiece(target)){
                moves.push([r,c]);
            }

        }

        else{

            if(isWhitePiece(target)){
                moves.push([r,c]);
            }

        }

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
        case "♚":
            return getKingMoves(row, col);

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
            return getKingMoves(row, col);

        case "♚":
            return getKingMoves(row, col);

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
function hasAnyLegalMove(color) {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = board[row][col];

            if (piece === "") continue;

            if (color === "white" && !isWhitePiece(piece)) continue;
            if (color === "black" && !isBlackPiece(piece)) continue;

            const moves = getLegalMoves(piece, row, col);

            if (moves.length > 0) {
                return true;
            }

        }

    }

    return false;

}
function isInsideBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
function isWhitePiece(piece) {
    return "♔♕♖♗♘♙".includes(piece);
}

function isBlackPiece(piece) {
    return "♚♛♜♝♞♟".includes(piece);
}

function isLegalMove(row, col) {

    for (const move of legalMoves) {

        if (move[0] === row && move[1] === col) {
            return true;
        }

    }

    return false;
}

renderBoard();
