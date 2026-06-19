const GIFS = {
  "cat-love": "assets/gif/love.gif",
  "cat-happy": "assets/gif/peachy-yay.gif",
  "cat-celebrate": "assets/gif/happy-cat-cat.gif",
  "cat-heart": "assets/gif/pa-ti-bb.gif",
};

function initGifs() {
  document.querySelectorAll(".gif-asset[data-gif]").forEach((el) => {
    el.src = GIFS[el.dataset.gif] || "";
  });
}

window.addEventListener("DOMContentLoaded", initGifs);
