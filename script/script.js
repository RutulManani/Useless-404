// Maze game variables
let playerX = 15;
let playerY = 15;
let score = 0;
const coins = [];
const messages = [
    "Watch out for walls!",
    "Collect all the coins!",
    "The exit is blinking orange!",
    "Arrow keys to move!",
    "You got this!",
    "404 fun is better than no fun!"
];

// Simplified maze walls - now with more playful design
const walls = [
    // Horizontal walls
    { left: 30, top: 50, width: 100, height: 10 },
    { left: 150, top: 100, width: 120, height: 10 },
    { left: 30, top: 150, width: 100, height: 10 },
    { left: 170, top: 200, width: 100, height: 10 },
    { left: 50, top: 250, width: 100, height: 10 },

    // Vertical walls
    { left: 100, top: 50, width: 10, height: 100 },
    { left: 200, top: 100, width: 10, height: 100 },
    { left: 50, top: 150, width: 10, height: 100 },
    { left: 150, top: 50, width: 10, height: 100 }
];

// Coin positions
const coinPositions = [
    { x: 50, y: 80 },
    { x: 180, y: 130 },
    { x: 80, y: 180 },
    { x: 220, y: 230 },
    { x: 120, y: 280 }
];

// Maze game
function showMaze() {
    document.getElementById('maze-game').classList.remove('hidden');
    document.getElementById('runaway-btn-container').classList.add('hidden');
    document.getElementById('redirect-container').classList.add('hidden');

    // Reset game state
    playerX = 15;
    playerY = 15;
    score = 0;
    updateScore();

    // Create maze
    const mazeContainer = document.querySelector('.maze-container');
    mazeContainer.innerHTML = '<div id="player"></div><div id="exit"></div>';

    // Add walls
    walls.forEach(wall => {
        const wallElement = document.createElement('div');
        wallElement.className = 'wall';
        wallElement.style.left = wall.left + 'px';
        wallElement.style.top = wall.top + 'px';
        wallElement.style.width = wall.width + 'px';
        wallElement.style.height = wall.height + 'px';
        mazeContainer.appendChild(wallElement);
    });

    // Add coins
    coinPositions.forEach(coin => {
        const coinElement = document.createElement('div');
        coinElement.className = 'coin';
        coinElement.style.left = coin.x + 'px';
        coinElement.style.top = coin.y + 'px';
        coinElement.id = 'coin-' + coin.x + '-' + coin.y;
        mazeContainer.appendChild(coinElement);
        coins.push({ x: coin.x, y: coin.y, element: coinElement });
    });

    // Position player
    const player = document.getElementById('player');
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    // Show random message
    document.getElementById('maze-message').textContent =
        messages[Math.floor(Math.random() * messages.length)];

    // Player movement
    document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
    const moveAmount = 10;
    let newX = playerX;
    let newY = playerY;

    switch (e.key) {
        case 'ArrowUp': newY -= moveAmount; break;
        case 'ArrowDown': newY += moveAmount; break;
        case 'ArrowLeft': newX -= moveAmount; break;
        case 'ArrowRight': newX += moveAmount; break;
        default: return; // Ignore other keys
    }

    // Check wall collisions
    const hitWall = walls.some(wall => {
        return newX < wall.left + wall.width &&
            newX + 20 > wall.left &&
            newY < wall.top + wall.height &&
            newY + 20 > wall.top;
    });

    // Check bounds (with 5px buffer for walls)
    if (!hitWall && newX >= 5 && newX <= 275 && newY >= 5 && newY <= 275) {
        playerX = newX;
        playerY = newY;
        const player = document.getElementById('player');
        player.style.left = playerX + 'px';
        player.style.top = playerY + 'px';

        // Check coin collection
        checkCoins();

        // Check if reached exit (need all coins first)
        if (Math.abs(playerX - 265) < 20 && Math.abs(playerY - 265) < 20) {
            if (score >= coinPositions.length) {
                document.getElementById('maze-message').textContent = "You escaped! Well done!";
                setTimeout(() => {
                    alert('Congratulations! You escaped the 404 maze!');
                }, 500);
            } else {
                document.getElementById('maze-message').textContent =
                    "Collect all the coins first! (" + (coinPositions.length - score) + " left)";
            }
        }
    }
}

function checkCoins() {
    coins.forEach((coin, index) => {
        if (coin && Math.abs(playerX - coin.x) < 15 && Math.abs(playerY - coin.y) < 15) {
            // Collect coin
            coin.element.remove();
            coins[index] = null;
            score++;
            updateScore();

            // Playful message
            if (score === coinPositions.length) {
                document.getElementById('maze-message').textContent =
                    "All coins collected! Now find the exit!";
            }
        }
    });
}

function updateScore() {
    document.getElementById('score').textContent = "Coins: " + score + "/" + coinPositions.length;
}

// Runaway button
function showRunawayButton() {
    document.getElementById('maze-game').classList.add('hidden');
    document.getElementById('runaway-btn-container').classList.remove('hidden');
    document.getElementById('redirect-container').classList.add('hidden');
    document.removeEventListener('keydown', handleKeyDown);
}

function moveButton(btn) {
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    btn.style.position = 'absolute';
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';

    // Change button text randomly
    const messages = [
        "Nope!",
        "Try harder!",
        "Not today!",
        "Missed me!",
        "Too slow!",
        "Hahaha!",
        "Nuh-uh!"
    ];
    btn.textContent = messages[Math.floor(Math.random() * messages.length)];
}

// Fake redirect
function showRedirect() {
    document.getElementById('maze-game').classList.add('hidden');
    document.getElementById('runaway-btn-container').classList.add('hidden');
    document.getElementById('redirect-container').classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyDown);

    const messages = [
        "Attempting to reconnect...",
        "Recalculating route...",
        "Asking the internet for help...",
        "Consulting the manual...",
        "Looking under the couch...",
        "Asking a coworker... who ignores you..."
    ];

    let progress = 0;
    const progressBar = document.getElementById('progress');
    const messageElement = document.getElementById('redirect-message');

    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            messageElement.textContent = "Just kidding! This is a 404 page!";
            setTimeout(() => {
                progressBar.style.width = '0%';
                showRedirect(); // Restart
            }, 2000);
        } else {
            progressBar.style.width = progress + '%';
            if (progress % 20 < 5) { // Change message occasionally
                messageElement.textContent = messages[Math.floor(Math.random() * messages.length)];
            }
        }
    }, 200);
}