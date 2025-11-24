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

//pipes
let pipearray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipex = boardwidth;
let pipey = 0;

let toppipeimg;
let bottompipeimg;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d"); // used for drawing on the board

    //draw
   /* context.fillStyle = "green";*/
   // context.fillRect(mimansh.x, mimansh.y, mimansh.width, mimansh.height);
   

    //load images
    mimanshimg = new Image();
    mimanshimg.src = "./images/mimansh.png";
    mimanshimg.onload = function() {
        context.drawImage(mimanshimg, mimansh.x, mimansh.y, mimansh.width, mimansh.height);
   }
   toppipeimg = new Image();
  toppipeimg.src = "./images/pillar2.png.png";
   
  bottompipeimg = new Image();
  bottompipeimg.src = "./images/pillar.png.png";
   
    requestAnimationFrame(update);
    this.setInterval(placepipe, 1500);//every 1.5 seconds
}

 function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, boardwidth, boardheight);
    
    //mimansh bird
    context.drawImage(mimanshimg, mimansh.x, mimansh.y, mimansh.width, mimansh.height);

}


   