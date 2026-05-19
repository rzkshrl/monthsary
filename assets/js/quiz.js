// ======= QUIZ =======
// Tipe soal: 'choice' | 'text' | 'media'

const quizData = [
  {
    type: "choice",
    q: "1. siapa yang lebih bisa inget hal penting? (ngga pelupa)",
    opts: [
      "aku dong!",
      "kamu mungkinn?",
      "sama-sama pelupa kadang wkwk",
      "tergantung penting apa engga sii hehe",
    ],
  },
  {
    type: "choice",
    q: "2. siapa yang minum air putih lebih banyak?💧",
    opts: [
      "aku kadang bisa rajin minumm koo",
      "kamu sih bisa ngabisin seliter wkwk",
      "kita kayanya masi kurang hehee",
      "sama aja sii mungkin yaa",
    ],
  },
  {
    type: "choice",
    q: "3. siapa yang lebih sering/banyak jam tidur?😴",
    opts: [
      "WUIH JELAS AKU DONG",
      "kamu keknya jugaaa hehe",
      "sama-sama kebo WKWKWK",
      "tergantung hari sih, kadang aku, kadang kamu hehe",
    ],
  },
  {
    type: "choice",
    q: "4. siapa yang lebih manja? 🥹",
    opts: [
      "aku sii kan adekk",
      "kamu kadang!",
      "dua-duanya sama manjanya",
      "gantian tergantung mood WKWK",
    ],
  },
  {
    type: "text",
    q: "5. apa habit aku yang paling aneh menurut kamu, tapi aku pretend itu normal?",
    placeholder: "jujur ajaa ndapapaa wkwk",
  },
  {
    type: "media",
    q: "6. kalo aku jadi meme, meme apa yang aku banget?😂\ncari GIF di bawah atau upload gambar!",
  },
];

const shortQs = [
  "ngga pelupa?",
  "minum air putih?",
  "jam tidur?",
  "yang lebih manja?",
  "habit paling aneh?",
  "jadi meme apa?",
];

let currentQ = 0;
let answers = [];

function initQuiz() {
  currentQ = 0;
  answers = new Array(quizData.length).fill(null);
  document.getElementById("quizResult").style.display = "none";
  document.getElementById("quizCard").style.display = "block";
  renderQuestion();
}

function renderQuestion() {
  const d = quizData[currentQ];
  document.getElementById("quizProgress").textContent =
    `Pertanyaan ${currentQ + 1} dari ${quizData.length}`;
  document.getElementById("quizQuestion").textContent = d.q;

  const oc = document.getElementById("quizOptions");
  oc.innerHTML = "";

  const nb = document.getElementById("quizNextBtn");
  nb.textContent =
    currentQ === quizData.length - 1 ? "Lihat Hasil 🎉" : "Selanjutnya →";

  // Re-trigger quiz card animation on each question
  const qCard = document.getElementById("quizCard");
  if (qCard) {
    qCard.style.animation = "none";
    void qCard.offsetWidth;
    qCard.style.animation = "";
  }

  if (d.type === "choice") {
    nb.disabled = !answers[currentQ];
    d.opts.forEach((opt, idx) => {
      const b = document.createElement("button");
      b.className = "quiz-opt" + (answers[currentQ] === opt ? " selected" : "");
      b.textContent = opt;
      b.style.animationDelay = 0.12 + idx * 0.08 + "s";
      b.onclick = () => selectOption(b, opt);
      oc.appendChild(b);
    });
  } else if (d.type === "text") {
    nb.disabled = !answers[currentQ];
    const ta = document.createElement("textarea");
    ta.className = "quiz-textarea";
    ta.placeholder = d.placeholder || "Tulis jawabanmu di sini...";
    ta.value = answers[currentQ] || "";
    ta.oninput = () => {
      answers[currentQ] = ta.value.trim() || null;
      nb.disabled = !answers[currentQ];
    };
    oc.appendChild(ta);
    setTimeout(() => ta.focus(), 100);
  } else if (d.type === "media") {
    nb.disabled = !answers[currentQ];
    renderMediaQuestion(oc);
  }
}

function selectOption(btn, text) {
  document
    .querySelectorAll(".quiz-opt")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  answers[currentQ] = text;
  document.getElementById("quizNextBtn").disabled = false;
}

function nextQuestion() {
  if (!answers[currentQ]) return;
  if (currentQ < quizData.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  document.getElementById("quizCard").style.display = "none";
  document.getElementById("quizResult").style.display = "block";

  const rc = document.getElementById("resultCard");
  rc.innerHTML = "";

  answers.forEach((ans, i) => {
    const div = document.createElement("div");
    div.className = "result-item";

    const q = document.createElement("span");
    q.className = "result-q";
    q.textContent = shortQs[i];
    div.appendChild(q);

    if (ans && typeof ans === "object" && ans.url) {
      const img = document.createElement("img");
      img.className = "result-media";
      img.src = ans.display || ans.url;
      img.alt = "meme";
      div.appendChild(img);
    } else {
      const a = document.createElement("span");
      a.className = "result-a";
      a.textContent = String(ans || "").trim();
      div.appendChild(a);
    }

    rc.appendChild(div);
  });

  confettiBurst();
  window.scrollTo(0, 0);
}
