function createBalloon() {
  if (!gameRunning || gamePaused || !balloonContainer) return;

  const balloon = document.createElement("img");
  const randomBalloon =
    balloonImages[Math.floor(Math.random() * balloonImages.length)];

  balloon.src = randomBalloon;
  balloon.classList.add("balloon");
  balloon.draggable = false;

  const maxX = Math.max(0, gameBoard.clientWidth - BALLOON_WIDTH);
  const startX = Math.random() * maxX;

  balloon.style.left = startX + "px";

  let y = 0;
  balloon.style.bottom = y + "px";

  balloonContainer.appendChild(balloon);

  // Danger line is at top: 28% → balloon crosses when bottom reaches ~72% of height
  const dangerPosition = gameBoard.clientHeight * 0.72;

  function animate() {
    if (!balloon.isConnected || !gameRunning) return;
    if (gamePaused) {
      requestAnimationFrame(animate);
      return;
    }

    y += balloonSpeed;
    balloon.style.bottom = y + "px";

    if (y >= dangerPosition) {
      energy -= ENERGY_LOSS;
      updateEnergy();
      balloon.remove();
      return;
    }

    requestAnimationFrame(animate);
  }

  animate();

  balloon.addEventListener("click", () => {
    // Block popping while paused
    if (!gameRunning || gamePaused) return;

    score += 10;
    updateScore();

    playSound(document.getElementById("pop-sound"));

    balloon.classList.add("pop");
    setTimeout(() => {
      balloon.remove();
    }, 200);
  });
}