// ======= PHOTO PUZZLE GAME (touchscreen friendly) =======
// Tap 2 tiles to swap, or drag one tile onto another.
// Photo source: assets/img/puzzle.jpg  (ganti dengan fotomu sendiri)

const PUZZLE_IMG = "assets/img/puzzle.png";

let gridN = 3; // ukuran grid (3x3 / 4x4)
let order = []; // urutan tile saat ini (index posisi asli)
let moves = 0;
let firstPick = null; // tile pertama yang dipilih (untuk swap)
let solved = false;

function setPuzzleSize(n) {
  gridN = n;
  document.querySelectorAll(".diff-btn").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.n) === n);
  });
  initPuzzle();
}

function initPuzzle() {
  const board = document.getElementById("puzzleBoard");
  solved = false;
  moves = 0;
  firstPick = null;
  document.getElementById("puzzleMoves").textContent = "0";
  document.getElementById("puzzleResult").style.display = "none";

  // siapkan urutan 0..n*n-1 lalu acak (pastikan tidak langsung solved)
  const total = gridN * gridN;
  order = Array.from({ length: total }, (_, i) => i);
  do {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (isSolved());

  board.style.setProperty("--n", gridN);
  board.classList.toggle("grid4", gridN === 4);
  renderPuzzle();
}

function renderPuzzle() {
  const board = document.getElementById("puzzleBoard");
  board.innerHTML = "";
  const pct = 100 / (gridN - 1); // langkah background-position

  order.forEach((tileId, pos) => {
    const tile = document.createElement("div");
    tile.className = "puzzle-tile";
    tile.dataset.pos = pos; // posisi di papan
    tile.dataset.tile = tileId; // potongan gambar yang asli

    // hitung posisi background untuk potongan tileId
    const row = Math.floor(tileId / gridN);
    const col = tileId % gridN;
    tile.style.backgroundImage = `url('${PUZZLE_IMG}')`;
    tile.style.backgroundSize = `${gridN * 100}% ${gridN * 100}%`;
    tile.style.backgroundPosition = `${col * pct}% ${row * pct}%`;

    // klik / tap untuk pilih & tukar
    tile.addEventListener("click", () => pickTile(pos));

    board.appendChild(tile);
  });

  enableDrag();
}

function pickTile(pos) {
  if (solved) return;
  const board = document.getElementById("puzzleBoard");
  const tiles = board.querySelectorAll(".puzzle-tile");

  if (firstPick === null) {
    firstPick = pos;
    tiles[pos].classList.add("picked");
    return;
  }

  if (firstPick === pos) {
    // batal pilih
    tiles[pos].classList.remove("picked");
    firstPick = null;
    return;
  }

  swapTiles(firstPick, pos);
  tiles.forEach((t) => t.classList.remove("picked"));
  firstPick = null;
}

function swapTiles(a, b) {
  [order[a], order[b]] = [order[b], order[a]];
  moves++;
  document.getElementById("puzzleMoves").textContent = moves;
  renderPuzzle();
  checkSolved();
}

function isSolved() {
  return order.every((tileId, pos) => tileId === pos);
}

function checkSolved() {
  if (isSolved()) {
    solved = true;
    document.querySelectorAll(".puzzle-tile").forEach((t) => {
      t.classList.add("done");
      t.classList.remove("picked");
    });
    const res = document.getElementById("puzzleResult");
    res.style.display = "block";
    res.classList.remove("visible");
    void res.offsetWidth;
    res.classList.add("visible");
    if (typeof confettiBurst === "function") confettiBurst();
  }
}

// ---- Drag & drop (mouse + touch) ----
function enableDrag() {
  const board = document.getElementById("puzzleBoard");
  const tiles = [...board.querySelectorAll(".puzzle-tile")];
  let dragEl = null;
  let dragPos = null;

  function getTileAt(x, y) {
    const el = document.elementFromPoint(x, y);
    if (el && el.classList.contains("puzzle-tile")) return el;
    return null;
  }

  tiles.forEach((tile) => {
    tile.addEventListener(
      "touchstart",
      (e) => {
        if (solved) return;
        dragEl = tile;
        dragPos = Number(tile.dataset.pos);
        tile.classList.add("dragging");
      },
      { passive: true },
    );

    tile.addEventListener(
      "touchmove",
      (e) => {
        if (!dragEl) return;
        e.preventDefault();
        const t = e.touches[0];
        const over = getTileAt(t.clientX, t.clientY);
        tiles.forEach((x) => x.classList.remove("over"));
        if (over && over !== dragEl) over.classList.add("over");
      },
      { passive: false },
    );

    tile.addEventListener("touchend", (e) => {
      if (!dragEl) return;
      const t = e.changedTouches[0];
      const over = getTileAt(t.clientX, t.clientY);
      dragEl.classList.remove("dragging");
      tiles.forEach((x) => x.classList.remove("over"));
      if (over && over !== dragEl) {
        const targetPos = Number(over.dataset.pos);
        if (firstPick !== null) {
          document
            .querySelectorAll(".puzzle-tile")
            .forEach((x) => x.classList.remove("picked"));
          firstPick = null;
        }
        swapTiles(dragPos, targetPos);
      }
      dragEl = null;
      dragPos = null;
    });
  });
}

function showPeek(on) {
  const board = document.getElementById("puzzleBoard");
  if (!board) return;
  board.classList.toggle("peek", on);
}

function skipPuzzle() {
  if (typeof showToast === "function")
    showToast("yahh ko di skip sii? gapapa deh, lanjut ke kejutannya yaa🥺");
  setTimeout(() => goToPage(3), 1500);
}

function celebrateAgain() {
  if (typeof confettiBurst === "function") confettiBurst();
}
