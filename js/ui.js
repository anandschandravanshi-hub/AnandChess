// ===============================
// Anand Chess
// UI Elements
// ===============================
const chessboard = document.getElementById("chessboard");

const capturedWhite =
    document.getElementById("captured-white");

const capturedBlack =
    document.getElementById("captured-black");

function renderBoard() {

    chessboard.innerHTML = "";

    for (let displayRow = 0; displayRow < 8; displayRow++) {

    for (let displayCol = 0; displayCol < 8; displayCol++) {

        const row = boardFlipped
            ? 7 - displayRow
            : displayRow;

        const col = boardFlipped
            ? 7 - displayCol
            : displayCol;

            const square = document.createElement("div");

            const boardRow = displayRow;
            const boardCol = displayCol;

            square.classList.add("square");

            // Square Color
            if ((row + col) % 2 === 0) {
                square.classList.add("dark");
            } else {
                square.classList.add("light");
            }

            // Data Attributes
           square.dataset.row = boardFlipped ? 7 - boardRow : boardRow;
           square.dataset.col = boardFlipped ? 7 - boardCol : boardCol;
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
            if (isWhitePiece(board[row][col])) {

    piece.classList.add("white-piece");

}

if (isBlackPiece(board[row][col])) {

    piece.classList.add("black-piece");

}

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


console.log("ui.js loaded");