function createBalloon() {
  const balloon = document.createElement("img");

  const randomBalloon =
    balloonImages[Math.floor(Math.random() * balloonImages.length)];

  balloon.src = randomBalloon;

  balloon.classList.add("balloon");

  const balloonWidth = 80;
  const maxX = gameBoard.clientWidth - balloonWidth;

  const startX = Math.random() * maxX;
  
  balloon.style.left = `${startX}px`;
  
  let y = 0;
  balloon.style.bottom = y + "px";

  balloonContainer.appendChild(balloon);

  
  function animate() {
    if (!balloon.isConnected || !gameRunning) return;

    y += balloonSpeed;

    balloon.style.bottom = `${y}px`;

    const dangerPosition = gameBoard.clientHeight * 0.75;

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
    score += 10;

    updateScore();

    balloon.classList.add("pop");

    setTimeout(() => {
      balloon.remove();
    }, 200);
  });
}
