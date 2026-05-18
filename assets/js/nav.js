// ======= PAGE NAVIGATION =======

function goToPage(n) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".dot")
    .forEach((d) => d.classList.remove("active"));
  document.getElementById("page" + n).classList.add("active");
  document.getElementById("dot" + n).classList.add("active");
  window.scrollTo(0, 0);
  if (n === 2) setTimeout(initLoveLayout, 60);
  if (n === 3) initShapeGame();
}

// ======= LOVE BUTTONS (PAGE 2) =======

let yesScale = 1;
let noCount = 0;

const yesMessages = ["awww maacii ayangg🥰💖", "yeeeyyyyyy aku jugaaa 🎉💕"];

function initLoveLayout() {
  const arena = document.getElementById("loveArena");
  const aw = arena.offsetWidth;
  const ah = arena.offsetHeight;
  const yes = document.getElementById("btn-yes");
  const no = document.getElementById("btn-no");

  yes.style.left = Math.round(aw * 0.08) + "px";
  yes.style.top = Math.round((ah - yes.offsetHeight) / 2) + "px";
  yes.style.transform = "none";

  no.style.left = Math.round(aw * 0.58) + "px";
  no.style.top = Math.round((ah - no.offsetHeight) / 2) + "px";
  no.style.transform = "none";
}

function yesClicked() {
  yesScale = Math.min(yesScale + 0.22, 2.7);

  const yes = document.getElementById("btn-yes");
  yes.style.transformOrigin = "center center";
  yes.style.transform = `scale(${yesScale})`;
  yes.style.fontSize = Math.min(1.4 + (yesScale - 1) * 0.35, 2.5) + "rem";

  const noCat = document.getElementById("no-cat");
  if (noCat) noCat.style.display = "none";

  document.getElementById("yes-text").textContent =
    yesMessages[Math.floor(Math.random() * yesMessages.length)];
  document.getElementById("yes-msg").style.display = "block";

  confettiBurst();
}

function noClicked() {
  noCount++;

  const arena = document.getElementById("loveArena");
  const aw = arena.offsetWidth;
  const ah = arena.offsetHeight;
  const yes = document.getElementById("btn-yes");
  const no = document.getElementById("btn-no");

  // Kecilkan tombol No
  const noScale = Math.max(0.45, 1 - noCount * 0.08);
  no.style.fontSize = noScale * 1.3 + "rem";
  no.style.padding = noScale * 12 + "px " + noScale * 26 + "px";

  // Cari posisi paling jauh dari tombol Yes
  const yesCx = yes.offsetLeft + yes.offsetWidth / 2;
  const yesCy = yes.offsetTop + yes.offsetHeight / 2;
  const noW = no.offsetWidth;
  const noH = no.offsetHeight;

  let best = null;
  let bestDist = -1;

  for (let t = 0; t < 50; t++) {
    const px = Math.random() * Math.max(1, aw - noW);
    const py = Math.random() * Math.max(1, ah - noH);
    const d = Math.hypot(px + noW / 2 - yesCx, py + noH / 2 - yesCy);
    if (d > bestDist) {
      bestDist = d;
      best = { px, py };
    }
  }

  no.style.left = best.px + "px";
  no.style.top = best.py + "px";
  no.style.transform = "none";

  // Besarkan tombol Yes sedikit
  yesScale = Math.min(yesScale + 0.1, 2.7);
  yes.style.transformOrigin = "center center";
  yes.style.transform = `scale(${yesScale})`;

  // Setelah 5 hover, tampilkan kucing judging
  if (noCount === 5) {
    document.getElementById("no-cat").style.display = "block";
  }
}

// Trigger noClicked saat cursor masuk tombol No
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-no").addEventListener("mouseenter", noClicked);
});
