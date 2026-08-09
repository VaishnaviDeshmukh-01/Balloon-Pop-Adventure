function createBalloon() {
  if (!gameRunning || gamePaused || !balloonContainer) return;

  const balloon = document.createElement("img");
  balloon.classList.add("balloon");
  balloon.draggable = false;

  let type = "normal";
  let special = null;

  // Use dynamic special chance based on difficulty
  if (Math.random() < getCurrentSpecialChance()) {
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

  // Progressive speed + Slow-Mo support
  let currentSpeed = getCurrentBalloonSpeed();
  if (activeSlowMotion) {
    currentSpeed *= 0.55;
  }

  function animate() {
    if (!balloon.isConnected || !gameRunning) return;
    if (gamePaused) {
      requestAnimationFrame(animate);
      return;
    }

    y += currentSpeed;
    balloon.style.bottom = y + "px";

    if (y >= dangerPosition) {
      if (special && special.onDanger) {
        special.onDanger();
      } else {
        applyEnergyLoss(ENERGY_LOSS);
      }
      updateEnergy();
      balloon.remove();
      return;
    }

    requestAnimationFrame(animate);
  }

  animate();

  balloon.addEventListener("click", (e) => {
    if (!gameRunning || gamePaused) return;

    // Multi-pop
    if (upgradeLevels.multiPop > 0) {
      const rect = balloon.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      document.querySelectorAll(".balloon-container .balloon").forEach((other) => {
        if (other === balloon || other.classList.contains("pop")) return;
        const r = other.getBoundingClientRect();
        const ox = r.left + r.width / 2;
        const oy = r.top + r.height / 2;
        const dist = Math.hypot(cx - ox, cy - oy);
        if (dist < 95) {
          popBalloon(other);
        }
      });
    }

    popBalloon(balloon);
  });
}

function popBalloon(balloon) {
  if (!balloon || balloon.classList.contains("pop")) return;

  const type = balloon.dataset.type;
  const special = type !== "normal" ? specialBalloons[type] : null;

  if (special && special.onPop) {
    special.onPop();
  } else {
    score += 10 * scoreMultiplier;
    coins += COINS_PER_POP * (activeDoubleCoins ? 2 : 1);
    updateScore();
    updateCoins();
  }

  playSound(document.getElementById("pop-sound"));
  balloon.classList.add("pop");
  setTimeout(() => balloon.remove(), 200);
}

function showFloatingText(text, color = "#fff") {
  const el = document.createElement("div");
  el.className = "floating-text";
  el.textContent = text;
  el.style.color = color;
  el.style.left = 40 + Math.random() * 20 + "%";
  el.style.top = 35 + Math.random() * 20 + "%";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}