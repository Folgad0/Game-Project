// Function to start the game
function startGame() {
  document.getElementById("starting-menu").style.display = "none"; // Hide starting menu
  document.getElementById("platform-level").style.display = "block"; // Show platform level
  document.getElementById("return-to-main-menu").style.display = "block"; // Show return button
  // Call function to initialize platform level (to be implemented)
}

// Function to handle end of platform level
function endPlatformLevel() {
  document.getElementById("platform-level").style.display = "none"; // Hide platform level
  document.getElementById("end-level").style.display = "block"; // Show end level
  document.getElementById("return-to-main-menu").style.display = "none"; // Hide return button
  // Call function to initialize end level (to be implemented)
}

// Function to return to main menu
function returnToMainMenu() {
  document.getElementById("end-level").style.display = "none"; // Hide end level
  document.getElementById("platform-level").style.display = "none"; // Hide platform level
  document.getElementById("starting-menu").style.display = "block"; // Show starting menu
  document.getElementById("return-to-main-menu").style.display = "none"; // Hide return button on main menu
}

// Function to handle end of game
function endGame() {
  // Your end game logic goes here
}

// Event listeners or additional functions can be added as needed

// Store references to the character element and platform level container
const character = document.getElementById("character");
const platformLevel = document.getElementById("platform-level");

// Set initial character position and movement properties
let characterX = 0;
let characterY = 20;
const characterSpeed = 10;
const jumpStrength = 15; // Adjust jump strength as needed
let isJumping = false;

// Function to handle character movement
function moveCharacter(direction) {
  if (direction === "left") {
    characterX -= characterSpeed; // Move character left
  } else if (direction === "right") {
    characterX += characterSpeed; // Move character right
  }

  // Update character's CSS left property to move it horizontally
  character.style.left = characterX + "px";
}

// Function to check collision between two elements
function isColliding(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

// Function to handle character jump
function jump() {
  console.log("Jump function called");

  if (!isJumping) {
    isJumping = true;
    let jumpInterval = setInterval(function () {
      console.log("Jumping...");
      console.log("CharacterY:", characterY);
      if (characterY >= 150 || isColliding(character, platformLevel)) {
        // Adjust the maximum jump height as needed
        clearInterval(jumpInterval);
        // Descend after reaching the peak of the jump
        descend();
      } else {
        characterY += jumpStrength;
        character.style.bottom = characterY + "px";
      }
    }, 20);
  }
}
// Function to handle character descend after jump
function descend() {
  let descendInterval = setInterval(function () {
    if (characterY <= 0) {
      clearInterval(descendInterval);
      isJumping = false; // Reset jump status
    } else {
      characterY -= jumpStrength;
      character.style.bottom = characterY + "px";
    }
  }, 20);
}

// Event listener for character movement
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    moveCharacter("left");
  } else if (event.key === "ArrowRight") {
    moveCharacter("right");
  } else if (event.key === "ArrowUp") {
    jump();
  }
});

// Set initial character position on the first platform
//characterY = 20; // Adjust the initial character Y position according to the platform's height
character.style.bottom = characterY + "px";
