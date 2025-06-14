window.onload = function () {
  const savedName = localStorage.getItem("playerName");

  if (savedName) {
    // Redirect to menu if already saved
    window.location.href = "menu.html";
  }
};

function submitName() {
  const name = document.getElementById("playerName").value.trim();

  if (name.length < 1) {
    alert("Please enter your name.");
    return;
  }

  localStorage.setItem("playerName", name);

  const userRef = db.ref("players").push(); // ✅ FIXED: using 'db'

  userRef.set({
    name: name,
    score: 0
  }).then(() => {
    console.log("Player saved to Firebase successfully!");
    window.location.href = "menu.html";
  }).catch((error) => {
    console.error("Failed to save to Firebase:", error);
    alert("Error saving name. See console.");
  });
}
