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

let mimansh = {
    x: mimanshx,
    y: mimanshy,
    width: mimanshwidth,
    height: mimanshheight
}

//pipes
let pipearray = [];
let pipewidth = 64;
let pipeheight = 330;
let pipex = boardwidth;

let toppipeimg;
let bottompipeimg;

//physics
let velocityx = -2;
let velocityy = 0;
let gravity = 0.2;

let gameover = false;
let score = 0;
let gameStarted = false;

let pipeInterval;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d");

    //load images
    mimanshimg = new Image();
    mimanshimg.src = "./images/mimansh.png";
    
    toppipeimg = new Image();
    toppipeimg.src = "./images/toppillar.png"; // Separate top pillar image
    
    bottompipeimg = new Image();
    bottompipeimg.src = "./images/bottompillar.png"; // Separate bottom pillar image

    requestAnimationFrame(update);
    document.addEventListener("keydown", movebird);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, boardwidth, boardheight);
    
    if (gameover) {
        // Draw everything first, then show game over screen
        drawGameElements();
        
        context.fillStyle = "white";
        context.font = "40px sans-serif";
        context.fillText("GAME OVER", boardwidth/6, boardheight/2);
        
        
        return;
    }
    
    if (gameStarted) {
        velocityy += gravity;
        mimansh.y += velocityy;
    }
    
    // Keep bird within screen bounds
    if (mimansh.y < 0) {
        mimansh.y = 0;
        velocityy = 0;
    }
    
    drawGameElements();

    // Game over if bird hits bottom
    if (mimansh.y + mimansh.height >= boardheight) {
        gameover = true;
    }
    
    
}

function drawGameElements() {
    // Draw mimansh
    context.drawImage(mimanshimg, mimansh.x, mimansh.y, mimansh.width, mimansh.height);
    
    // Draw pipes
    if (gameStarted) {
        for (let i = pipearray.length - 1; i >= 0; i--) {
            let pipe = pipearray[i];
            pipe.x += velocityx;

            // FIXED: Simple drawing - no flipping needed since you have separate images
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            // Score counting
            if (!pipe.passed && pipe.x + pipe.width < mimansh.x) {
                score += 0.5;
                pipe.passed = true;
            }

            // Collision detection
            if (detectcollision(mimansh, pipe)) {
                gameover = true;
            }

            // Remove off-screen pipes
            if (pipe.x + pipe.width < 0) {
                pipearray.splice(i, 1);
            }
        }
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
}

function placepipe() {
    if (gameover || !gameStarted) {
        return;
    }
    
    let openingSpace = boardheight / 3;
    
    // Calculate random position for the gap
    let minGapY = 100;
    let maxGapY = boardheight - openingSpace - 100;
    let gapY = minGapY + Math.random() * (maxGapY - minGapY);
    
    // FIXED: Use the actual top pillar image (no flipping needed)
    let toppipe = {
        img: toppipeimg, // This should be your pre-made top pillar image
        x: pipex,
        y: gapY - pipeheight, // Top pipe hangs down from above
        width: pipewidth,
        height: pipeheight,
        top: true,
        passed: false
    };

    // Bottom pipe
    let bottompipe = {
        img: bottompipeimg, // This should be your pre-made bottom pillar image
        x: pipex,
        y: gapY + openingSpace, // Bottom pipe grows up from below
        width: pipewidth,
        height: pipeheight,
        top: false,
        passed: false
    };

    pipearray.push(toppipe);
    pipearray.push(bottompipe);
}

function movebird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // If game is over, restart first
        if (gameover) {
            restartGame();
            return;
        }
        
        if (!gameStarted && !gameover) {
            startGame();
            velocityy = -6;
            return;
        }
        
        if (gameStarted) {
            velocityy = -6;
        }
    }   
}

function startGame() {
    gameStarted = true;
    pipeInterval = setInterval(placepipe, 1500);
}

function restartGame() {
    // Clear existing interval
    if (pipeInterval) {
        clearInterval(pipeInterval);
    }
    
    // Reset everything
    mimansh.y = mimanshy;
    pipearray = [];
    score = 0;
    gameover = false;
    gameStarted = false;
    velocityy = 0;
    
    // Clear any existing interval
    clearInterval(pipeInterval);
    
    // Start fresh
    startGame();
    velocityy = -6; // Give initial jump
}

function detectcollision(a, b) {
    return a.x < b.x + b.width &&
           a.y < b.y + b.height &&
           a.x + a.width > b.x &&
           a.y + a.height > b.y;
}