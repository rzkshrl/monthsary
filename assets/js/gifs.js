const GIFS = {
  "cat-love": "assets/gif/love.gif",
  "cat-curious": "assets/gif/lindo-gato-feliz.gif",
  "cat-happy": "assets/gif/peachy-yay.gif",
  "cat-sad": "assets/gif/sad-cat-sad-cat-meme.gif",
  "cat-celebrate": "assets/gif/happy-cat-cat.gif",
  "cat-heart": "assets/gif/pa-ti-bb.gif",
  "cat-judging": "assets/gif/sad-sad-cat.gif",
};

function initGifs() {
  document.querySelectorAll(".gif-asset[data-gif]").forEach((el) => {
    el.src = GIFS[el.dataset.gif] || "";
  });
}

window.addEventListener("DOMContentLoaded", initGifs);
