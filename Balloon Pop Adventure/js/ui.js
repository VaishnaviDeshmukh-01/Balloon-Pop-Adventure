function updateScore() {
  if (scoreValueEl) {
    scoreValueEl.textContent = Math.floor(score).toLocaleString();
  }

  if (Math.floor(score) > bestScore) {
    bestScore = Math.floor(score);
    localStorage.setItem("bestScore", bestScore);
  }

  if (bestScoreEl) {
    bestScoreEl.textContent = "Best : " + bestScore.toLocaleString();
  }
}

function updateCoins() {
  if (coinValue) {
    coinValue.textContent = coins;
  }
}

function updateEnergy() {
  if (energy < 0) energy = 0;
  if (energy > MAX_ENERGY) energy = MAX_ENERGY;

  if (energyFill) {
    energyFill.style.width = (energy / MAX_ENERGY) * 100 + "%";
  }

  if (energyText) {
    energyText.textContent = energy + " / " + MAX_ENERGY;
  }

  if (energyFill) {
    if (energy > MAX_ENERGY * 0.5) {
      energyFill.style.background =
        "linear-gradient(90deg, #FF6B6B 0%, #FF1744 45%, #D50000 100%)";
    } else if (energy > MAX_ENERGY * 0.2) {
      energyFill.style.background =
        "linear-gradient(90deg, #FFC107 0%, #FF9800 100%)";
    } else {
      energyFill.style.background =
        "linear-gradient(90deg, #F44336 0%, #B71C1C 100%)";
    }
  }

  if (energy === 0) {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;
  clearInterval(spawnInterval);
  balloonContainer.innerHTML = "";
  stopGameMusic();
  playSound(document.getElementById("game-over-sound"));

  const currentScore = Math.floor(score);
  currentScoreEl.textContent = currentScore.toLocaleString();
  highestScoreEl.textContent = bestScore.toLocaleString();
  earnedCoinsEl.textContent = coins.toLocaleString();

  // Add session coins to permanent total
  let totalCoins = parseInt(localStorage.getItem("totalCoins")) || 0;
  totalCoins += coins;
  localStorage.setItem("totalCoins", totalCoins);
  totalCoinsEl.textContent = totalCoins.toLocaleString();

  // Clear one-time actives after the run
  if (activeSlowMotion) {
    activeSlowMotion = false;
    localStorage.removeItem("active_slowMotion");
  }
  if (activeDoubleCoins) {
    activeDoubleCoins = false;
    localStorage.removeItem("active_doubleCoins");
  }

  if (currentScore >= bestScore) {
    newRecordEl.classList.remove("hidden");
  } else {
    newRecordEl.classList.add("hidden");
  }

  gameOverScreen.classList.remove("hidden");
}

// ========== SHOP UI ==========
function getTotalCoins() {
  return parseInt(localStorage.getItem("totalCoins")) || 0;
}

function openShop() {
  const modal = document.getElementById("shop-modal");
  if (!modal) return;

  renderShop();

  const playBtn = document.getElementById("shop-play-btn");
  if (playBtn) {
    if (!gameRunning) {
      playBtn.classList.remove("hidden");
    } else {
      playBtn.classList.add("hidden");
    }
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";   // ← lock page scroll
  playSound(document.getElementById("click-sound"));
}

function closeShop() {
  const modal = document.getElementById("shop-modal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";         // ← restore page scroll
  playSound(document.getElementById("click-sound"));

  if (gamePaused) {
    resumeGame();
  }
}

// Start Playing button inside shop
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "shop-play-btn") {
    closeShop();
    if (!gameRunning) {
      startGame();
    }
  }
});

function renderShop() {
  const list = document.getElementById("shop-list");
  const totalEl = document.getElementById("shop-total-coins");
  if (!list || !totalEl) return;

  totalEl.textContent = getTotalCoins().toLocaleString();

  list.innerHTML = "";

  Object.values(SHOP_ITEMS).forEach((item) => {
    const level = item.permanent
      ? (upgradeLevels[item.id] || 0)
      : (item.id === "shield" ? upgradeLevels.shield : 0);

    const isMaxed = level >= item.maxLevel;
    const cost = isMaxed ? 0 : item.costs[Math.min(level, item.costs.length - 1)];
    const canBuy = !isMaxed && getTotalCoins() >= cost;

    // For one-time items show if already active
    let statusText = "";
    if (item.id === "slowMotion" && activeSlowMotion) statusText = "ACTIVE ✓";
    if (item.id === "doubleCoins" && activeDoubleCoins) statusText = "ACTIVE ✓";
    if (item.id === "shield") statusText = `Charges: ${upgradeLevels.shield}`;
    if (item.permanent && level > 0) statusText = `Level ${level}/${item.maxLevel}`;

    const card = document.createElement("div");
    card.className = "shop-item" + (isMaxed || statusText.includes("ACTIVE") ? " owned" : "");
    card.innerHTML = `
      <div class="shop-icon">${item.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${item.name}</div>
        <div class="shop-desc">${item.desc}</div>
        <div class="shop-status">${statusText}</div>
      </div>
      <button class="shop-buy-btn" data-id="${item.id}" ${(!canBuy || isMaxed || statusText.includes("ACTIVE")) ? "disabled" : ""}>
        ${isMaxed || statusText.includes("ACTIVE") ? "✓" : cost + " 🪙"}
      </button>
    `;
    list.appendChild(card);
  });

  // Buy listeners
  list.querySelectorAll(".shop-buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      buyUpgrade(btn.dataset.id);
    });
  });
}

function buyUpgrade(id) {
  const item = SHOP_ITEMS[id];
  if (!item) return;

  const level = item.permanent
    ? (upgradeLevels[id] || 0)
    : (id === "shield" ? upgradeLevels.shield : 0);

  if (level >= item.maxLevel) return;
  if (id === "slowMotion" && activeSlowMotion) return;
  if (id === "doubleCoins" && activeDoubleCoins) return;

  const cost = item.costs[Math.min(level, item.costs.length - 1)];
  let total = getTotalCoins();
  if (total < cost) {
    showFloatingText("Not enough coins!", "#FF5252");
    return;
  }

  total -= cost;
  localStorage.setItem("totalCoins", total);

  if (item.permanent) {
    upgradeLevels[id] = level + 1;
    localStorage.setItem("upg_" + id, upgradeLevels[id]);

    if (id === "extraEnergy") {
      MAX_ENERGY = 100 + upgradeLevels.extraEnergy * 20;
      energy = Math.min(energy + 20, MAX_ENERGY);
      updateEnergy();
    }
  } else if (id === "shield") {
    upgradeLevels.shield = Math.min(3, upgradeLevels.shield + 1);
    localStorage.setItem("upg_shield", upgradeLevels.shield);
  } else if (id === "slowMotion") {
    activeSlowMotion = true;
    localStorage.setItem("active_slowMotion", "1");
  } else if (id === "doubleCoins") {
    activeDoubleCoins = true;
    localStorage.setItem("active_doubleCoins", "1");
  }

  playSound(document.getElementById("bonus-sound") || document.getElementById("click-sound"));
  showFloatingText("Purchased! ✨", "#FFD700");
  renderShop();
}