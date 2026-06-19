// ======= PAGE NAVIGATION =======

function goToPage(n) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".dot")
    .forEach((d) => d.classList.remove("active"));
  document.getElementById("page" + n).classList.add("active");
  const dot = document.getElementById("dot" + n);
  if (dot) dot.classList.add("active"); // pageHeart tak punya dot, aman

  window.scrollTo(0, 0);

  if (n === 2) setTimeout(initPuzzle, 60); // mulai puzzle
  if (n === 3 && typeof confettiBurst === "function")
    setTimeout(confettiBurst, 300); // rayakan pas pesan muncul
}

// ======= FILL-THE-HEART PAGE (sebelum puzzle) =======
function goToHeart() {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".dot")
    .forEach((d) => d.classList.remove("active"));

  document.getElementById("pageHeart").classList.add("active");
  // tandai dot pertama supaya progress indicator tetap masuk akal
  const d1 = document.getElementById("dot1");
  if (d1) d1.classList.add("active");

  window.scrollTo(0, 0);
  if (typeof initHeartTap === "function") setTimeout(initHeartTap, 60);
}
