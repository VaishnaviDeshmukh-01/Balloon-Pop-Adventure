// Pause button
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    pauseGame();
  });
}

// Restart / Play Again
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    resetGame();
  });
}

// Optional: + button (refill a bit of energy for now)
if (plusBtn) {
  plusBtn.addEventListener("click", () => {
    if (!gameRunning || energy >= MAX_ENERGY) return;
    energy = Math.min(MAX_ENERGY, energy + 20);
    updateEnergy();
  });
}

// Initial UI
updateScore();
updateEnergy();

// Auto-start when page loads
startGame();