function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gamePaused = false;

  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(createBalloon, SPAWN_INTERVAL);
}

function pauseGame() {
  if (!gameRunning) return;

  gamePaused = !gamePaused;

  if (gamePaused) {
    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
    if (pauseBtn) pauseBtn.title = "Resume";
  } else {
    spawnInterval = setInterval(createBalloon, SPAWN_INTERVAL);
    if (pauseBtn) pauseBtn.title = "Pause";
  }
}

function resetGame() {
  if (spawnInterval) {
    clearInterval(spawnInterval);
    spawnInterval = null;
  }

  score = 0;
  energy = MAX_ENERGY;
  gameRunning = false;
  gamePaused = false;

  updateScore();
  updateEnergy();

  if (balloonContainer) {
    balloonContainer.innerHTML = "";
  }

  if (gameOverScreen) {
    gameOverScreen.classList.add("hidden");
  }

  if (pauseBtn) pauseBtn.title = "Pause";

  startGame();
}