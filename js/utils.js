// ==================================================
// Anand Chess - Utilities
// Common helper functions.
// ==================================================

// Files

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

// ==================================================
// Piece Helpers
// ==================================================

function isWhitePiece(piece) {

    return piece !== "" && "♔♕♖♗♘♙".includes(piece);

}

function isBlackPiece(piece) {

    return piece !== "" && "♚♛♜♝♞♟".includes(piece);

}