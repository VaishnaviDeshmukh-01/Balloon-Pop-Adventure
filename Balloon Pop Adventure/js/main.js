// Auto-start the game when the page loads
window.addEventListener("DOMContentLoaded", () => {
  updateScore();
  updateEnergy();
  startGame();
});

// Play Again button
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    resetGame();
  });
}

// Return Home button
const homeBtn = document.getElementById("home-btn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    setTimeout(() => {
      window.location.href = "index.html";
    }, 150);
  });
}

// Pause / Resume button
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    pauseGame();
  });
}

resumeBtn.addEventListener("click", () => {
  playSound(document.getElementById("click-sound"));
  resumeGame();
});
closePause.addEventListener("click", () => {
  playSound(document.getElementById("click-sound"));
  resumeGame();
});

if (restartPauseBtn) {
  restartPauseBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    pauseOverlay.classList.add("hidden");
    gamePaused = false;
    resetGame();
  });
}

homePauseBtn.addEventListener("click", () => {

    playSound(document.getElementById("click-sound"));

    window.location.href = "index.html"; 

});