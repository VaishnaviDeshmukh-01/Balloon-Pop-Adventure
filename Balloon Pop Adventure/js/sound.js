function isSoundEnabled() {
  return localStorage.getItem("sound") !== "off";
}

function isMusicEnabled() {
  return localStorage.getItem("music") !== "off";
}

function getVolume() {
  return Number(localStorage.getItem("volume") || 75) / 100;
}

function playSound(audioEl) {
  if (!audioEl || !isSoundEnabled()) return;
  audioEl.currentTime = 0;
  audioEl.volume = getVolume();
  audioEl.play().catch(() => {});
}

function startGameMusic() {
  const bg = document.getElementById("bg-music");
  if (!bg || !isMusicEnabled()) return;
  bg.volume = getVolume();
  bg.play().catch(() => {});
}

function stopGameMusic() {
  const bg = document.getElementById("bg-music");
  if (bg) {
    bg.pause();
    bg.currentTime = 0;
  }
}