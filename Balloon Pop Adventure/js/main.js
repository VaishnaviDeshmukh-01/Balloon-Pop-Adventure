window.addEventListener("DOMContentLoaded", () => {
  // Load upgrades
  upgradeLevels.extraEnergy = parseInt(localStorage.getItem("upg_extraEnergy")) || 0;
  upgradeLevels.multiPop    = parseInt(localStorage.getItem("upg_multiPop")) || 0;
  upgradeLevels.shield      = parseInt(localStorage.getItem("upg_shield")) || 0;
  activeSlowMotion  = localStorage.getItem("active_slowMotion") === "1";
  activeDoubleCoins = localStorage.getItem("active_doubleCoins") === "1";

  MAX_ENERGY = 100 + upgradeLevels.extraEnergy * 20;
  energy = MAX_ENERGY;

  updateScore();
  updateEnergy();

  // Came from Home Shop button?
  const fromHomeShop = localStorage.getItem("openShopOnLoad") === "1";
  if (fromHomeShop) {
    localStorage.removeItem("openShopOnLoad");
    // Do NOT start the game
    setTimeout(openShop, 300);
  } else {
    // Normal entry → start playing
    startGame();
  }
});

// ---------- Shop buttons ----------
const shopBtnPause = document.getElementById("shop-btn-pause");
if (shopBtnPause) {
  shopBtnPause.addEventListener("click", () => {
    openShop();
  });
}

const closeShopBtn = document.getElementById("close-shop");
if (closeShopBtn) {
  closeShopBtn.addEventListener("click", closeShop);
}

// Plus (+) button → pause the game + open shop
if (plusBtn) {
  plusBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    if (gameRunning && !gamePaused) {
      pauseGame();          // ← pauses the game
    }
    openShop();
  });
}

// Click outside shop to close
const shopModal = document.getElementById("shop-modal");
if (shopModal) {
  shopModal.addEventListener("click", (e) => {
    if (e.target === shopModal) {
      closeShop();
    }
  });
}

// ---------- Normal game buttons ----------
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    resetGame();
  });
}

const homeBtn = document.getElementById("home-btn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    setTimeout(() => (window.location.href = "index.html"), 150);
  });
}

if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    pauseGame();
  });
}

if (resumeBtn) {
  resumeBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    resumeGame();
  });
}

if (closePause) {
  closePause.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    resumeGame();
  });
}

if (restartPauseBtn) {
  restartPauseBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    pauseOverlay.classList.add("hidden");
    gamePaused = false;
    resetGame();
  });
}

if (homePauseBtn) {
  homePauseBtn.addEventListener("click", () => {
    playSound(document.getElementById("click-sound"));
    window.location.href = "index.html";
  });
}