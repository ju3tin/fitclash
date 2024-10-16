const dino = document.getElementById('dino');
const jumpSound = document.getElementById('jump-sound');  // Get the audio element
let isRunning = false;
const gameContainer = document.querySelector('.game-container');
const scoreboard = document.getElementById('scoreboard');
const timerDisplay = document.getElementById('timer');
const livesDisplay = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const warningSign = document.getElementById('warning-sign');
let isJumping = false;
let score = 0;
let time = 0;
let lives = 3;
let isInvincible = false;
let gameInterval;
let obstacleInterval;
let timerInterval;
let powerupInterval;

// Add ground element to the game
const ground = document.createElement('div');
ground.classList.add('ground');
gameContainer.appendChild(ground);

function startRunning() {
    if (!isRunning) {
        console.log("Starting run animation"); // Debug log
        dino.style.animationName = 'none'; // Reset animation
        dino.offsetHeight; // Trigger reflow
        dino.style.animationName = 'run-animation'; // Start the actual animation
        dino.classList.add('running'); // Add running class
        isRunning = true;
    }
}

function stopRunning() {
    dino.classList.remove('running');
    isRunning = false;
}

startRunning();
// Function to make the dino jump
function jump() {
    if (isJumping) return;
    isJumping = true;
    stopRunning(); // Stop running animation during jump

    // Play the jump sound
    jumpSound.currentTime = 0;  // Reset to the beginning in case it was already playing
    jumpSound.play();
    let upInterval = setInterval(() => {
        if (dino.offsetTop <= 150) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (dino.offsetTop >= gameContainer.offsetHeight - dino.offsetHeight) {
                    clearInterval(downInterval);
                    isJumping = false;
                    startRunning(); // Call startRunning at the end of the jump
             
                } else {
                    dino.style.top = dino.offsetTop + 5 + 'px';
                }
            }, 20);
        } else {
            dino.style.top = dino.offsetTop - 5 + 'px';
        }
    }, 20);
}

// Function to create tokens at random positions
function createToken() {
    const token = document.createElement('div');
    token.classList.add('token');
    token.style.left = `${gameContainer.offsetWidth}px`;  // Start off-screen on the right
    token.style.top = `${Math.random() * (gameContainer.offsetHeight - 200)}px`;
    gameContainer.appendChild(token);

    // Move the token to the left to simulate the scrolling effect
    let tokenMoveInterval = setInterval(() => {
        token.style.left = `${token.offsetLeft - 5}px`;

        if (checkCollision(dino, token)) {
            const coinSound = document.getElementById('coin-sound');  // Get the audio element
            token.remove();
            score++;
            coinSound.currentTime = 0;  // Reset to the beginning in case it was already playing
            coinSound.play();
            updateScore();
            clearInterval(tokenMoveInterval);
        }

        // Remove token if it goes off-screen
        if (token.offsetLeft + token.offsetWidth < 0) {
            token.remove();
            clearInterval(tokenMoveInterval);
        }
    }, 20);
}

// Function to create obstacles at random intervals
function createObstacle() {
    const obstacle = document.createElement('div');
    const obstacleType = Math.floor(Math.random() * 3) + 1;

    obstacle.classList.add('obstacle', `obstacle-${obstacleType}`);
    obstacle.style.left = `${gameContainer.offsetWidth}px`;  // Start off-screen on the right

    // Only place obstacle-2 in the air
    if (obstacleType === 2) {
        obstacle.style.bottom = '150px'; // Adjust this value to control height
    } else {
        obstacle.style.bottom = '0';
    }

    gameContainer.appendChild(obstacle);

    // Move the obstacle to the left to simulate the scrolling effect
    let obstacleMoveInterval = setInterval(() => {
        obstacle.style.left = `${obstacle.offsetLeft - 5}px`;

        if (!isInvincible && checkCollision(dino, obstacle)) {
            obstacle.remove();
            clearInterval(obstacleMoveInterval);
            loseLife();
        }

        // Remove obstacle if it goes off-screen
        if (obstacle.offsetLeft + obstacle.offsetWidth < 0) {
            obstacle.remove();
            clearInterval(obstacleMoveInterval);
        }
    }, 20);
}

