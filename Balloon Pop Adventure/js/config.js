const balloonImages = [
  "assets/blue-balloon.png",
  "assets/red-balloon.png",
  "assets/green-balloon.png",
  "assets/yellow-balloon.png",
];

const balloonSpeed = window.innerWidth <= 768 ? 4 : 2;

let score = 0;
let coins = 0;
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
const SPECIAL_CHANCE = 0.10; // 10% chance a balloon is special

const specialBalloons = {
  golden: {
    image: "assets/golden-balloon.png",
    weight: 40,
    onPop: () => {
      score += 50 * scoreMultiplier;
      coins += 25;
      showFloatingText("+50 ★", "#FFD700");
      updateScore();
      updateCoins();
    },
    onDanger: () => {
      energy -= ENERGY_LOSS;
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
      energy -= ENERGY_LOSS;
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
      energy -= ENERGY_LOSS * 2; // double damage
    },
  },
  rainbow: {
    image: "assets/rainbow-balloon.png",
    weight: 10, // rarest
    onPop: () => {
      activateComboMultiplier(5, 2);
      showFloatingText("×2 COMBO!", "#00FFFF");
    },
    onDanger: () => {
      energy -= ENERGY_LOSS;
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

const SPAWN_INTERVAL = 1000;
const BALLOON_WIDTH = 80;
const ENERGY_LOSS = 10;
const MAX_ENERGY = 100;