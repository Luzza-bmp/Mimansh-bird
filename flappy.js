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

//sound variable 
let gameoversound;
let flappy;
let madarchu2;

window.onload = function() {

    //load sounds
    gameoversound = document.getElementById("gameoversound");
    flappy = document.getElementById("flappy");
    madarchu2 = document.getElementById("madarchu2");


    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d");

    //load images
    mimanshimg = new Image();
    mimanshimg.src = "./images/mimansh.png";
    
    toppipeimg = new Image();
    toppipeimg.src = "./images/toppillar.png";
    
    bottompipeimg = new Image();
    bottompipeimg.src = "./images/bottompillar.png";

    requestAnimationFrame(update);
    
    document.addEventListener("keydown", movebird);
    
    board.addEventListener("click", function() {
        movebird({code: "Space"});
    });
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, boardwidth, boardheight);
    
    if (gameover) {
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
        setgameover();
    }
}

function drawGameElements() {
    // Draw mimansh
    context.drawImage(mimanshimg, mimansh.x, mimansh.y, mimansh.width, mimansh.height);
    
    if (!gameStarted && !gameover) {
        context.fillStyle = "white";
        context.font = "20px sans-serif";
        context.textAlign = "center";
        context.fillText("Press Space, X or arrow key to START", boardwidth/2, boardheight/3);
        context.textAlign = "left";
    }
    
    // Draw pipes
    if (gameStarted) {
        for (let i = pipearray.length - 1; i >= 0; i--) {
            let pipe = pipearray[i];
            
            if (!gameover){
                pipe.x += velocityx;
            }

            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            // Score counting - PLAY FLAPPY SOUND ONLY WHEN SCORING
            if (!pipe.passed && pipe.x + pipe.width < mimansh.x) {
                score += 0.5;
                pipe.passed = true;
                
                // Play flappy sound when scoring
                try {
                    flappy.currentTime = 0;
                    flappy.play().catch(e => console.log("Audio play failed:", e));
                } catch(e) {
                    console.log("Audio error:", e);
                }
            }

            // Collision detection
            if (detectcollision(mimansh, pipe)) {
                setgameover();
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
    
    let minGapY = 100;
    let maxGapY = boardheight - openingSpace - 100;
    let gapY = minGapY + Math.random() * (maxGapY - minGapY);
    
    let toppipe = {
        img: toppipeimg,
        x: pipex,
        y: gapY - pipeheight,
        width: pipewidth,
        height: pipeheight,
        top: true,
        passed: false
    };

    let bottompipe = {
        img: bottompipeimg,
        x: pipex,
        y: gapY + openingSpace,
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
        
        // REMOVED: flappy sound from key press - now it only plays when scoring
        
        // If game is over, restart
        if (gameover) {
            restartGame();
            velocityy = -6;
            return;
        }
        
        // Start game on first keypress
        if (!gameStarted && !gameover) {
            startGame();
            velocityy = -6;
            return;
        }
        
        // Jump during game
        if (gameStarted) {
            velocityy = -6;
        }
    }   
}

function startGame() {
    gameStarted = true;
    pipeInterval = setInterval(placepipe, 1500);
    
    // Play madarchu2 sound when game starts
    try {
        madarchu2.currentTime = 0;
        madarchu2.play().catch(e => console.log("Madarchu2 play failed:", e));
    } catch(e) {
        console.log("Madarchu2 error:", e);
    }
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

    //reseting the sound
    gameoversound.pause();
    gameoversound.currentTime = 0;
    flappy.pause();
    flappy.currentTime = 0;
    madarchu2.pause();
    madarchu2.currentTime = 0;
    
    // Start the game
    startGame();
    velocityy = -6;
}

function detectcollision(a, b) {
    return a.x < b.x + b.width &&
           a.y < b.y + b.height &&
           a.x + a.width > b.x &&
           a.y + a.height > b.y;
}

function setgameover() {
    if (!gameover) {
        gameover = true;
        // Stop generating new pipes
        if (pipeInterval) {
            clearInterval(pipeInterval);
        }
        // Play game over sound
        try {
            gameoversound.currentTime = 0;
            gameoversound.play().catch(e => console.log("Game over sound play failed:", e));
        } catch(e) {
            console.log("Game over sound error:", e);
        }
    }
}