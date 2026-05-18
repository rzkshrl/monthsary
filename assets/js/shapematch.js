// ======= SHAPE MATCH GAME =======

const allEmojis = ["🐱", "🌸", "⭐", "🦋", "🍓", "🌈", "🎀", "🍩"];

let flipped = [];
let matched = 0;
let moves = 0;
let canFlip = true;

function initShapeGame() {
  const grid = document.getElementById("shapeGrid");

  // Shuffle kartu
  const arr = [...allEmojis, ...allEmojis];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Reset state
  flipped = [];
  matched = 0;
  moves = 0;
  canFlip = true;
  document.getElementById("matchScore").textContent = 0;
  document.getElementById("moves").textContent = 0;
  document.getElementById("matchResult").style.display = "none";
  document.getElementById("nextGameBtn").style.display = "none";

  // Render kartu
  grid.innerHTML = "";
  arr.forEach((emoji) => {
    const card = document.createElement("div");
    card.className = "shape-card";
    card.textContent = "?";
    card.dataset.emoji = emoji;
    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (
    !canFlip ||
    card.classList.contains("matched") ||
    card.classList.contains("selected")
  )
    return;

  card.textContent = card.dataset.emoji;
  card.classList.add("selected");
  flipped.push(card);

  if (flipped.length === 2) {
    canFlip = false;
    moves++;
    document.getElementById("moves").textContent = moves;
    setTimeout(checkMatch, 680);
  }
}

function checkMatch() {
  const [a, b] = flipped;

  if (a.dataset.emoji === b.dataset.emoji) {
    a.classList.replace("selected", "matched");
    b.classList.replace("selected", "matched");
    matched++;

    document.getElementById("matchScore").textContent = Math.max(
      0,
      allEmojis.length * 15 - moves * 8 + matched * 10,
    );

    if (matched === allEmojis.length) {
      document.getElementById("matchResult").style.display = "block";
      document.getElementById("nextGameBtn").style.display = "inline-block";
      confettiBurst();
    }
  } else {
    a.classList.add("wrong");
    b.classList.add("wrong");
    setTimeout(() => {
      a.classList.remove("selected", "wrong");
      a.textContent = "?";
      b.classList.remove("selected", "wrong");
      b.textContent = "?";
    }, 480);
  }

  flipped = [];
  canFlip = true;
}

function skipShapeGame() {
  showToast("yahh ko di skip sih? gapapa deh huhu, next game ajaa");
  setTimeout(() => goToGame(2), 1500);
}

function goToGame(n) {
  document
    .querySelectorAll(".game-section")
    .forEach((g) => g.classList.remove("active-game"));
  document.getElementById("game" + n).classList.add("active-game");
  window.scrollTo(0, 0);
  if (n === 2) initQuiz();
}
