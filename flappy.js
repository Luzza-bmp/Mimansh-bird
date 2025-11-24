//board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;

//mimansh
let mimanshwidth = 80;
let mimanshheight = 75;
let mimanshx = boardwidth / 8;
let mimanshy = boardheight / 2;
let mimanshimg;


let mimansh={
    x: mimanshx,
    y: mimanshy,
    width: mimanshwidth,
    height: mimanshheight
}

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d"); // used for drawing on the board

    //draw
   /* context.fillStyle = "green";*/
   // context.fillRect(mimansh.x, mimansh.y, mimansh.width, mimansh.height);
   

    //load mimansh image
    mimanshimg = new Image();
    mimanshimg.src = "./images/mimansh.png";
    mimanshimg.onload = function() {
        context.drawImage(mimanshimg, mimansh.x, mimansh.y, mimansh.width, mimansh.height);
   }
}
