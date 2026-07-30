function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  startGameMusic();                    // ← add this
  spawnInterval = setInterval(createBalloon, SPAWN_INTERVAL);
}

function resetGame() {
  clearInterval(spawnInterval);

  score = 0;
  energy = MAX_ENERGY;

  updateScore();
  updateEnergy();

  balloonContainer.innerHTML = "";
  gameOverScreen.classList.add("hidden");

  startGame();   // this will also restart music
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

