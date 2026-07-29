function startGame() {
  if (gameRunning) return;

  gameRunning = true;

  spawnInterval = setInterval(createBalloon, SPAWN_INTERVAL);
}

function resetGame() {
  clearInterval(spawnInterval);

  // Reset score
  score = 0;

  // Reset energy
  energy = MAX_ENERGY;

  // Update UI
  updateScore();
  updateEnergy();

  // Remove old balloons
  balloonContainer.innerHTML = "";

  // Hide game over screen
  gameOverScreen.classList.add("hidden");

  // Start fresh
  startGame();
}


