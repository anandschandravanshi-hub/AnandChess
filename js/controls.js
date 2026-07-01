// ==================================================
// Anand Chess - Controls
// Handles mouse, keyboard and button events.
// ==================================================

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

    boardFlipped = !boardFlipped;

    renderBoard();

});


// ==========================
// Settings Button
// ==========================

document
.getElementById("settings-btn")
.addEventListener("click", () => {

    alert("Coming Soon");

});
document.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key.toLowerCase() === "z") {

        event.preventDefault();

        undoMove();

    }

});