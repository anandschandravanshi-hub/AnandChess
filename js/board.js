// ===============================
// Anand Chess
// Board State
// ===============================
let whiteKingMoved = false;
let blackKingMoved = false;

let whiteLeftRookMoved = false;
let whiteRightRookMoved = false;

let blackLeftRookMoved = false;
let blackRightRookMoved = false;

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

let lastMove = null;
let enPassantSquare = null;
let halfMoveClock = 0;
let positionHistory = [];

let currentPlayer = "white";
let selectedRow = null;
let selectedCol = null;
let legalMoves = [];
let moveHistory = [];
let boardHistory = [];
let currentPosition = -1;
let currentHistoryIndex = -1;
let historyMode = false;
let lastMoveHighlight = null;
let boardFlipped = false;
console.log("board.js loaded");