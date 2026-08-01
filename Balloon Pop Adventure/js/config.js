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
const baseSpeed = 40;               // starting points per second
const COINS_PER_POP = 5;            // coins you get when popping a balloon

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


// New Score UI elements
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