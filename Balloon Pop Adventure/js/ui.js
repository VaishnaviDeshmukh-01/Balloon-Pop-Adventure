function updateScore() {
  scoreElement.textContent = score;

  
  scoreBox.classList.add("pop");

  setTimeout(() => {
    scoreBox.classList.remove("pop");
  }, 150);
}



function updateEnergy() {
  if (energy < 0) {
    energy = 0;
  }

  energyFill.style.width = energy + "%";

  if (energy > 50) {
    energyFill.style.background = "linear-gradient(90deg, #4CAF50, #8BC34A)";
  } else if (energy > 20) {
    energyFill.style.background = "linear-gradient(90deg, #FFC107, #FFD54F)";
  } else {
    energyFill.style.background = "linear-gradient(90deg, #F44336, #FF7961)";
  }

  if (energy === 0) {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;

  clearInterval(spawnInterval);

  balloonContainer.innerHTML = "";

  finalScore.textContent = score;

  gameOverScreen.classList.remove("hidden");
}