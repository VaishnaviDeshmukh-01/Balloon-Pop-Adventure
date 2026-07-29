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
let spawnInterval;

const balloonContainer = document.getElementById("balloon-container");

const gameBoard = document.querySelector(".game-board");

const dangerLine = document.querySelector(".danger-line");

const gameOverScreen = document.querySelector(".game-over");

const finalScore = document.querySelector(".final-score");

const restartBtn = document.getElementById("restart-btn");

const startBtn = document.getElementById("start-btn");

let scoreElement = document.querySelector(".score");

const scoreBox = document.querySelector(".score-box");

const energyFill = document.querySelector(".energy-fill");

const SPAWN_INTERVAL = 1000;
const BALLOON_WIDTH = 80;
const ENERGY_LOSS = 10;
const MAX_ENERGY = 100;