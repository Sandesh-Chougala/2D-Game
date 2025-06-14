window.onload = function () {
  const leaderboardRef = db.ref("players").orderByChild("score").limitToLast(5);

  leaderboardRef.once("value", (snapshot) => {
    const scores = [];
    snapshot.forEach(child => {
      scores.push(child.val());
    });

    scores.reverse(); // Highest score first

    const list = document.getElementById("leaderboard");
    scores.forEach((player, index) => {
      const li = document.createElement("li");
      li.innerHTML = `${index + 1}. <strong>${player.name}</strong> — ${player.score}`;
      list.appendChild(li);
    });
  });
};
