const balloonImages = [
  "assets/blue-balloon.png",
  "assets/red-balloon.png",
  "assets/green-balloon.png",
  "assets/yellow-balloon.png",
];

const balloonSpeed = window.innerWidth <= 768 ? 4 : 2;

let score = 0;
let energy = 100;
let gameRunning = false;
let gamePaused = false;
let spawnInterval = null;

const balloonContainer = document.getElementById("balloon-container");
const gameBoard = balloonContainer; // full-screen play area
const dangerLine = document.querySelector(".danger-line");
const gameOverScreen = document.querySelector(".game-over");
const finalScore = document.querySelector(".final-score");
const restartBtn = document.getElementById("restart-btn");
const energyFill = document.querySelector(".energy-fill");
const energyText = document.querySelector(".energy-text");
const coinValue = document.querySelector(".coin-value");
const pauseBtn = document.querySelector(".pause-btn");
const plusBtn = document.querySelector(".plus-btn");

const SPAWN_INTERVAL = 1000;
const BALLOON_WIDTH = 80;
const ENERGY_LOSS = 10;
const MAX_ENERGY = 100;
const POINTS_PER_POP = 10;