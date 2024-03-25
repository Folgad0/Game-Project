// Define variables for game elements
const startingMenu = document.getElementById("starting-menu");
const platformLevel = document.getElementById("platform-level");
const gameWindow = document.getElementById("game-window");
const character = document.getElementById("character");
const obstacleTop = document.getElementById("obstacle-top");
const obstacleBottom = document.getElementById("obstacle-bottom");

// Define Player class
class Player {
  constructor() {
    // Initialize player's properties
    this.positionY = 0; // Initial Y position
    this.directionY = 0; // Vertical direction (1 for jump)
    this.speed = 5; // Movement speed
    this.gravity = 0.2; // Gravity strength
    this.jumpStrength = 5; // Jump strength
    this.isJumping = false; // Flag to indicate if the player is jumping
  }

  // Method to move the player
  move() {
    // Apply gravity
    this.directionY -= this.gravity;

    // Apply jump if the player is jumping
    if (this.isJumping) {
      this.directionY = this.jumpStrength;
      this.isJumping = false;
    }

    // Update player's position
    this.positionY -= this.directionY;

    // Ensure player stays within game window bounds
    if (this.positionY < 0) {
      this.positionY = 0;
    } else if (
      this.positionY >
      gameWindow.offsetHeight - character.offsetHeight
    ) {
      this.positionY = gameWindow.offsetHeight - character.offsetHeight;
    }

    // Update character's style to reflect new position
    character.style.bottom = `${this.positionY}px`;

    // Call move method again on the next frame
    requestAnimationFrame(() => this.move());
  }

  // Method to handle jumping
  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
    }
  }
}

// Function to start the game
function startGame() {
  startingMenu.style.display = "none"; // Hide starting menu
  platformLevel.style.display = "block"; // Show platform level

  // Create a new player instance
  const player = new Player();

  // Make obstacles visible
  obstacleTop.style.display = "block";
  obstacleBottom.style.display = "block";

  // Event listener for keydown event to handle jumping
  window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" || event.key === " ") {
      player.jump();
    }
  });

  // Start the game loop
  player.move();

  // Position and move the obstacles
  positionObstacles();
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

  // Function to move obstacles
  function moveObstacles() {
    // Get the current positions of the obstacles
    let obstacleTopPosition = parseInt(obstacleTop.style.left);
    let obstacleBottomPosition = parseInt(obstacleBottom.style.left);

    // Move obstacles towards the left
    obstacleTopPosition -= obstacleSpeed;
    obstacleBottomPosition -= obstacleSpeed;

    // Check if obstacles have moved out of the game window
    if (obstacleTopPosition < -obstacleTop.offsetWidth) {
      // Randomize the position for the next respawn
      const newBottomPosition = Math.floor(
        Math.random() * (windowHeight - gapHeight)
      );

      // Reset obstacle positions when they move out of the screen
      obstacleTopPosition = windowWidth;
      obstacleBottomPosition = windowWidth;

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
// Function to return to the main menu
function returnToMainMenu() {
  platformLevel.style.display = "none"; // Hide platform level
  startingMenu.style.display = "block"; // Show starting menu
}
