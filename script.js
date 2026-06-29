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

        board[row][col] = board[selectedRow][selectedCol];
        board[selectedRow][selectedCol] = "";

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

    if (piece === "♙") {
        legalMoves = getWhitePawnMoves(row, col);
    } else if (piece === "♟") {
        legalMoves = getBlackPawnMoves(row, col);
    } else if (piece === "♘" || piece === "♞") {
        legalMoves = getKnightMoves(row, col);
    } else {
        legalMoves = [];
    }

    renderBoard();
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

function getKnightMoves(row, col) {

    const moves = [];

    const offsets = [
        [-2,-1],[-2,1],
        [-1,-2],[-1,2],
        [1,-2],[1,2],
        [2,-1],[2,1]
    ];

    for (const [dr, dc] of offsets) {

        const r = row + dr;
        const c = col + dc;

        if (r < 0 || r > 7 || c < 0 || c > 7) continue;

        const target = board[r][c];

        if (
            target === "" ||
            (currentPlayer === "white" && isBlackPiece(target)) ||
            (currentPlayer === "black" && isWhitePiece(target))
        ) {
            moves.push([r, c]);
        }
    }

    return moves;
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