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

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function handleInput() {
  player.dx = 0;

  if (keys["ArrowLeft"]) {
    player.dx = -player.speed;
  }
  if (keys["ArrowRight"]) {
    player.dx = player.speed;
  }

  // Jump
  if ((keys["Space"] || keys["ArrowUp"]) && player.grounded) {
    player.dy = jumpPower;
    player.grounded = false;
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleInput();

  // Apply movement
  player.x += player.dx;
  player.dy += gravity;
  player.y += player.dy;

  // Floor collision
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // Wall collision - game over
  if (player.x + player.width >= canvas.width || player.x <= 0) {
    endGame();
    return;
  }

  drawPlayer();

  // Update score
  score++;
  document.getElementById("scoreDisplay").innerText = `Score: ${score}`;

  frameId = requestAnimationFrame(update);
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

// Start game loop
update();
