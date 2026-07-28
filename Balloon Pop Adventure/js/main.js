const balloonContainer = document.getElementById("balloon-container");

function createBalloon() {
  const balloon = document.createElement("img");

  balloon.src = "assets/red-balloon.png";

  balloon.classList.add("balloon");

  const gameBoard = document.querySelector(".game-board");

  const maxX = gameBoard.clientWidth - 70;

  balloon.style.left = Math.random() * maxX + "px";

  balloon.style.bottom = "0px";

  balloonContainer.appendChild(balloon);

  let y = 0;

  function animate() {
    if (!balloon.isConnected) return;

    y += 2;

    balloon.style.bottom = y + "px";

    if (y > 420) {
      balloon.remove();
      return;
    }

    requestAnimationFrame(animate);
  }

  animate();

  balloon.addEventListener("click", () => {
    score += 10;

    updateScore();

    balloon.remove();
  });
}

const startBtn = document.getElementById("start-btn");


startBtn.addEventListener("click", () => {
    setInterval(createBalloon, 3000)
})


let score = 0;

let scoreElement =document.querySelector(".score");

function updateScore() {
    scoreElement.textContent = score;

    const scoreBox = document.querySelector(".score-box");

    scoreBox.classList.add("pop");

    setTimeout(() => {
        scoreBox.classList.remove("pop");
    }, 150)
}