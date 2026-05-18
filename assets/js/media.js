// ======= MEDIA QUESTION (Q6) =======
// Tenor GIF search + image upload

// Ganti dengan API key milikmu dari https://developers.tenor.com (gratis)
const TENOR_KEY = "AIzaSyAyimkuYQYF_FXVALexPzpFAaXKOFLf-UQ";
const TENOR_FALLBACK_KEY = "LIVDSRZULELA";

let activeGifTab = "tenor";
let selectedMediaUrl = null;
let selectedMediaType = "gif";
let selectedMediaPreview = null;
let tenorResults = [];

// --- Render container Q6 ---
function renderMediaQuestion(container) {
  selectedMediaUrl = answers[currentQ]?.url ?? null;
  selectedMediaType = answers[currentQ]?.mediaType ?? "gif";
  selectedMediaPreview = answers[currentQ]?.display ?? null;

  container.innerHTML = `
    <div class="gif-search-wrap">
      <div class="gif-tabs">
        <button class="gif-tab${activeGifTab === "tenor" ? " active" : ""}" onclick="switchGifTab('tenor')">🔍 Cari GIF Tenor</button>
        <button class="gif-tab${activeGifTab === "upload" ? " active" : ""}" onclick="switchGifTab('upload')">📤 Upload Gambar</button>
      </div>
      <div id="gifTabContent"></div>
    </div>`;

  renderGifTabContent();
}

function switchGifTab(tab) {
  activeGifTab = tab;
  document.querySelectorAll(".gif-tab").forEach((b, i) => {
    b.classList.toggle(
      "active",
      (i === 0 && tab === "tenor") || (i === 1 && tab === "upload"),
    );
  });
  renderGifTabContent();
}

function renderGifTabContent() {
  const c = document.getElementById("gifTabContent");
  if (!c) return;

  if (activeGifTab === "tenor") {
    c.innerHTML = `
      <div class="gif-search-row">
        <input class="gif-search-input" id="gifSearchInput" type="text"
          placeholder="ketik nama meme... (contoh: this is fine, surprised pikachu)"
          autocomplete="off">
        <button class="gif-search-btn" onclick="searchTenorGif()">Cari 🔍</button>
      </div>
      <div id="gifGrid" class="gif-grid">
        <p class="gif-loading" style="grid-column:1/-1">ketik dulu terus klik cari ya! 🐱</p>
      </div>
      <div id="gifSelectedPreview" style="margin-top:8px;"></div>`;

    if (tenorResults.length > 0) renderTenorGrid(tenorResults);
    if (selectedMediaUrl && selectedMediaType === "gif") showSelectedBadge();

    document
      .getElementById("gifSearchInput")
      ?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") searchTenorGif();
      });
  } else {
    const hasMedia = selectedMediaUrl && selectedMediaType === "image";
    c.innerHTML = `
      <div class="upload-area" onclick="document.getElementById('uploadInput').click()">
        <div class="upload-icon">🖼️</div>
        <p>Klik untuk upload gambar<br><span style="font-size:.8rem;">JPG, PNG, GIF, WEBP – maks 5MB</span></p>
      </div>
      <input type="file" id="uploadInput" accept="image/*" onchange="handleUpload(event)">
      <img id="mediaPreview" class="media-preview"
        src="${hasMedia ? selectedMediaUrl : ""}" alt="preview"
        style="display:${hasMedia ? "block" : "none"}">
      <button class="media-clear" id="mediaClearBtn"
        style="display:${hasMedia ? "inline-block" : "none"}"
        onclick="clearMedia()">✕ Hapus gambar</button>`;
  }
}

