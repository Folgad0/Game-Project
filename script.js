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
let score = 0;
let gameStarted = false; // Flag to indicate whether the game has started

// Define Player class
class Player {
  constructor() {
    // Initialize player's properties
    this.positionY = Math.floor(gameWindow.offsetHeight / 2); // Initial Y position in the middle of the screen.
    this.velocityY = 0; // Vertical velocity
    this.gravity = 0.2; // Gravity strength
    this.jumpStrength = 5; // Jump strength
    this.isJumping = false; // Flag to indicate if the player is jumping
  }

  // Method to move the player
  move() {
    // Apply gravity
    this.velocityY += this.gravity;

    // Update player's position
    this.positionY -= this.velocityY;

    // Ensure player stays within game window bounds
    if (this.positionY < 0) {
      this.positionY = 0;
      this.velocityY = 0; // Stop jumping when hitting top boundary
    } else if (
      this.positionY >
      gameWindow.offsetHeight - character.offsetHeight
    ) {
      this.positionY = gameWindow.offsetHeight - character.offsetHeight;
      this.velocityY = 0; // Stop falling when hitting bottom boundary
    }

    // Update character's style to reflect new position
    character.style.bottom = `${this.positionY}px`;

    // Call move method again on the next frame
    requestAnimationFrame(() => this.move());
  }

  // Method to handle jumping
  jump() {
    // Check if the game has started
    if (gameStarted) {
      // Set upward velocity for jump
      this.velocityY = -this.jumpStrength;

      // Allow jumping even if the player is already jumping
      this.isJumping = true;
    } else {
      // If game has not started, start the game
      startGame();
      gameStarted = true;
    }
  }
}

// Function to start the game
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    // Hide starting menu
    startingMenu.style.display = "none";
    // Show game window
    gameWindow.style.display = "block";
    //show Background
    background.style.display = "block";
    // Create a new player instance
    const player = new Player();
    // Make obstacles visible
    obstacleTop.style.display = "block";
    obstacleBottom.style.display = "block";

    // Event listener for keydown event to handle jumping
    window.addEventListener("keydown", function (event) {
      if (
        event.key === "ArrowUp" ||
        event.key === " " ||
        event.type === "touchstart"
      ) {
        player.jump();
      }
    });
    // Start the game loop
    player.move();
    // Position and move the obstacles
    positionObstacles();
  }
}

// Function to position the obstacles and make them move
function positionObstacles() {
  const gapHeight = 200; // Adjust the gap height as needed
  const windowHeight = gameWindow.offsetHeight;
  const windowWidth = gameWindow.offsetWidth;
  const bottomPosition = Math.floor(Math.random() * (windowHeight - gapHeight));

  // Set the initial positions of the obstacles
  obstacleTop.style.top = "0"; // Attach to the top of the game window
  obstacleTop.style.left = `${windowWidth}px`; // Initial position at the right edge of the game window
  obstacleTop.style.height = `${bottomPosition}px`; // Adjust height to create gap

  obstacleBottom.style.bottom = "0"; // Attach to the bottom of the game window
  obstacleBottom.style.left = `${windowWidth}px`; // Initial position at the right edge of the game window
  obstacleBottom.style.height = `${
    windowHeight - (bottomPosition + gapHeight)
  }px`; // Adjust height to fill remaining space

  // Define the speed at which obstacles move
  const obstacleSpeed = 2; // Adjust the speed as needed

  // Function to check collision between two elements
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

  // Modify moveObstacles function to check for collisions
  // Modify moveObstacles function to check for collisions
  function moveObstacles() {
    // Check for collision between player and obstacles
    if (
      isColliding(character, obstacleTop) ||
      isColliding(character, obstacleBottom)
    ) {
      // Collision detected, end the game
      endGame();
      return; // Exit the function to stop further movement
    }

    // Get the current positions of the obstacles
    let obstacleTopPosition = parseInt(obstacleTop.style.left);
    let obstacleBottomPosition = parseInt(obstacleBottom.style.left);

    // Move obstacles towards the left
    obstacleTopPosition -= obstacleSpeed;
    obstacleBottomPosition -= obstacleSpeed;

    // Check if obstacles have moved out of the game window
    if (obstacleTopPosition < -obstacleTop.offsetWidth) {
      // Set the position just outside the left edge of the game window
      obstacleTopPosition = windowWidth;
      obstacleBottomPosition = windowWidth;

      // Randomize the position for the next respawn
      const newBottomPosition = Math.floor(
        Math.random() * (windowHeight - gapHeight)
      );

      // Increment the score when obstacles are passed
      score++;
      scoreDisplay.textContent = `Score: ${score}`;

      // Update the positions of the obstacles
      obstacleTop.style.height = `${newBottomPosition}px`; // Adjust height to create gap
      obstacleBottom.style.height = `${
        windowHeight - (newBottomPosition + gapHeight)
      }px`; // Adjust height to fill remaining space
    }

    // Update the positions of the obstacles
    obstacleTop.style.left = `${obstacleTopPosition}px`;
    obstacleBottom.style.left = `${obstacleBottomPosition}px`;

    // Call the moveObstacles function again on the next frame
    requestAnimationFrame(moveObstacles);
  }

  // Start moving obstacles
  moveObstacles();
}

// Function to end the game
function endGame() {
  // Display end game screen
  endGameScreen.style.display = "block";
  // Display final score
  finalScoreDisplay.textContent = score;
  // Stop moving obstacles
  cancelAnimationFrame(moveObstacles);
}

// Function to restart the game
function restartGame() {
  // Reset score
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  // Hide end game screen
  endGameScreen.style.display = "none";
  // Reset player position
  character.style.bottom = "0px";
  // Reset obstacle positions
  positionObstacles();
  // Show main menu
  displayMainMenu();
  // Reset gameStarted flag
  gameStarted = false;
}

// Event listener for the restart button
restartButton.addEventListener("click", restartGame);
