/* ==========================================
   DOM ELEMENTS
========================================== */

// Buttons
const settingsBtn = document.getElementById("settings-btn");
const playBtn = document.querySelector(".play-btn");
const resetBtn = document.querySelector(".reset-btn");

// Modals
const settingsModal = document.getElementById("settings-modal");
const closeSettings = document.getElementById("close-settings");

// Audio
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const popupSound = document.getElementById("popup-sound");
const bonusSound = document.getElementById("bonus-sound");
const gameOverSound = document.getElementById("game-over-sound");

// Settings
const musicToggle = document.getElementById("music-toggle");
const soundToggle = document.getElementById("sound-toggle");
const vibrationToggle = document.getElementById("vibration-toggle");
const volumeSlider = document.getElementById("volume-slider");


/* ==========================================
   LOCAL STORAGE DEFAULTS
========================================== */

if (localStorage.getItem("music") === null)
  localStorage.setItem("music", "on");

if (localStorage.getItem("sound") === null)
  localStorage.setItem("sound", "on");

if (localStorage.getItem("vibration") === null)
  localStorage.setItem("vibration", "on");

if (localStorage.getItem("volume") === null)
  localStorage.setItem("volume", "75");


/* ==========================================
   LOAD SAVED SETTINGS
========================================== */

const musicEnabled = localStorage.getItem("music") !== "off";
const soundEnabled = localStorage.getItem("sound") !== "off";
const vibrationEnabled = localStorage.getItem("vibration") !== "off";
const volume = Number(localStorage.getItem("volume"));

musicToggle.checked = musicEnabled;
soundToggle.checked = soundEnabled;
vibrationToggle.checked = vibrationEnabled;

volumeSlider.value = volume;
bgMusic.volume = volume / 100;


/* ==========================================
   HELPER FUNCTIONS
========================================== */

function playSound(sound) {
  if (!soundEnabledState()) return;

  sound.currentTime = 0;
  sound.volume = Number(volumeSlider.value) / 100;

  sound.play().catch(() => {});
}

function soundEnabledState() {
  return localStorage.getItem("sound") !== "off";
}

function vibrationEnabledState() {
  return localStorage.getItem("vibration") !== "off";
}

function vibrate(ms) {
  if (navigator.vibrate && vibrationEnabledState()) {
    navigator.vibrate(ms);
  }
}

function startMusic() {
  if (musicToggle.checked && bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }
}


/* ==========================================
   EVENT LISTENERS
========================================== */

// Settings Button
settingsBtn.addEventListener("click", () => {
  playSound(popupSound);
  vibrate(30);

  startMusic();

  settingsModal.classList.add("show");
});

// Close Settings
closeSettings.addEventListener("click", () => {
  playSound(clickSound);
  vibrate(20);

  settingsModal.classList.remove("show");
});

// Close by clicking outside
settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    playSound(clickSound);
    vibrate(20);

    settingsModal.classList.remove("show");
  }
});

// Music Toggle
musicToggle.addEventListener("change", () => {
  if (musicToggle.checked) {
    localStorage.setItem("music", "on");

    bgMusic.play().catch(() => {});
  } else {
    localStorage.setItem("music", "off");

    bgMusic.pause();
  }
});

// Sound Toggle
soundToggle.addEventListener("change", () => {
  playSound(clickSound);

  localStorage.setItem(
    "sound",
    soundToggle.checked ? "on" : "off"
  );
});

// Vibration Toggle
vibrationToggle.addEventListener("change", () => {
  playSound(clickSound);

  localStorage.setItem(
    "vibration",
    vibrationToggle.checked ? "on" : "off"
  );
});

// Volume Slider
volumeSlider.addEventListener("input", () => {
  const volume = Number(volumeSlider.value);

  bgMusic.volume = volume / 100;

  localStorage.setItem("volume", volume);
});

// Reset Button
resetBtn.addEventListener("click", () => {
  playSound(clickSound);
  vibrate(30);

  if (confirm("Reset all game progress?")) {
    localStorage.clear();
    location.reload();
  }
});

// Play Button
playBtn.addEventListener("click", () => {
  playSound(clickSound);
  vibrate(40);

  startMusic();

  setTimeout(() => {
    startGame();
  }, 250);
});

// Other Setting Buttons
document.querySelectorAll(".setting-btn").forEach((button) => {
  button.addEventListener("click", () => {
    playSound(clickSound);
    vibrate(20);
  });
});

// Shop button (top-right, under settings)
const shopBtnHome = document.getElementById("shop-btn-home");
if (shopBtnHome) {
  shopBtnHome.addEventListener("click", () => {
    playSound(clickSound);
    vibrate(30);
    localStorage.setItem("openShopOnLoad", "1");
    window.location.href = "game.html";
  });
}

// Show total coins
const homeCoinsEl = document.getElementById("home-total-coins");
if (homeCoinsEl) {
  homeCoinsEl.textContent = (parseInt(localStorage.getItem("totalCoins")) || 0).toLocaleString();
}


/* ==========================================
   LOADING SCREEN
========================================== */

window.addEventListener("load", () => {
  const loading = document.getElementById("loading-screen");
  const progress = document.getElementById("loading-progress");
  const percent = document.getElementById("loading-percent");

  let value = 0;

  const interval = setInterval(() => {
    value++;

    progress.style.width = value + "%";
    percent.textContent = value + "%";

    if (value >= 100) {
      clearInterval(interval);

      loading.style.opacity = "0";

      setTimeout(() => {
        loading.style.display = "none";
      }, 800);
    }
  }, 20);
});