// --- Tenor Search ---
async function searchTenorGif() {
  const inp = document.getElementById("gifSearchInput");
  if (!inp) return;
  const term = inp.value.trim();
  if (!term) return;

  const grid = document.getElementById("gifGrid");
  grid.innerHTML =
    '<p class="gif-loading" style="grid-column:1/-1">nyari GIF... 🐱</p>';
  tenorResults = [];

  // Coba Tenor API v2
  try {
    const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(term)}&key=${TENOR_KEY}&limit=12&media_filter=gif,tinygif&contentfilter=medium`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("v2 fail");
    const data = await res.json();
    if (data.results?.length > 0) {
      tenorResults = data.results
        .map((r) => ({
          preview: r.media_formats?.tinygif?.url || r.media_formats?.gif?.url,
          full: r.media_formats?.gif?.url || r.media_formats?.tinygif?.url,
          title: r.title || "",
        }))
        .filter((g) => g.preview && g.full);
      renderTenorGrid(tenorResults);
      return;
    }
  } catch (_) {
    /* lanjut ke fallback */
  }

  // Fallback: Tenor v1
  try {
    const url2 = `https://g.tenor.com/v1/search?q=${encodeURIComponent(term)}&key=${TENOR_FALLBACK_KEY}&limit=12&media_filter=minimal`;
    const res2 = await fetch(url2);
    if (!res2.ok) throw new Error("v1 fail");
    const data2 = await res2.json();
    if (data2.results?.length > 0) {
      tenorResults = data2.results
        .map((r) => ({
          preview: r.media?.[0]?.tinygif?.url,
          full: r.media?.[0]?.gif?.url || r.media?.[0]?.tinygif?.url,
          title: r.title || "",
        }))
        .filter((g) => g.preview && g.full);
      renderTenorGrid(tenorResults);
      return;
    }
  } catch (_) {
    /* lanjut ke error */
  }

  grid.innerHTML = `
    <p class="gif-error" style="grid-column:1/-1">
      gagal load GIF 😿<br>
      <span style="font-size:.78rem">coba kata lain, atau pakai tab Upload Gambar!</span>
    </p>`;
}

function renderTenorGrid(results) {
  const grid = document.getElementById("gifGrid");
  if (!grid) return;

  if (!results?.length) {
    grid.innerHTML =
      '<p class="gif-error" style="grid-column:1/-1">ngga nemu GIF-nya 😅 coba kata lain!</p>';
    return;
  }

  grid.innerHTML = "";
  results.forEach((g) => {
    const img = document.createElement("img");
    img.src = g.preview;
    img.title = g.title;
    img.loading = "lazy";
    img.alt = g.title || "GIF";
    if (selectedMediaUrl === g.full) img.classList.add("gif-selected");

    img.onclick = () => {
      grid
        .querySelectorAll("img")
        .forEach((i) => i.classList.remove("gif-selected"));
      img.classList.add("gif-selected");
      selectedMediaUrl = g.full;
      selectedMediaPreview = g.preview;
      selectedMediaType = "gif";
      answers[currentQ] = { url: g.full, mediaType: "gif", display: g.preview };
      document.getElementById("quizNextBtn").disabled = false;
      showSelectedBadge();
    };

    grid.appendChild(img);
  });
}

function showSelectedBadge() {
  const el = document.getElementById("gifSelectedPreview");
  if (!el || !selectedMediaUrl) return;
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
      <img src="${selectedMediaPreview || selectedMediaUrl}"
        style="width:54px;height:54px;border-radius:8px;object-fit:cover;border:2px solid var(--mint);">
      <span style="font-family:'Boogaloo',cursive;font-size:.9rem;color:var(--mint);">✅ GIF terpilih!</span>
    </div>`;
}

// --- Upload ---
function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert("Gambarnya kegedean, max 5MB ya! 😅");
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    const url = ev.target.result;
    selectedMediaUrl = url;
    selectedMediaPreview = url;
    selectedMediaType = "image";
    answers[currentQ] = { url, mediaType: "image", display: url };

    const prev = document.getElementById("mediaPreview");
    if (prev) {
      prev.src = url;
      prev.style.display = "block";
    }
    const clr = document.getElementById("mediaClearBtn");
    if (clr) clr.style.display = "inline-block";
    document.getElementById("quizNextBtn").disabled = false;
  };
  reader.readAsDataURL(file);
}

function clearMedia() {
  selectedMediaUrl = null;
  selectedMediaPreview = null;
  answers[currentQ] = null;

  const prev = document.getElementById("mediaPreview");
  if (prev) {
    prev.src = "";
    prev.style.display = "none";
  }
  const clr = document.getElementById("mediaClearBtn");
  if (clr) clr.style.display = "none";
  document.getElementById("quizNextBtn").disabled = true;
}
