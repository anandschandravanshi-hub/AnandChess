// ===============================
// Anand Chess
// Utilities
// ===============================
const files = ["a","b","c","d","e","f","g","h"];

function isWhitePiece(piece) {
    return piece !== "" && "♔♕♖♗♘♙".includes(piece);
}

function isBlackPiece(piece) {
    return piece !== "" && "♚♛♜♝♞♟".includes(piece);
}

console.log("utils.js loaded");