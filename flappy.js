//board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d"); // used for drawing on the board
    context.fillStyle = "skyblue";
    context.fillRect(0, 0, boardwidth, boardheight);
}
