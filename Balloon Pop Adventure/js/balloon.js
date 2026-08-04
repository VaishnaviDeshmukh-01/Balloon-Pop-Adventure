function createBalloon() {
  if (!gameRunning || gamePaused || !balloonContainer) return;

  const balloon = document.createElement("img");
  balloon.classList.add("balloon");
  balloon.draggable = false;

  let type = "normal";
  let special = null;

  // Decide if this balloon is special
  if (Math.random() < SPECIAL_CHANCE) {
    const types = Object.keys(specialBalloons);
    const totalWeight = types.reduce((sum, t) => sum + specialBalloons[t].weight, 0);
    let r = Math.random() * totalWeight;

    for (const t of types) {
      r -= specialBalloons[t].weight;
      if (r <= 0) {
        type = t;
        special = specialBalloons[t];
        break;
      }
    }

    balloon.src = special.image;
    balloon.dataset.type = type;
    balloon.classList.add(`special-${type}`);
  } else {
    const randomBalloon = balloonImages[Math.floor(Math.random() * balloonImages.length)];
    balloon.src = randomBalloon;
    balloon.dataset.type = "normal";
  }

  const maxX = Math.max(0, gameBoard.clientWidth - BALLOON_WIDTH);
  const startX = Math.random() * maxX;

  balloon.style.left = startX + "px";

  let y = 0;
  balloon.style.bottom = y + "px";

  balloonContainer.appendChild(balloon);

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
      if (special && special.onDanger) {
        special.onDanger();
      } else {
        energy -= ENERGY_LOSS;
      }
      updateEnergy();
      balloon.remove();
      return;
    }

    requestAnimationFrame(animate);
  }

  animate();

  balloon.addEventListener("click", () => {
    if (!gameRunning || gamePaused) return;

    if (special && special.onPop) {
      special.onPop();
    } else {
      // Normal balloon
      score += 10 * scoreMultiplier;
      coins += COINS_PER_POP;
      updateScore();
      updateCoins();
    }

    playSound(document.getElementById("pop-sound"));

    balloon.classList.add("pop");
    setTimeout(() => {
      balloon.remove();
    }, 200);
  });
}

// Floating text when special balloons are popped
function showFloatingText(text, color = "#fff") {
  const el = document.createElement("div");
  el.className = "floating-text";
  el.textContent = text;
  el.style.color = color;

  // Random position near center
  el.style.left = 40 + Math.random() * 20 + "%";
  el.style.top = 35 + Math.random() * 20 + "%";

  document.body.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 1200);
}