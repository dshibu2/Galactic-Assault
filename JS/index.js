// added to github

// canvas board functionality
var sizeTile = 40;  //40 pixels
var numRows = 20;
var numCol = 20;

var canvas_board, context;
var boardWidth = sizeTile * numCol;
var boardHeight = sizeTile * numRows;

// drawing ship
var shipWidth = sizeTile * 2;
var shipHeight = sizeTile;
var shipX = sizeTile * (numCol / 2) - sizeTile;
var shipY = sizeTile * numRows - (sizeTile * 2);

var ship = {
    posX : shipX,
    posY : shipY,
    width : shipWidth,
    height : shipHeight
}

var shipMovementX = sizeTile / 2;

// drawing aliens
var alienArray = [];
var alienWidth = sizeTile * 1.5; 
var alienHeight = sizeTile;
var alienX = sizeTile;
var alienY = sizeTile;
var alienImg;

var alienRows = 2;
var alienCols = 4;
var alienCount = 0;

var alienMovementRateX = 1;

// bullets 
var bulletArray = [];
var bulletY = -10;  // rate of bullet moving up

// score
var score = 0;
var gameOver = false;


window.onload = function() {
    canvas_board = document.getElementById('canvas_board');
    canvas_board.width = boardWidth;
    canvas_board.height = boardHeight;

    // drawing on the board
    context = canvas_board.getContext("2d");
    // 1. drawing and positioning the ship
    context.fillStyle = "red";
    context.fillRect(ship.posX, ship.posY, ship.width, ship.height);
    // 2. loading alien image
    alienImg = new Image();
    alienImg.src = "../images/alien.png"
    createAliens();

    requestAnimationFrame(callBackShip);
    document.addEventListener('keydown', moveShip);
    document.addEventListener('keyup', shoot);
}

// acts like a loop to draw the ship over and over
function callBackShip() {
    requestAnimationFrame(callBackShip);

    if (gameOver) return;

    // ship
    context.clearRect(0, 0, canvas_board.width, canvas_board.height);
    context.fillRect(ship.posX, ship.posY, ship.width, ship.height);
    
    // aliens
    for (var i = 0; i < alienArray.length; i++) {
        var alien = alienArray[i];
        if (alien.alive) {
            // drawing alien
            context.drawImage(alienImg, alien.posX, alien.posY, alien.width, alien.height); 
            
            alien.posX += alienMovementRateX; // moving the aliens sideways
            // when alien touches the border, move it to the opposite direction
            if (alien.posX + alien.width >= boardWidth || alien.posX <= 0) {
                alienMovementRateX *= -1;
                alien.posX += alienMovementRateX * 2;
                // move the aliens down by a row
                for (var j = 0; j < alienArray.length; j++) {
                    alienArray[j].posY += sizeTile;
                }
            }
            if (alien.posY >= ship.posY) {gameOver = true;} // game over if alien touches ship
        }
    }

    // bullets
    for (var i = 0; i < bulletArray.length; i++) {
        var bullet = bulletArray[i];
        bullet.posY += bulletY;
        // drawing bullets
        context.fillStyle = "black";
        context.fillRect(bullet.posX, bullet.posY, bullet.width, bullet.height);

        // when bullet collides with any of the aliens
        for (var j = 0; j < alienArray.length; j++) {
            var alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet,alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 5;
            }
        }
    }
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].posY < 0)) {
        bulletArray.shift(); // to remove the first element of the array
    } 

    // going to the next level when all the aliens are shot
    if (alienCount === 0) {
        alienCols += 1;
        alienRows += 1;
        alienMovementRateX += 0.35;
        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    // records the score
    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText("Score: "+ score, 10, 20);
}

function moveShip(event) {
    if (gameOver) return;
    if (event.code === "ArrowLeft" && (ship.posX > 20)) {
        ship.posX -= shipMovementX;
    } else if (event.code === "ArrowRight" && (ship.posX < 700)) {
        ship.posX += shipMovementX;
    }
}

// creating aliens
function createAliens() {
    for (var i = 0; i < alienCols; i++) {   
        for (var j = 0; j < alienRows; j++) {
            var alienObj = {
                img : alienImg,
                posX : alienX + (alienWidth + sizeTile / 2) * i,
                posY : alienY + (alienHeight + sizeTile / 2)* j,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alienObj);
        }
    }
    alienCount = alienArray.length;
}


function shoot(event) {
    if (gameOver) return;
    if (event.code === "Space") {
        var bullet = {
            posX : ship.posX + (shipWidth / 2),
            posY : ship.posY,
            width : sizeTile / 4,
            height : sizeTile / 2,
            used : false
        }
        bulletArray.push(bullet);
    }
} 

// function to detect collision with the aliens
function detectCollision(a, b) {
    return a.posX < b.posX + b.width &&
            a.posX + a.width > b.posX &&
            a.posY < b.posY + b.height &&
            a.posY + a.height > b.posY;
}