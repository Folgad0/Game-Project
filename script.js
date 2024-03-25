// Define variables for game elements
const startingMenu = document.getElementById("starting-menu");
const platformLevel = document.getElementById("platform-level");
const endLevel = document.getElementById("end-level");
const gameWindow = document.getElementById("game-window");
const character = document.getElementById("character");

// Function to start the game
function startGame() {
  startingMenu.style.display = "none"; // Hide starting menu
  platformLevel.style.display = "block"; // Show platform level
  document.getElementById("return-to-main-menu").style.display = "block"; // Show "Return to Main Menu" button
}

// Function to return to the main menu
function returnToMainMenu() {
  platformLevel.style.display = "none"; // Hide platform level
  endLevel.innerHTML = ""; // Clear end level content
  startingMenu.style.display = "block"; // Show starting menu
}

// Player class definition
class Player {
  constructor() {
    // Initialize player's properties
    this.directionX = 0;
    this.directionY = 0;
    this.speed = 5;

    // Get the width and height of the game window and character
    const gameWindowWidth = gameWindow.offsetWidth;
    const gameWindowHeight = gameWindow.offsetHeight;
    const characterWidth = character.offsetWidth;
    const characterHeight = character.offsetHeight;

    // Calculate initial position to center the player within the game window
    this.positionX = (gameWindowWidth - characterWidth) / 2;
    this.positionY = (gameWindowHeight - characterHeight) / 2;

    // Set initial position of the character
    character.style.left = `${this.positionX}px`;
    character.style.bottom = `${this.positionY}px`;
  }

  move() {
    // Update player's position based on direction and speed
    this.positionX += this.directionX * this.speed;
    this.positionY += this.directionY * this.speed;

    // Calculate the maximum X and Y coordinates allowed for the player
    const maxX = gameWindow.offsetWidth - character.offsetWidth;
    const maxY = gameWindow.offsetHeight - character.offsetHeight;

    // Restrict player's movement within the bounds of the game window
    this.positionX = Math.max(0, Math.min(this.positionX, maxX));
    this.positionY = Math.max(0, Math.min(this.positionY, maxY));

    // Update character's style to reflect new position
    character.style.left = `${this.positionX}px`;
    character.style.bottom = `${this.positionY}px`;
  }

  // Method to handle keydown events
  handleKeydown(event) {
    const key = event.key;

    // Update player's direction based on pressed key
    switch (key) {
      case "ArrowLeft":
        this.directionX = -1;
        break;
      case "ArrowRight":
        this.directionX = 1;
        break;
      case "ArrowUp":
        this.directionY = 1;
        break;
      case "ArrowDown":
        this.directionY = -1;
        break;
    }
  }

  // Method to handle keyup events
  handleKeyup(event) {
    const key = event.key;

    // Reset player's direction when key is released
    switch (key) {
      case "ArrowLeft":
      case "ArrowRight":
        this.directionX = 0;
        break;
      case "ArrowUp":
      case "ArrowDown":
        this.directionY = 0;
        break;
    }
  }
}

// Create a new instance of the Player class
const player = new Player();

// Add event listeners for keydown and keyup events
window.addEventListener("keydown", (event) => player.handleKeydown(event));
window.addEventListener("keyup", (event) => player.handleKeyup(event));

// Function to update game state
function updateGame() {
  // Move the player
  player.move();

  // Request next frame update
  requestAnimationFrame(updateGame);
}

// Start the game loop
updateGame();
