// ==================================================
// Anand Chess - Controls
// Handles mouse, keyboard and button events.
// ==================================================

// ==========================
// Board Click
// ==========================

function handleClick(row, col) {

    if (gameOver) {
        return;
    }

    if (historyMode) {

        alert("Return to the latest position to continue playing.");

        return;

}

    if (isLegalMove(row, col)) {

        makeMove(selectedRow, selectedCol, row, col);

        return;

    }

    const piece = board[row][col];

    if (piece === "") return;

    if (currentPlayer === "white" && !isWhitePiece(piece)) return;

    if (currentPlayer === "black" && !isBlackPiece(piece)) return;

    selectedRow = row;
    selectedCol = col;

    legalMoves = getLegalMoves(piece, row, col);

    renderBoard();

}

// ==========================
// DOM Elements
// ==========================

const movesTab = document.getElementById("moves-tab");
const analysisTab = document.getElementById("analysis-tab");

const newGameBtn = document.getElementById("new-game-btn");
const undoBtn = document.getElementById("undo-btn");
const flipBtn = document.getElementById("flip-btn");
const settingsBtn = document.getElementById("settings-btn");

// ==========================
// Tabs
// ==========================

movesTab.addEventListener("click", () => {

    movesTab.classList.add("active");

    analysisTab.classList.remove("active");

});

analysisTab.addEventListener("click", () => {

    analysisTab.classList.add("active");

    movesTab.classList.remove("active");

});

// ==========================
// Buttons
// ==========================

newGameBtn.addEventListener("click", () => {

    alert("Coming Soon");

});

undoBtn.addEventListener("click", () => {

    undoMove();

});

flipBtn.addEventListener("click", () => {

    boardFlipped = !boardFlipped;

    renderBoard();

});

settingsBtn.addEventListener("click", () => {

    alert("Coming Soon");

});

// ==========================
// Keyboard Shortcuts
// ==========================

document.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key.toLowerCase() === "z") {

        event.preventDefault();

        undoMove();

    }

});