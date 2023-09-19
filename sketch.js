// ball size and position variables
let ballPositionX = 300;
let ballPositionY = 200;
let ballDiameter =  22;
let ballRadius = ballDiameter / 2;

// ball movement variables
let ballSpeedX = 7.5;
let ballSpeedY = 7.5;

// racket size and position variables
let racketPositionX = 5;
let racketPositionY = 150;
let racketWidth = 12;
let racketHeight = 90;

// opponent racket position variables
let opponentRacketPositionX = 581;
let opponentRacketPositionY = 150;


// control variable to check the ball and racket collision
let areRacketAndBallColliding = false

// game score variables
let playerScore = 0;
let opponentScore = 0;

// sounds
let racketSound;
let scoreSound;
let backgroundMusic;

function preload(){
  backgroundMusic = loadSound("trilha.mp3");
  scoreSound = loadSound("ponto.mp3");
  racketSound = loadSound("raquetada.mp3")
  
}

function setup() {
  createCanvas(600, 400);
  backgroundMusic.loop();
}

function draw() {
  background(0);
  
  drawBall();
  
  moveBall();
  
  checkBallCollision();
  
  drawRacket(racketPositionX, racketPositionY);
  
  moveRacket();

  checkRacketAndBallCollision(racketPositionX, racketPositionY);
  checkRacketAndBallCollision(opponentRacketPositionX, opponentRacketPositionY);
  
  
  drawRacket(opponentRacketPositionX, opponentRacketPositionY );
  
  moveOpponentRacket();
  
  drawScoreboard();
  
  changeScore();
  
  fixBallGettingStuckinTheRacketsBug(0);
}

function fixBallGettingStuckinTheRacketsBug(){
    if (ballPositionX - ballRadius < 0){
      ballPositionX = 30;
    } else if (ballPositionX > width - ballRadius) {
      ballPositionX = width - 30
    }
}

function drawBall (){
    // uses the circle function in p5 lib to draw the ball
    circle(ballPositionX, ballPositionY, ballDiameter)
}

function moveBall(){
  // adds the a value to the current X and Y ball positions constantly so the ball moves
  ballPositionX += ballSpeedX;
  ballPositionY += ballSpeedY;
}

function checkBallCollision(){
  // check if the ball hits the edge of the screen, if it does, it turn over
  if(ballPositionX + ballRadius > width || ballPositionX - ballRadius < 0){
    ballSpeedX *= -1   
  }
  
  if(ballPositionY + ballRadius > height || ballPositionY - ballRadius < 0){
    ballSpeedY *= -1   
  }
  
}

function drawRacket(x,y){
    // uses the rect function in p5 lib to draw the rackets
  
  rect(x, y, racketWidth, racketHeight);
  
}


function moveRacket(){
  // uses methods from p5 lib to control the racket with up and down arrow keys
  if (keyIsDown(UP_ARROW) && racketPositionY > 0){
    racketPositionY -=10;
  } 
  if (keyIsDown(DOWN_ARROW) && racketPositionY + racketHeight < height){
    racketPositionY +=10;
  }
}


function checkRacketAndBallCollision(x, y){
  // uses the collideRectCircle function in the p5.collide.js lib to check the collision
  
  areRacketAndBallColliding = collideRectCircle(x, y, racketWidth, racketHeight, ballPositionX, ballPositionY, ballRadius);
  
  // if the ball collides with the racket, the X speed is inverted to reverse the movement   
  if(areRacketAndBallColliding){
    ballSpeedX *= -1;
    racketSound.play();
  }
}

function moveOpponentRacket(){
  // Define a speed for the opponent's racket
  let speed = 6.3;

  // Calculate the direction to move the racket
  let direction = ballPositionY - (opponentRacketPositionY + racketHeight / 2);

  // If the ball is above the racket, move up
  if (direction < 0) {
    opponentRacketPositionY -= speed;
  }
  // If the ball is below the racket, move down
  else if (direction > 0) {
    opponentRacketPositionY += speed;
  }

  // Prevent the racket from going off-screen
  if (opponentRacketPositionY < 0){
    opponentRacketPositionY = 0;
  }
  if (opponentRacketPositionY + racketHeight > height){
    opponentRacketPositionY = height - racketHeight;
  }
}

function drawScoreboard(){
  //general style
  stroke(255);
  textSize(16);
  textAlign(CENTER);
  
  //player's score   
  fill(color(255, 144, 0));
  rect(150, 10, 40, 20);
  fill(255);
  text(playerScore, 170, 25);
  
  // opponent's score
  fill(color(255, 144, 0));
  rect(450, 10, 40, 20);
  fill(255);
  text(opponentScore, 470, 25);
  
}

function changeScore(){
  if (ballPositionX > 590){
    playerScore += 1
    scoreSound.play();
  }
  if (ballPositionX < 10){
    opponentScore += 1
    scoreSound.play();
    
  }
}
