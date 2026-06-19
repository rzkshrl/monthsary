// ======= FILL THE HEART (spam tap) =======
const TAPS_TO_FILL = 40; // target tap untuk penuh (samain dengan screenshot)

let heartTaps = 0;
let heartStart = null;
let heartDone = false;

function initHeartTap() {
  heartTaps = 0;
  heartStart = null;
  heartDone = false;
  updateHeartFill(0);
  document.getElementById("heartResultCard").style.display = "none";

  const area = document.getElementById("heartTapArea");
  // hapus listener lama biar ga dobel, lalu pasang lagi
  area.replaceWith(area.cloneNode(true));
  const fresh = document.getElementById("heartTapArea");

  // pointerdown menangani mouse + touch sekaligus, anti double-fire
  fresh.addEventListener("pointerdown", onHeartTap);
}

function onHeartTap(e) {
  e.preventDefault();
  if (heartDone) return;
  if (heartStart === null) heartStart = Date.now();

  heartTaps++;
  const pct = Math.min(100, Math.round((heartTaps / TAPS_TO_FILL) * 100));
  updateHeartFill(pct);

  // efek pop kecil tiap tap
  const wrap = document.getElementById("heartTapArea");
  wrap.style.transform = "scale(1.04)";
  setTimeout(() => (wrap.style.transform = ""), 80);

  if (pct >= 100) finishHeart();
}

function updateHeartFill(pct) {
  // SVG fill: rect mulai y=90 (kosong) naik ke y=0 (penuh) di viewBox tinggi 90
  const fill = document.getElementById("heartFill");
  if (fill) fill.setAttribute("y", 90 - (pct / 100) * 90);
  document.getElementById("heartBarFill").style.width = pct + "%";
  document.getElementById("heartPct").textContent = pct + "% terisi";
}

function finishHeart() {
  heartDone = true;
  const secs = Math.max(1, Math.round((Date.now() - heartStart) / 1000));
  document.getElementById("tapCount").textContent = heartTaps;
  document.getElementById("tapTime").textContent = secs;
  document.getElementById("heartResultCard").style.display = "block";
  if (typeof confettiBurst === "function") confettiBurst();
}
