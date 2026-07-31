function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  lastTime = 0;
  startGameMusic();
  spawnInterval = setInterval(createBalloon, SPAWN_INTERVAL);

  // Start continuous score
  requestAnimationFrame(updateScoreByTime);
}

function resetGame() {

    clearInterval(spawnInterval);

    gameRunning = false;

    gamePaused = false;

    balloonContainer.innerHTML="";

    gameOverScreen.classList.add("hidden");

    score = 0;
    coins = 0;
    energy = MAX_ENERGY;

    updateScore();
    updateCoins();
    updateEnergy();

    startGame();

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
    lastTime = 0; // prevent big jump when resuming
  }
}

// Continuous score with acceleration
function updateScoreByTime(timestamp) {
  if (!gameRunning) return;

  if (gamePaused) {
    lastTime = timestamp;
    requestAnimationFrame(updateScoreByTime);
    return;
  }

  if (lastTime === 0) lastTime = timestamp;

  const delta = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;

  // Accelerating score (like Subway Surfers)
  const speedIncrease = Math.floor(score / 1000) * 5;
  score += (baseSpeed + speedIncrease) * delta;

  updateScore();

  requestAnimationFrame(updateScoreByTime);
}