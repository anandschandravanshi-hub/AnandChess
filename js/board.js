// ==================================================
// Anand Chess - Board State
// ==================================================

// Initial Board Position

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

// Game State

let currentPlayer = "white";

let selectedRow = null;
let selectedCol = null;

let legalMoves = [];

let lastMove = null;
let lastMoveHighlight = null;

let boardFlipped = false;

// Move History

let moveHistory = [];

let boardHistory = [];

let currentPosition = 0;
let viewPosition = 0;

let historyMode = false;

// Draw Rules

let enPassantSquare = null;

let halfMoveClock = 0;

let positionHistory = [];

// Castling Rights

let whiteKingMoved = false;
let blackKingMoved = false;

let whiteLeftRookMoved = false;
let whiteRightRookMoved = false;

let blackLeftRookMoved = false;
let blackRightRookMoved = false;

let promotionResolve = null;
let gameOver = false;