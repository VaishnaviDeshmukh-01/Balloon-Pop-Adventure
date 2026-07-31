function updateScore() {
  if (scoreValueEl) {
    scoreValueEl.textContent = Math.floor(score).toLocaleString();
  }

  // Update Best score
  if (Math.floor(score) > bestScore) {
    bestScore = Math.floor(score);
    localStorage.setItem("bestScore", bestScore);
  }

  if (bestScoreEl) {
    bestScoreEl.textContent = "Best : " + bestScore.toLocaleString();
  }
}

function updateCoins() {
  if (coinValue) {
    coinValue.textContent = coins;
  }
}

function updateEnergy() {
  if (energy < 0) energy = 0;
  if (energy > MAX_ENERGY) energy = MAX_ENERGY;

  if (energyFill) {
    energyFill.style.width = energy + "%";
  }

  if (energyText) {
    energyText.textContent = energy + " / " + MAX_ENERGY;
  }

  // Color change when low
  if (energyFill) {
    if (energy > 50) {
      energyFill.style.background =
        "linear-gradient(90deg, #FF6B6B 0%, #FF1744 45%, #D50000 100%)";
    } else if (energy > 20) {
      energyFill.style.background =
        "linear-gradient(90deg, #FFC107 0%, #FF9800 100%)";
    } else {
      energyFill.style.background =
        "linear-gradient(90deg, #F44336 0%, #B71C1C 100%)";
    }
  }

  if (energy === 0) {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;
  clearInterval(spawnInterval);
  balloonContainer.innerHTML = "";

  finalScore.textContent = Math.floor(score).toLocaleString();
  gameOverScreen.classList.remove("hidden");

  stopGameMusic();
  playSound(document.getElementById("game-over-sound"));
}