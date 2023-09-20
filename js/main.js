
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

// boolean variable to track if the game is playing or paused
let isGameRunning = false;
let playButton = document.getElementById('playButton');

// buttons size and position variables
let button1X = 200;
let button1Y = 150;
let buttonWidth = 200;
let buttonHeight = 50;
let button2X = 200;
let button2Y = 250;
let selectedButton = 1;

let mode = "HOMEPAGE";

function preload(){
  // preload the sounds
  backgroundMusic = loadSound("assets/trilha.mp3");
  scoreSound = loadSound("assets/ponto.mp3");
  racketSound = loadSound("assets/raquetada.mp3");
  
}

function setup() {
  // crates the canvas with p5
  let canvas = createCanvas(600, 400);

  // adds the canvas to html as child of the element that has the canvasContainer id
  canvas.parent('canvasContainer');


  backgroundMusic.loop();
  

}

// function playAndPauseGame() {
//   if (isGameRunning) {
//     noLoop(); // Pause the game
//     isGameRunning = false;
//     playButton.textContent = 'Play';
//     backgroundMusic.pause();

//   } else {
//     backgroundMusic.loop();
//     loop(); // Start or resume the game
//     isGameRunning = true;
//     playButton.textContent = 'Pause';
//   }
// }

function draw() {
  background(0);
  
  if(mode === "HOMEPAGE"){
    // Draw buttons
    noStroke();
    fill(245, 140, 0);
    rect(button1X, button1Y, buttonWidth, buttonHeight, 10);
    rect(button2X, button2Y, buttonWidth, buttonHeight, 10);

    // Highlight the selected button
    stroke(250);
    noFill();
    if (selectedButton === 1) {
      rect(button1X, button1Y, buttonWidth, buttonHeight, 10);
    } else if (selectedButton === 2) {
      rect(button2X, button2Y, buttonWidth, buttonHeight, 10);
    }

    // Display buttons text
    textSize(26);
    textAlign(CENTER);
    fill(255);
    text("1 Jogador", button1X + buttonWidth / 2, button1Y + buttonHeight / 2 + 10);
    text("2 Jogadores", button2X + buttonWidth / 2, button2Y + buttonHeight / 2 + 10);

    // verrify button pressed
    keyPressed();
}
  
  if(mode == "SINGLE_PLAYER"){
    allModesBasicSetup();

    moveOpponentRacket();
    moveRacket(UP_ARROW, DOWN_ARROW);

  }
  if(mode === "MULTIPLAYER"){
    allModesBasicSetup();

    moveRacket(87, 83);
    moveRacket2InMultiplayer();

    
  }
  
}
function allModesBasicSetup(){
    drawBall();
    
    moveBall();
    
    checkBallCollision();

    drawRacket(racketPositionX, racketPositionY);

    drawRacket(opponentRacketPositionX, opponentRacketPositionY );
    
    checkRacketAndBallCollision(racketPositionX, racketPositionY);
    checkRacketAndBallCollision(opponentRacketPositionX, opponentRacketPositionY);
    
    drawScoreboard();
    
    changeScore();
    
    fixBallGettingStuckinTheRacketsBug(0);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    selectedButton = 1;
  } else if (keyCode === DOWN_ARROW) {
    selectedButton = 2;
  } else if (keyCode === ENTER) {
    if (selectedButton === 1) {
      // Start single player game
      mode = "SINGLE_PLAYER";
      // Other game setup for single player
    } else if (selectedButton === 2) {
      // Start multiplayer game
      mode = "MULTIPLAYER";
      // Other game setup for multiplayer
    }
  }
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


function moveRacket(up, down){
  // uses methods from p5 lib to control the racket with up and down arrow keys
  if (keyIsDown(up) && racketPositionY > 0){
    racketPositionY -=10;
  } 
  if (keyIsDown(down) && racketPositionY + racketHeight < height){
    racketPositionY +=10;
  }
}

function moveRacket1InMultiplayer(){
  // uses methods from p5 lib to control the racket with up and down arrow keys
  if (keyIsDown(87) && racketPositionY > 0){
    racketPositionY -=10;
  } 
  if (keyIsDown(83) && racketPositionY + racketHeight < height){
    racketPositionY +=10;
  }
}

function moveRacket2InMultiplayer(){
  // uses method keyIsDown from p5 lib to control the racket with up and down arrow keys
  if (keyIsDown(UP_ARROW) ){
    opponentRacketPositionY-=10;
  } 
  if (keyIsDown(DOWN_ARROW) ){
    opponentRacketPositionY +=10;
  }
  preventOpponentRacketFromGoingOffScreen();
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

  preventOpponentRacketFromGoingOffScreen();
}

function preventOpponentRacketFromGoingOffScreen() {
  if (opponentRacketPositionY < 0){
    opponentRacketPositionY = 0;
  }
  if (opponentRacketPositionY + racketHeight > height){
    opponentRacketPositionY = height - racketHeight;
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
