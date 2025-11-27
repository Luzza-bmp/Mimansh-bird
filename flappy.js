//board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;

//mimansh
let mimanshwidth = 80;
let mimanshheight = 46;
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
let pipewidth = 120;
let pipeheight = 330;
let pipex = boardwidth;
let pipey = 0;

let toppipeimg;
let bottompipeimg;


//physics
let velocityx = -2; //pipe moving left
let velocityy = 0;//bird jump speed
let gravity = 0.4; //bird falling speed


let gameover = false;
let score = 0;



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
    toppipeimg.src = "./images/toppillar.png";
   
  bottompipeimg = new Image();
  bottompipeimg.src = "./images/bottompillar.png";
   
    requestAnimationFrame(update);
    setInterval(placepipe, 1500);//every 1.5 seconds
    this.document.addventListener("keydown", movebird);

}

 function update() {
    requestAnimationFrame(update);
    if (gameover) {
        return;
    }
    context.clearRect(0, 0, boardwidth, boardheight);
    
    //mimansh bird
    velocityy += gravity;
    /*mimansh.y += velocityy;*/
    mimansh.y = Math.max(Math.min(mimansh.y + velocityy, boardheight - mimansh.height), 0);
    context.drawImage(mimanshimg, mimansh.x, mimansh.y, mimansh.width, mimansh.height);



    if (mimansh.y + mimansh.height >= boardheight) {
        gameover = true;
    }
    
    
    //pipes
   // inside update()
for (let i = pipearray.length - 1; i >= 0; i--) {
    let pipe = pipearray[i];
    pipe.x += velocityx;

    // draw the pipe image stretched to the computed height
    // (top pipe y is 0, bottom pipe y is its computed y)
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && pipe.x + pipe.width < mimansh.x) {
        score += 0.5; // each pair of pipes gives 1 point (0.5 for top, 0.5 for bottom)
        pipe.passed = true;
    }


    if (detectcollision(mimansh, pipe)) {
        gameover = true;
    }

    // remove pipes that are completely off-screen (optional but recommended)
    if (pipe.x + pipe.width < 0) {
        pipearray.splice(i, 1);
    }
}

        // clear pipes
        while (pipearray.length > 0 && pipearray[0].x - pipewidth ) {
            pipearray.shift(); // remove off-screen pipes
        }

      
      

        //score
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText(score, 5, 45);

        if (gameover) {
            context.fillText = "red";
            context.font = "60px sans-serif";
            context.fillText("Game Over", boardwidth / 4, boardheight / 2);
        }

 }

function placepipe() {

    if (gameover) {
        return;
    }
    // size of the gap between top and bottom pipes
    let openingspace = Math.floor(boardheight / 4); // change to taste

    // safe margins so pipes are not flush against edges (optional)
    let marginTop = 30;
    let marginBottom = 30;

    // gapY is the y coordinate (distance from top) where the gap starts
    // choose it so the gap is fully on screen and leaves margins
    let minGapY = marginTop;
    let maxGapY = boardheight - openingspace - marginBottom;
    let gapY = Math.floor(minGapY + Math.random() * (maxGapY - minGapY + 1));

    // TOP pipe: anchored at the top (y = 0), height = gapY
    let topPipeHeight = gapY;
    let toppipe = {
        img: toppipeimg,
        x: pipex,
        y: 0,                 // always start at top edge
        width: pipewidth,
        height: topPipeHeight,
        passed: false
    };
    pipearray.push(toppipe);

    // BOTTOM pipe: anchored at gapY + openingspace, height = remaining space
    let bottomY = gapY + openingspace;
    let bottomPipeHeight = boardheight - bottomY;
    let bottompipe = {
        img: bottompipeimg,
        x: pipex,
        y: bottomY,
        width: pipewidth,
        height: bottomPipeHeight,
        passed: false
    };
    pipearray.push(bottompipe);
}

function movebird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //move mimansh up
        velocityy = -6; // jump speed

        //restart if game over
        if (gameover) {
            mimansh.y = mimanshy;
            pipearray = [];
            score = 0;
            velocityy = 0;
            gameover = false;
        }
       
    }   
}


function detectcollision(a,b) {
    return (a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y) 
            
        }




