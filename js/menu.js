window.onload = function () {
  const playerName = localStorage.getItem("playerName");

  if (!playerName) {
    // If no player name in localStorage, redirect to index page to ask name
    window.location.href = "index.html";
    return;
  }

  // Display the saved player name in the welcome message
  document.getElementById("playerNameDisplay").innerText = playerName;
};

function startGame() {
  // Redirect to the game page when Start Game button clicked
  window.location.href = "game.html";
}
