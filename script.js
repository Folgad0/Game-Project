// Define variables for game elements
const startingMenu = document.getElementById("starting-menu");
const gameWindow = document.getElementById("game-window");
const character = document.getElementById("character");
const obstacleTop = document.getElementById("obstacle-top");
const obstacleBottom = document.getElementById("obstacle-bottom");
const scoreDisplay = document.getElementById("score-display");

// Define variables for the end game screen
const endGameScreen = document.getElementById("end-game-screen");
const finalScoreDisplay = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const returnMenuMain = document.getElementById("return-to-main-menu");

// Function to play the audio when the button is clicked
function playAudio() {
  const mainMenuAudio = document.getElementById("main-menu-audio");
  if (mainMenuAudio) {
    mainMenuAudio.play();
  }
}
// Add event listener to the play audio button
const playAudioButton = document.getElementById("play-audio-button");
if (playAudioButton) {
  playAudioButton.addEventListener("click", playAudio);
}

// Game state variables
let score = 0;
let gameStarted = false;

// Player class definition
class Player {
  constructor() {
    // Initialize player properties
    this.positionY = Math.floor(gameWindow.offsetHeight / 2);
    this.velocityY = 0;
    this.gravity = 0.2;
    this.jumpStrength = 5;
    this.isJumping = false;
  }

  // Method to move the player
  move() {
    this.velocityY += this.gravity;
    this.positionY -= this.velocityY;

    // Ensure player stays within game window bounds
    if (this.positionY < 0) {
      this.positionY = 0;
      this.velocityY = 0;
    } else if (
      this.positionY >
      gameWindow.offsetHeight - character.offsetHeight
    ) {
      this.positionY = gameWindow.offsetHeight - character.offsetHeight;
      this.velocityY = 0;
    }

    character.style.bottom = `${this.positionY}px`;

    requestAnimationFrame(() => this.move());
  }

  // Method to handle jumping
  jump() {
    if (gameStarted) {
      this.velocityY = -this.jumpStrength;
      this.isJumping = true;
    } else {
      startGame();
      gameStarted = true;
    }
  }
}

// Function to start the game
function startGame() {
  //inittiate the gameplay
  if (!gameStarted) {
    gameStarted = true;
    startingMenu.style.display = "none";
    gameWindow.style.display = "block";
    background.style.display = "block";
    document.querySelector(".left-page").classList.add("hidden");
    document.querySelector(".right-page").classList.add("hidden");
    const splash = document.querySelector(".splash");
    splash.style.display = "none";

    const player = new Player();
    obstacleTop.style.display = "block";
    obstacleBottom.style.display = "block";

    window.addEventListener("keydown", function (event) {
      if (
        event.key === "ArrowUp" ||
        event.key === " " ||
        event.type === "touchstart"
      ) {
        player.jump();
      }
    });
    player.move();
    positionObstacles();
  }
  //play music in the game level
  const backgroundMusic = document.getElementById("background-music");
  if (backgroundMusic) {
    backgroundMusic.play();
  }
}

// Function to position the obstacles and make them move
function positionObstacles() {
  const gapHeight = 200;
  const windowHeight = gameWindow.offsetHeight;
  const windowWidth = gameWindow.offsetWidth;
  const bottomPosition = Math.floor(Math.random() * (windowHeight - gapHeight));

  obstacleTop.style.top = "0";
  obstacleTop.style.left = `${windowWidth}px`;
  obstacleTop.style.height = `${bottomPosition}px`;

  obstacleBottom.style.bottom = "0";
  obstacleBottom.style.left = `${windowWidth}px`;
  obstacleBottom.style.height = `${
    windowHeight - (bottomPosition + gapHeight)
  }px`;

  const obstacleSpeed = 2;

  function isColliding(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
      rect1.top > rect2.bottom ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right ||
      rect1.right < rect2.left
    );
  }

  function moveObstacles() {
    // Check for collision with character
    if (
      isColliding(character, obstacleTop) ||
      isColliding(character, obstacleBottom)
    ) {
      endGame(); // End the game if there's a collision
      return;
    }

    // Get the current left positions of the obstacles
    let obstacleTopPosition = parseInt(obstacleTop.style.left);
    let obstacleBottomPosition = parseInt(obstacleBottom.style.left);

    // Define obstacle speed
    const obstacleSpeed = 2;

    // Move the obstacles to the left
    obstacleTopPosition -= obstacleSpeed;
    obstacleBottomPosition -= obstacleSpeed;

    // Check if the left edge of the obstacle is outside the game window
    if (obstacleTopPosition < -obstacleTop.offsetWidth) {
      // Reset obstacle to the right edge
      obstacleTopPosition = windowWidth;
      obstacleBottomPosition = windowWidth;

      // Generate a new random position for the bottom obstacle
      const newBottomPosition = Math.floor(
        Math.random() * (windowHeight - gapHeight)
      );

      // Update the positions of the obstacles
      obstacleTop.style.height = `${newBottomPosition}px`; // Adjust height to create gap
      obstacleBottom.style.height = `${
        windowHeight - (newBottomPosition + gapHeight)
      }px`; // Adjust height to fill remaining space
    }

    // Update the positions of the obstacles
    obstacleTop.style.left = `${obstacleTopPosition}px`;
    obstacleBottom.style.left = `${obstacleBottomPosition}px`;

    // If the left edge of the obstacle is outside the game window
    if (obstacleTopPosition < 0) {
      // Move the obstacle completely outside the game window
      obstacleTop.style.left = `${windowWidth}px`;
      obstacleBottom.style.left = `${windowWidth}px`;
      // Increment score when no collision occurs
      score++;
      scoreDisplay.textContent = `Score: ${score}`; // Update score display
    }

    // Request animation frame for continuous movement
    requestAnimationFrame(moveObstacles);
  }

  moveObstacles();
}

// Function to end the game
function endGame() {
  endGameScreen.style.display = "block";
  finalScoreDisplay.textContent = score;
  cancelAnimationFrame(moveObstacles);
}

// Function to restart the game
function restartGame() {
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  endGameScreen.style.display = "none";
  character.style.bottom = "0px";
  positionObstacles();
  displayMainMenu();
  gameStarted = false;
}

// Event listener for the restart button
restartButton.addEventListener("click", restartGame);
