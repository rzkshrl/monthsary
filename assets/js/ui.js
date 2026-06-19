// ======= UI UTILITIES =======
// Floating hearts, toast notification, confetti burst

// --- Floating Hearts Background ---
function initHearts() {
  const heartsBg = document.getElementById("heartsBg");
  const emojis = ["🩵", "💙", "✨", "🌸", "💎", "⭐", "🩵", "❄️"];

  emojis.forEach((e) => {
    for (let j = 0; j < 2; j++) {
      const h = document.createElement("div");
      h.className = "heart-float";
      h.textContent = e;
      h.style.left = Math.random() * 100 + "%";
      h.style.fontSize = 0.8 + Math.random() * 1.1 + "rem";
      h.style.animationDuration = 9 + Math.random() * 11 + "s";
      h.style.animationDelay = Math.random() * 12 + "s";
      heartsBg.appendChild(h);
    }
  });
}

// --- Toast ---
let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3800);
}

// --- Confetti ---
function confettiBurst() {
  const colors = [
    "#5b9bd5",
    "#7ec8e3",
    "#cfe8ff",
    "#9ad6c4",
    "#9aa7ec",
    "#d6e8fb",
  ];

  for (let i = 0; i < 38; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = 15 + Math.random() * 70 + "vw";
    piece.style.top = "0";
    piece.style.width = 5 + Math.random() * 8 + "px";
    piece.style.height = 5 + Math.random() * 10 + "px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 2 + Math.random() * 2 + "s";
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4500);
  }
}

window.addEventListener("DOMContentLoaded", initHearts);
