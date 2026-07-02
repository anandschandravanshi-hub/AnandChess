// ==================================================
// Anand Chess - UI
// DOM Elements
// ==================================================

const chessboard = document.getElementById("chessboard");

const capturedWhite = document.getElementById("captured-white");

const capturedBlack = document.getElementById("captured-black");

const movesDiv = document.getElementById("moves");

// ==================================================
// Render Board
// ==================================================

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

            const currentPiece = board[row][col];

            const square = document.createElement("div");

            square.classList.add("square");

            // ==========================
            // Square Color
            // ==========================

            square.classList.add(
                (row + col) % 2 === 0
                    ? "dark"
                    : "light"
            );

            // ==========================
            // Data Attributes
            // ==========================

            square.dataset.row = row;

            square.dataset.col = col;

            square.dataset.square =
                files[col] + (8 - row);

            // ==========================
            // Last Move Highlight
            // ==========================

            if (

                lastMoveHighlight &&

                (

                    (row === lastMoveHighlight.fromRow &&
                     col === lastMoveHighlight.fromCol)

                    ||

                    (row === lastMoveHighlight.toRow &&
                     col === lastMoveHighlight.toCol)

                )

            ) {

                square.classList.add(

                    (row + col) % 2 === 0

                        ? "last-move-dark"

                        : "last-move-light"

                );

            }

            // ==========================
            // Piece
            // ==========================

            const piece = document.createElement("div");

            piece.classList.add("piece");

            piece.textContent = currentPiece;

            if (isWhitePiece(currentPiece)) {

                piece.classList.add("white-piece");

            }

            if (isBlackPiece(currentPiece)) {

                piece.classList.add("black-piece");

            }

            square.appendChild(piece);

            // ==========================
            // Coordinates
            // ==========================

            if (col === 0) {

                const rank = document.createElement("span");

                rank.className = "rank-coordinate";

                rank.textContent = 8 - row;

                square.appendChild(rank);

            }

            if (row === 7) {

                const file = document.createElement("span");

                file.className = "file-coordinate";

                file.textContent = files[col];

                square.appendChild(file);

            }

            // ==========================
            // Selected Piece
            // ==========================

            if (

                row === selectedRow &&
                col === selectedCol

            ) {

                square.classList.add("selected");

            }

            // ==========================
            // King In Check
            // ==========================

            if (

                currentPiece === "♔" &&
                isKingInCheck("white")

            ) {

                square.style.boxShadow =
                    "inset 0 0 0 4px red";

            }

            if (

                currentPiece === "♚" &&
                isKingInCheck("black")

            ) {

                square.style.boxShadow =
                    "inset 0 0 0 4px red";

            }

            // ==========================
            // Legal Moves
            // ==========================

            if (isLegalMove(row, col)) {

                if (currentPiece === "") {

                    const dot = document.createElement("div");

                    dot.className = "move-dot";

                    square.appendChild(dot);

                }

                else {

                    const ring = document.createElement("div");

                    ring.className = "capture-ring";

                    square.appendChild(ring);

                }

            }

            // ==========================
            // Click
            // ==========================

            square.addEventListener(

                "click",

                () => handleClick(row, col)

            );

            chessboard.appendChild(square);

        }

    }

}
// ==================================================
// Captured Pieces
// ==================================================

function updateCapturedPieces() {

    capturedWhite.innerHTML = "";
    capturedBlack.innerHTML = "";

    // Initial piece count
    const initial = {
        "♔":1,"♕":1,"♖":2,"♗":2,"♘":2,"♙":8,
        "♚":1,"♛":1,"♜":2,"♝":2,"♞":2,"♟":8
    };

    // Count pieces currently on board
    const current = {};

    for (const piece in initial) {
        current[piece] = 0;
    }

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = board[row][col];

            if (piece !== "") {
                current[piece]++;
            }

        }

    }

    // Captured pieces
    const whiteCaptured = {};
    const blackCaptured = {};

    for (const piece in initial) {

        const captured = initial[piece] - current[piece];

        if (captured <= 0) continue;

        if (isWhitePiece(piece)) {

            whiteCaptured[piece] = captured;

        } else {

            blackCaptured[piece] = captured;

        }

    }

    renderCapturedPieces(capturedBlack, blackCaptured);
    renderCapturedPieces(capturedWhite, whiteCaptured);

}

// ==================================================
// Render Captured Pieces
// ==================================================

function renderCapturedPieces(container, counts) {

    container.innerHTML = "";

    for (const piece in counts) {

        const total = counts[piece];

        if (total === 0) continue;

        const group = document.createElement("div");
        group.className = "captured-group";

        // Maximum 4 pieces show
        const visible = Math.min(total, 4);

        for (let i = 0; i < visible; i++) {

            const span = document.createElement("span");

            span.className = "captured-piece";

            span.textContent = piece;

            group.appendChild(span);

        }

        // Show +N if more pieces
        if (total > 4) {

            const extra = document.createElement("span");

            extra.className = "captured-extra";

            extra.textContent = "+" + (total - 4);

            group.appendChild(extra);

        }

        container.appendChild(group);

    }

}
// ==================================================
// Move History
// ==================================================

function updateMoveHistory() {

    movesDiv.innerHTML = "";

    const visibleMoves = moveHistory.slice(0, currentPosition);

    for (let i = 0; i < visibleMoves.length; i += 2) {

        const row = document.createElement("div");

        row.className = "move-row";

        const moveNumber = document.createElement("div");

        moveNumber.className = "move-number";

        moveNumber.textContent = `${Math.floor(i / 2) + 1}.`;

        const whiteMove = document.createElement("div");

        whiteMove.className = "white-move";

        whiteMove.textContent =
            visibleMoves[i]?.notation || "";

        const blackMove = document.createElement("div");

        blackMove.className = "black-move";

        blackMove.textContent =
            visibleMoves[i + 1]?.notation || "";

        row.append(

            moveNumber,

            whiteMove,

            blackMove

        );

        movesDiv.appendChild(row);

    }

}
// ==================================================
// Piece Animation
// ==================================================

function animateMove(piece, fromRow, fromCol, toRow, toCol) {

    const fromSquare = document.querySelector(
        `[data-row="${fromRow}"][data-col="${fromCol}"]`
    );

    const toSquare = document.querySelector(
        `[data-row="${toRow}"][data-col="${toCol}"]`
    );

    if (!fromSquare || !toSquare) {

        return Promise.resolve();

    }

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

        clone.addEventListener(

            "transitionend",

            () => {

                clone.remove();

                if (pieceElement) {

                    pieceElement.style.visibility = "visible";

                }

                resolve();

            },

            { once: true }

        );

    });

}

// ==================================================
// Square Animation
// ==================================================

function animateSquare(row, col) {

    requestAnimationFrame(() => {

        const square = document.querySelector(

            `[data-row="${row}"][data-col="${col}"]`

        );

        if (!square) return;

        square.style.transform = "scale(1.25)";

        setTimeout(() => {

            square.style.transform = "scale(1)";

        }, 180);

    });

}
function showGameOver(title, message) {

    gameOver = true;

    document.getElementById("game-over-title").textContent =
        title;

    document.getElementById("game-over-message").textContent =
        message;

    document
        .getElementById("game-over-modal")
        .classList.remove("hidden");

}
function hideGameOver() {

    gameOver = false;

    document
        .getElementById("game-over-modal")
        .classList.add("hidden");

}
document
    .getElementById("new-game-modal-btn")
    .addEventListener("click", () => {

        location.reload();

    });