// Function to create power-ups at random intervals
function createPowerUp() {
    const powerup = document.createElement('div');
    powerup.classList.add('powerup');
    powerup.style.left = `${gameContainer.offsetWidth}px`;  // Start off-screen on the right
    powerup.style.top = `${Math.random() * (gameContainer.offsetHeight - 200)}px`;
    gameContainer.appendChild(powerup);

    // Move the power-up to the left to simulate the scrolling effect
    let powerupMoveInterval = setInterval(() => {
        powerup.style.left = `${powerup.offsetLeft - 5}px`;

        if (checkCollision(dino, powerup)) {
            powerup.remove();
            activatePowerUp();
            clearInterval(powerupMoveInterval);
        }

        // Remove power-up if it goes off-screen
        if (powerup.offsetLeft + powerup.offsetWidth < 0) {
            powerup.remove();
            clearInterval(powerupMoveInterval);
        }
    }, 20);
}

// Function to activate the power-up
function activatePowerUp() {
    isInvincible = true;
    dino.style.backgroundColor = '#ffeb3b';  // Change dino color to indicate invincibility
    const levelupwav = document.getElementById('levelup-sound');  // Get the audio element
    levelupwav.currentTime = 0;  // Reset to the beginning in case it was already playing
    levelupwav.play();
    setTimeout(() => {
        isInvincible = false;
        dino.style.backgroundColor = 'transparent';   // Revert dino color back to normal
    }, 20000);  // 20 seconds of invincibility
}

// Function to lose a life
function loseLife() {
    console.log(`Score for life ${4 - lives}: ${score}`);  // Log the score
    lives--;
    updateLives();
    showWarningSign(lives);

    if (lives <= 0) {
        const losingwav = document.getElementById('losing-sound');  // Get the audio element
        losingwav.currentTime = 0;  // Reset to the beginning in case it was already playing
        losingwav.play();
        endGame();
    }
}

// Function to update the score display
function updateScore() {
    scoreboard.textContent = `Score: ${score}`;
}

// Function to update the timer display
function updateTimer() {
    time++;
    timerDisplay.textContent = `Time: ${time}s`;
}

// Function to update the lives display
function updateLives() {
    livesDisplay.textContent = `Lives: ${lives}`;
}

// Function to check for collision between dino and another object (token, obstacle, or power-up)
function checkCollision(dino, object) {
    const dinoRect = dino.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    return !(
        dinoRect.top > objectRect.bottom ||
        dinoRect.bottom < objectRect.top ||
        dinoRect.right < objectRect.left ||
        dinoRect.left > objectRect.right
    );
}

// Function to show the warning sign
function showWarningSign(livesLeft) {
    warningSign.textContent = `Lives Left: ${livesLeft}`;
    warningSign.style.display = 'block';
    setTimeout(() => {
        warningSign.style.display = 'none';
    }, 2000);  // Show the warning sign for 2 seconds
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    clearInterval(timerInterval);
    clearInterval(powerupInterval);
    gameOverScreen.style.display = 'block';  // Show game over screen
}

// Function to restart the game
function restartGame() {
    score = 0;
    time = 0;
    lives = 3;
    isInvincible = false;
    updateScore();
    updateTimer();
    updateLives();
    gameOverScreen.style.display = 'none';  // Hide game over screen

    // Restart the game intervals
    gameInterval = setInterval(createToken, 2000);
    obstacleInterval = setInterval(createObstacle, 3000);
    powerupInterval = setInterval(createPowerUp, 10000);  // Power-up appears every 10 seconds
    timerInterval = setInterval(updateTimer, 1000);  // Update timer every second
}

// Initialize the game
updateScore();
updateTimer();
updateLives();
gameInterval = setInterval(createToken, 2000);
obstacleInterval = setInterval(createObstacle, 3000);
powerupInterval = setInterval(createPowerUp, 10000);  // Power-up appears every 10 seconds
timerInterval = setInterval(updateTimer, 1000);  // Update timer every second

// Event listener for jumping
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        jump();
    }
});