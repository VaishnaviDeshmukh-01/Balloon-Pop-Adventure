const balloonImages = [
  "assets/blue-balloon.png",
  "assets/red-balloon.png",
  "assets/green-balloon.png",
  "assets/yellow-balloon.png",
];

const balloonSpeed = window.innerWidth <= 768 ? 4 : 2;

let score = 0;
let coins = 0;                    // session coins (earned this run)
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
let energy = 100;
let gameRunning = false;
let gamePaused = false;
let spawnInterval = null;
let lastTime = 0;
let gameStartTime = 0;
let pausedTime = 0;

// Score settings
const baseSpeed = 40;
const COINS_PER_POP = 5;

// ============== POWER BALLOONS ==============
const SPECIAL_CHANCE = 0.10;

const specialBalloons = {
  golden: {
    image: "assets/golden-balloon.png",
    weight: 40,
    onPop: () => {
      score += 50 * scoreMultiplier;
      coins += 25 * (activeDoubleCoins ? 2 : 1);
      showFloatingText("+50 ★", "#FFD700");
      updateScore();
      updateCoins();
    },
    onDanger: () => {
      applyEnergyLoss(ENERGY_LOSS);
    },
  },
  heart: {
    image: "assets/heart-balloon.png",
    weight: 30,
    onPop: () => {
      energy = Math.min(MAX_ENERGY, energy + 25);
      showFloatingText("+25 ❤️", "#FF69B4");
      updateEnergy();
    },
    onDanger: () => {
      applyEnergyLoss(ENERGY_LOSS);
    },
  },
  bomb: {
    image: "assets/bomb-balloon.png",
    weight: 20,
    onPop: () => {
      energy = Math.max(0, energy - 15);
      showFloatingText("-15 💣", "#FF4500");
      updateEnergy();
    },
    onDanger: () => {
      applyEnergyLoss(ENERGY_LOSS * 2);
    },
  },
  rainbow: {
    image: "assets/rainbow-balloon.png",
    weight: 10,
    onPop: () => {
      activateComboMultiplier(5, 2);
      showFloatingText("×2 COMBO!", "#00FFFF");
    },
    onDanger: () => {
      applyEnergyLoss(ENERGY_LOSS);
    },
  },
};

// Score multiplier system
let scoreMultiplier = 1;
let multiplierTimeout = null;

function activateComboMultiplier(seconds, mult) {
  scoreMultiplier = mult;
  clearTimeout(multiplierTimeout);
  multiplierTimeout = setTimeout(() => {
    scoreMultiplier = 1;
  }, seconds * 1000);
}

// ============================================
// SHOP / UPGRADES SYSTEM
// ============================================

const SHOP_ITEMS = {
  extraEnergy: {
    id: "extraEnergy",
    name: "Extra Energy",
    icon: "❤️",
    desc: "Start with more max energy",
    maxLevel: 3,
    costs: [100, 200, 400],          // cost for level 1,2,3
    permanent: true,
  },
  multiPop: {
    id: "multiPop",
    name: "Multi-Pop",
    icon: "💥",
    desc: "Pop nearby balloons too!",
    maxLevel: 1,
    costs: [180],
    permanent: true,
  },
  shield: {
    id: "shield",
    name: "Shield",
    icon: "🛡️",
    desc: "Ignore next energy loss (stack up to 3)",
    maxLevel: 3,                     // how many charges you can hold
    costs: [60, 60, 60],
    permanent: false,                // charges are consumable
  },
  slowMotion: {
    id: "slowMotion",
    name: "Slow-Mo",
    icon: "🐢",
    desc: "Balloons rise slower next run",
    maxLevel: 1,
    costs: [70],
    permanent: false,                // one-time use
  },
  doubleCoins: {
    id: "doubleCoins",
    name: "Double Coins",
    icon: "🪙",
    desc: "2× coins next run",
    maxLevel: 1,
    costs: [90],
    permanent: false,
  },
};

// Runtime upgrade state
let upgradeLevels = {
  extraEnergy: parseInt(localStorage.getItem("upg_extraEnergy")) || 0,
  multiPop: parseInt(localStorage.getItem("upg_multiPop")) || 0,
  shield: parseInt(localStorage.getItem("upg_shield")) || 0,
};

let activeSlowMotion = localStorage.getItem("active_slowMotion") === "1";
let activeDoubleCoins = localStorage.getItem("active_doubleCoins") === "1";

// Dynamic max energy based on permanent upgrade
let MAX_ENERGY = 100 + upgradeLevels.extraEnergy * 20;
const ENERGY_LOSS = 10;
const SPAWN_INTERVAL = 1000;
const BALLOON_WIDTH = 80;

// Apply energy loss with shield support
function applyEnergyLoss(amount) {
  if (upgradeLevels.shield > 0) {
    upgradeLevels.shield--;
    localStorage.setItem("upg_shield", upgradeLevels.shield);
    showFloatingText("🛡️ SHIELD!", "#4CAF50");
    updateEnergy(); // just refresh UI
    return;
  }
  energy -= amount;
}

// DOM refs
const balloonContainer = document.getElementById("balloon-container");
const gameBoard = balloonContainer;
const dangerLine = document.querySelector(".danger-line");
const gameOverScreen = document.querySelector(".game-over-overlay");
const finalScore = document.querySelector(".final-score");
const restartBtn = document.getElementById("restart-btn");
const energyFill = document.querySelector(".energy-fill");
const energyText = document.querySelector(".energy-text");
const coinValue = document.querySelector(".coin-value");
const pauseBtn = document.querySelector(".pause-btn");
const plusBtn = document.querySelector(".plus-btn");
const pauseOverlay = document.getElementById("pause-overlay");
const restartPauseBtn = document.querySelector(".restart-btn");
const homePauseBtn = document.querySelector(".home-btn");

const resumeBtn = document.getElementById("resume-btn");
const closePause = document.getElementById("close-pause");

const scoreValueEl = document.querySelector(".score-value");
const bestScoreEl = document.querySelector(".best-score");

const currentScoreEl = document.getElementById("current-score");
const highestScoreEl = document.getElementById("highest-score");
const totalCoinsEl = document.getElementById("total-coins");
const earnedCoinsEl = document.getElementById("earned-coins");
const newRecordEl = document.getElementById("new-record");