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

// sounds
let racketSound;
let scoreSound;
let backgroundMusic;

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


// sigkle/multiplayer buttons size and position variables

let singlePlayerButtonX = 200;
let singlePlayerButtonY = 150;
let gameModeButtonsWidth = 200;
let gameModeButtonsHeight = 50;
let multiPlayerButtonX = 200;
let multiPlayerButtonY = 250;
let selectedButton = 1;

// game mode variable
let mode = "HOMEPAGE";

function draw() {
  background(0);
  
  if(mode === "HOMEPAGE"){
    // draw game mode buttons
    noStroke();
    fill(245, 140, 0);
    rect(singlePlayerButtonX, singlePlayerButtonY, gameModeButtonsWidth, gameModeButtonsHeight, 10);
    rect(multiPlayerButtonX, multiPlayerButtonY, gameModeButtonsWidth, gameModeButtonsHeight, 10);

    // highlight the selected button
    stroke(250);
    noFill();
    if (selectedButton === 1) {
      rect(singlePlayerButtonX, singlePlayerButtonY, gameModeButtonsWidth, gameModeButtonsHeight, 10);
    } else if (selectedButton === 2) {
      rect(multiPlayerButtonX, multiPlayerButtonY, gameModeButtonsWidth, gameModeButtonsHeight, 10);
    }

    // Display buttons text
    textSize(26);
    textAlign(CENTER);
    fill(255);
    text("1 Jogador", singlePlayerButtonX + gameModeButtonsWidth / 2, singlePlayerButtonY + gameModeButtonsHeight / 2 + 10);
    text("2 Jogadores", multiPlayerButtonX + gameModeButtonsWidth / 2, multiPlayerButtonY + gameModeButtonsHeight / 2 + 10);

    // verrify button pressed
    keyPressed();
}
  // if single player selected, loads the things needed for single play and the basic setup
  if(mode == "SINGLE_PLAYER"){
    allModesBasicSetup();

    moveOpponentRacket();
    moveRacket(UP_ARROW, DOWN_ARROW);

  }
  // if multi player selected, loads the things needed for multi play and the basic setup
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

    drawPlayPauseButton();
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


// pause button size and positions variables
let playPauseButtonX = 35;
let playPauseButtonY = 10;
let playPauseButtonSize = 40;
// boolean variable to track if the game is playing or paused
let isGameRunning = true;

function drawPlayPauseButton() {
  // draw the button container
  fill(0, 0, 0, 0);
  stroke(255);
  rect(playPauseButtonX, playPauseButtonY, playPauseButtonSize, playPauseButtonSize, 10);
  
  
  // ckeck if the game is running or not and display pause or play icon based on that information
  fill(255);
  if (isGameRunning) {
    // Draw pause icon
    let barWidth = 10;
    let barHeight = 20;
    let spacing = 5;
    rect(playPauseButtonX + (playPauseButtonSize - barWidth * 2 - spacing) / 2, playPauseButtonY + 10, barWidth, barHeight);
    rect(playPauseButtonX + (playPauseButtonSize - barWidth * 2 - spacing) / 2 + barWidth + spacing, playPauseButtonY + 10, barWidth, barHeight);
  } else {
    // Draw play icon
    triangle(
      playPauseButtonX + 10, playPauseButtonY + 10,
      playPauseButtonX + 10, playPauseButtonY + 30,
      playPauseButtonX + 30, playPauseButtonY + 20
    );
  }
}

function mousePressed() {
  // mouseX and Y are variables from p5 lib, this functiion tracks the position of the mouse using
  // those variables, so we can actually click in the button
  if (
    mouseX >= playPauseButtonX &&
    mouseX <= playPauseButtonX + playPauseButtonSize &&
    mouseY >= playPauseButtonY &&
    mouseY <= playPauseButtonY + playPauseButtonSize
  ) {
    // here if the button is clicked, the game pauses or plays based on the control variable
    isGameRunning = !isGameRunning;
    if (isGameRunning) {
      loop(); //play the game
      backgroundMusic.loop();
    } else {
      noLoop(); // pause the game
      backgroundMusic.pause();
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


// control variable to check the ball and racket collision
let areRacketAndBallColliding = false

function checkRacketAndBallCollision(x, y){
  // uses the collideRectCircle function in the p5.collide.js lib to check the collision

  areRacketAndBallColliding = collideRectCircle(x, y, racketWidth, racketHeight, ballPositionX, ballPositionY, ballRadius);
  
  // if the ball collides with the racket, the X speed is inverted to reverse the movement   

  if (areRacketAndBallColliding){
    ballSpeedX *= -1; // Reverse the X speed
    racketSound.play();
    
    // Move the ball a little away from the racket to prevent sticking
    if (ballPositionX < width / 2) {
      ballPositionX = x + racketWidth + ballRadius;
    } else {
      ballPositionX = x - ballRadius;
    }
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

// game score variables
let playerScore = 0;
let opponentScore = 0;

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
