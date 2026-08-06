function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gameStartTime = Date.now();
  lastTime = 0;

  // Apply permanent energy upgrade
  MAX_ENERGY = 100 + (upgradeLevels.extraEnergy || 0) * 20;
  energy = MAX_ENERGY;

  startGameMusic();
  spawnInterval = setInterval(createBalloon, SPAWN_INTERVAL);
  requestAnimationFrame(updateScoreByTime);
  updateEnergy();
  updateCoins();
}

function resetGame() {
  clearInterval(spawnInterval);
  gameRunning = false;
  gamePaused = false;
  gameStartTime = Date.now();
  balloonContainer.innerHTML = "";
  gameOverScreen.classList.add("hidden");

  score = 0;
  coins = 0;

  MAX_ENERGY = 100 + (upgradeLevels.extraEnergy || 0) * 20;
  energy = MAX_ENERGY;

  updateScore();
  updateCoins();
  updateEnergy();
  startGame();
}

function pauseGame() {
  if (!gameRunning || gamePaused) return;
  gamePaused = true;
  pauseOverlay.classList.remove("hidden");

  document.getElementById("pause-score").textContent = Math.floor(score);
  document.getElementById("pause-best").textContent = Math.floor(bestScore);
  document.getElementById("pause-coins").textContent = coins;
  document.getElementById("pause-time").textContent = getGameTime();

  clearInterval(spawnInterval);
}

function resumeGame() {
  if (!gamePaused) return;
  gamePaused = false;
  pauseOverlay.classList.add("hidden");
  spawnInterval = setInterval(createBalloon, SPAWN_INTERVAL);
}

function updateScoreByTime(timestamp) {
  if (!gameRunning) return;

  if (gamePaused) {
    lastTime = timestamp;
    requestAnimationFrame(updateScoreByTime);
    return;
  }

  if (lastTime === 0) lastTime = timestamp;

  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  const speedIncrease = Math.floor(score / 1000) * 5;
  score += (baseSpeed + speedIncrease) * delta * scoreMultiplier;

  updateScore();
  requestAnimationFrame(updateScoreByTime);
}

function getGameTime() {
  const elapsed = Math.floor((Date.now() - gameStartTime - pausedTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}