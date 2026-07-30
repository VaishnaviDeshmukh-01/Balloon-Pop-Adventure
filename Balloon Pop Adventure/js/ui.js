function updateScore() {
  if (coinValue) {
    coinValue.textContent = score;
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

  // Optional color shift when low
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
  gamePaused = false;

  if (spawnInterval) {
    clearInterval(spawnInterval);
    spawnInterval = null;
  }

  if (balloonContainer) {
    balloonContainer.innerHTML = "";
  }

  if (finalScore) {
    finalScore.textContent = score;
  }

  if (gameOverScreen) {
    gameOverScreen.classList.remove("hidden");
  }
}