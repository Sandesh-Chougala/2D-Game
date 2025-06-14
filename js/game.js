const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frameId;
const gravity = 0.6;
const jumpPower = -12;
let keys = {};

let player = {
  x: 50,
  y: 350,
  width: 30,
  height: 30,
  color: "#00ffcc",
  dx: 0,
  dy: 0,
  speed: 4,
  grounded: false
};

let score = 0;
let obstacleSpeed = 4;
let obstacleSpawnInterval = 1500; // milliseconds
let obstacles = [];

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = "#ff3b3b";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function handleInput() {
  player.dx = 0;

  if (keys["ArrowLeft"]) {
    player.dx = -player.speed;
  }
  if (keys["ArrowRight"]) {
    player.dx = player.speed;
  }

  if ((keys["Space"] || keys["ArrowUp"]) && player.grounded) {
    player.dy = jumpPower;
    player.grounded = false;
  }
}

function updateObstacles(deltaTime) {
  obstacles.forEach(obs => {
    obs.x -= obstacleSpeed;
  });

  // Remove obstacles that moved off screen
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
}

function spawnObstacle() {
  // Random height between 20 and 60
  const height = 20 + Math.random() * 40;
  const obs = {
    x: canvas.width,
    y: canvas.height - height,
    width: 20 + Math.random() * 30,
    height: height
  };
  obstacles.push(obs);
}

// Simple AABB collision detection
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

let lastObstacleSpawn = 0;
let lastTime = 0;

function gameLoop(timestamp = 0) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleInput();

  // Player physics and movement
  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // Prevent player going outside left boundary
  if (player.x < 0) player.x = 0;
  // Game over if player hits right boundary
  if (player.x + player.width >= canvas.width) {
    endGame();
    return;
  }

  // Spawn obstacles on interval
  if (timestamp - lastObstacleSpawn > obstacleSpawnInterval) {
    spawnObstacle();
    lastObstacleSpawn = timestamp;

    // Increase difficulty by reducing spawn interval and increasing speed
    if (obstacleSpawnInterval > 600) obstacleSpawnInterval -= 20;
    obstacleSpeed += 0.05;
  }

  updateObstacles(deltaTime);

  // Draw player and obstacles
  drawPlayer();
  drawObstacles();

  // Check collisions
  for (const obs of obstacles) {
    if (isColliding(player, obs)) {
      endGame();
      return;
    }
  }

  // Update score
  score++;
  document.getElementById("scoreDisplay").innerText = `Score: ${score}`;

  frameId = requestAnimationFrame(gameLoop);
}

function endGame() {
  cancelAnimationFrame(frameId);
  alert(`Game Over!\nFinal Score: ${score}`);
  setTimeout(() => {
    saveScore(score);
  }, 500);
}

function saveScore(finalScore) {
  const playerName = localStorage.getItem("playerName");
  if (!playerName) {
    window.location.href = "menu.html";
    return;
  }

  const playersRef = db.ref("players");

  playersRef.once("value", snapshot => {
    let found = false;

    snapshot.forEach(child => {
      const data = child.val();
      if (data.name === playerName) {
        found = true;
        if (finalScore > data.score) {
          child.ref.update({ score: finalScore });
        }
      }
    });

    if (!found) {
      playersRef.push({
        name: playerName,
        score: finalScore
      });
    }

    window.location.href = "menu.html";
  });
}

// Keyboard input listeners
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// Mobile touch controls
document.getElementById("leftBtn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  keys["ArrowLeft"] = true;
});
document.getElementById("leftBtn").addEventListener("touchend", (e) => {
  e.preventDefault();
  keys["ArrowLeft"] = false;
});

document.getElementById("rightBtn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  keys["ArrowRight"] = true;
});
document.getElementById("rightBtn").addEventListener("touchend", (e) => {
  e.preventDefault();
  keys["ArrowRight"] = false;
});

document.getElementById("jumpBtn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  keys["Space"] = true;
});
document.getElementById("jumpBtn").addEventListener("touchend", (e) => {
  e.preventDefault();
  keys["Space"] = false;
});

// Start the game loop
requestAnimationFrame(gameLoop);
