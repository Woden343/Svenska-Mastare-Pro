// svenska-features.js
// Phase 2 (Lecons) + Phase 3 (Quiz + XP) + Phase 4 (Flashcards)
// Offline, sans dependances

// -------------------- HELPERS --------------------

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
function escapeAttr(s) {
  return escapeHtml(s).replaceAll('"', "&quot;");
}

// -------------------- AUDIO (gratuit) --------------------

function speakSv(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "sv-SE";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    alert("Audio non disponible sur ce navigateur.");
  }
}

// =========================================================
// PHASE 2 : LEARN (Lecons)
// =========================================================

function renderLearn() {
  const levelSelect = document.getElementById("level-selector");

  // sync select
  if (levelSelect && levelSelect.value !== (appState.user.level || "A1")) {
    levelSelect.value = appState.user.level || "A1";
  }

  // bind once
  if (levelSelect && !levelSelect.dataset.bound) {
    levelSelect.dataset.bound = "1";
    levelSelect.addEventListener("change", () => {
      appState.user.level = levelSelect.value;
      saveState();
      updateHeaderUI();
      renderLearn();
    });
  }

  const level = appState.user.level || "A1";
  const list = (LESSONS[level] || []).slice();
  const grid = document.getElementById("lessons-grid");
  const container = document.getElementById("content-learn");
  if (!grid || !container) return;

  if (!list.length) {
    grid.innerHTML = `<div class="text-slate-600">Aucune lecon disponible pour ${escapeHtml(level)}.</div>`;
  } else {
    grid.innerHTML = list
      .map((lesson) => {
        const done = isLessonCompleted(lesson.id);
        return `
        <button
          class="text-left bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition focus-ring"
          onclick="openLesson('${escapeAttr(lesson.id)}')"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs text-slate-500">${escapeHtml(lesson.id)}</div>
              <div class="font-extrabold text-slate-800 mt-1">${escapeHtml(lesson.title)}</div>
              <div class="text-xs text-slate-500 mt-2">${(lesson.tags || []).map(t => `#${escapeHtml(t)}`).join(" ")}</div>
            </div>
            <div class="text-xl" aria-hidden="true">${done ? "✅" : "⬜"}</div>
          </div>
        </button>`;
      })
      .join("");
  }

  // create modal if missing
  if (!document.getElementById("lesson-modal")) {
    container.insertAdjacentHTML("beforeend", lessonModalHtml());
    bindLessonModalEvents();
  }
}

function lessonModalHtml() {
  return `
  <div id="lesson-modal" class="hidden fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative max-w-3xl mx-auto mt-10 sm:mt-16 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between gap-3">
        <div>
          <div id="lesson-modal-id" class="text-xs text-blue-100"></div>
          <div id="lesson-modal-title" class="font-extrabold text-lg"></div>
        </div>
        <button id="lesson-modal-close" class="p-2 hover:bg-white/15 rounded-lg transition focus-ring" aria-label="Fermer">✕</button>
      </div>

      <div class="p-6 space-y-5 max-h-[70vh] overflow-auto">
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <div id="lesson-modal-tags" class="text-xs text-slate-500"></div>
          <div class="flex gap-2">
            <button id="lesson-audio" class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition focus-ring">🔊 Audio</button>
            <button id="lesson-toggle-done" class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition focus-ring">✅ Termine</button>
          </div>
        </div>

        <div id="lesson-modal-body" class="space-y-4"></div>
      </div>
    </div>
  </div>`;
}

function bindLessonModalEvents() {
  const modal = document.getElementById("lesson-modal");
  const closeBtn = document.getElementById("lesson-modal-close");
  if (closeBtn) closeBtn.onclick = () => modal.classList.add("hidden");
}

function openLesson(lessonId) {
  const level = appState.user.level || "A1";
  const lesson = (LESSONS[level] || []).find((l) => l.id === lessonId);
  if (!lesson) return;

  const modal = document.getElementById("lesson-modal");
  document.getElementById("lesson-modal-id").textContent = lesson.id;
  document.getElementById("lesson-modal-title").textContent = lesson.title;
  document.getElementById("lesson-modal-tags").textContent = (lesson.tags || []).map(t => `#${t}`).join(" ");

  const done = isLessonCompleted(lesson.id);
  document.getElementById("lesson-toggle-done").textContent = done
    ? "↩️ Marquer non termine"
    : "✅ Marquer termine";

  const body = document.getElementById("lesson-modal-body");
  body.innerHTML = (lesson.sections || [])
    .map((sec) => {
      if (sec.type === "examples") {
        const ex = (sec.examples || [])
          .map((e) => `
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div class="font-semibold text-slate-800">${escapeHtml(e.sv)}</div>
              <div class="text-sm text-slate-600">${escapeHtml(e.fr)}</div>
            </div>
          `)
          .join("");

        return `
          <section>
            <h4 class="font-extrabold text-slate-800">${escapeHtml(sec.title || "Exemples")}</h4>
            <div class="mt-2 space-y-2">${ex}</div>
          </section>
        `;
      }

      return `
        <section>
          <h4 class="font-extrabold text-slate-800">${escapeHtml(sec.title || "Theorie")}</h4>
          <p class="text-slate-700 mt-2 leading-relaxed">${escapeHtml(sec.text || "")}</p>
        </section>
      `;
    })
    .join("");

  document.getElementById("lesson-audio").onclick = () => {
    const chunks = [];
    chunks.push(lesson.title);
    (lesson.sections || []).forEach((sec) => {
      if (sec.text) chunks.push(sec.text);
      if (sec.examples) sec.examples.forEach((e) => chunks.push(e.sv));
    });
    speakSv(chunks.join(". "));
  };

  document.getElementById("lesson-toggle-done").onclick = () => {
    toggleLessonCompleted(lesson.id);
    updateHeaderUI();
    renderLearn();
    openLesson(lesson.id);
  };

  modal.classList.remove("hidden");
}

// =========================================================
// PHASE 3 : PRACTICE (Quiz + XP)
// =========================================================

// Etat session quiz (en RAM)
const quizSession = { mode: null, items: [], index: 0, score: 0 };

function renderPractice() {
  renderPracticeHome();
}

function renderPracticeHome() {
  const modes = document.getElementById("practice-modes");
  const area = document.getElementById("practice-area");
  if (!modes || !area) return;

  modes.innerHTML = `
    <button class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition text-left focus-ring"
      onclick="startQuiz('quick')">
      <div class="text-xl">⚡</div>
      <div class="font-extrabold mt-2">Session rapide</div>
      <div class="text-sm text-slate-600 mt-1">10 questions mixtes</div>
    </button>

    <button class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition text-left focus-ring"
      onclick="startQuiz('grammar')">
      <div class="text-xl">📖</div>
      <div class="font-extrabold mt-2">Grammaire</div>
      <div class="text-sm text-slate-600 mt-1">Focus regles</div>
    </button>

    <button class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition text-left focus-ring"
      onclick="startQuiz('vocab')">
      <div class="text-xl">💬</div>
      <div class="font-extrabold mt-2">Vocabulaire</div>
      <div class="text-sm text-slate-600 mt-1">Mots et expressions</div>
    </button>
  `;

  const answered = (appState.progress.quiz && appState.progress.quiz.answered) || 0;
  const correct = (appState.progress.quiz && appState.progress.quiz.correct) || 0;

  area.innerHTML = `
    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6">
      <div class="font-extrabold text-slate-800 text-lg">Pratiquer - Niveau ${escapeHtml(appState.user.level)}</div>
      <div class="text-slate-600 mt-1">
        Choisis un mode. Tu gagnes <b>+10 XP</b> si correct, <b>+2 XP</b> si incorrect.
      </div>
      <div class="mt-4 text-sm text-slate-500">
        Stats : ${answered} reponses • ${correct} correctes
      </div>
    </div>
  `;
}

function startQuiz(mode) {
  quizSession.mode = mode;
  quizSession.items = getQuestionsForMode(mode);
  quizSession.index = 0;
  quizSession.score = 0;

  if (!quizSession.items.length) {
    alert("Pas encore de questions pour ce niveau. Ajoute-en dans QUESTIONS.");
    return;
  }
  renderQuizQuestion();
}

function getQuestionsForMode(mode) {
  const level = appState.user.level || "A1";
  const pool = (QUESTIONS || []).filter((q) => q.level === level);

  if (mode === "quick") return shuffle(pool).slice(0, 10);
  if (mode === "grammar") return shuffle(pool.filter((q) => q.category === "grammar")).slice(0, 10);
  if (mode === "vocab") return shuffle(pool.filter((q) => q.category === "vocab")).slice(0, 10);
  return shuffle(pool).slice(0, 10);
}

function renderQuizQuestion() {
  const area = document.getElementById("practice-area");
  if (!area) return;

  const q = quizSession.items[quizSession.index];

  area.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm text-slate-500">
          Question ${quizSession.index + 1} / ${quizSession.items.length}
        </div>
        <div class="text-sm font-semibold text-slate-700">
          Score: ${quizSession.score}
        </div>
      </div>

      <div class="mt-3 text-xl font-extrabold text-slate-800">${escapeHtml(q.prompt)}</div>

      <div class="mt-4" id="quiz-answer-area"></div>

      <div class="mt-4 flex items-center justify-between gap-3">
        <button class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition focus-ring"
          onclick="quitQuiz()">
          ⬅ Quitter
        </button>
        <button id="btn-submit-quiz" class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition focus-ring">
          Valider
        </button>
      </div>

      <div class="mt-4 hidden" id="quiz-feedback"></div>
    </div>
  `;

  const answerArea = document.getElementById("quiz-answer-area");
  if (q.type === "mcq") {
    answerArea.innerHTML = (q.choices || [])
      .map((c) => `
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer mt-2">
          <input type="radio" name="quizChoice" value="${escapeAttr(c)}" />
          <span class="font-semibold">${escapeHtml(c)}</span>
        </label>
      `)
      .join("");
  } else {
    answerArea.innerHTML = `
      <label class="block text-sm font-semibold text-slate-700 mb-2">Ta reponse</label>
      <input id="quiz-free-input" class="w-full p-3 border-2 border-slate-300 rounded-xl focus-ring"
        placeholder="Ecris ta reponse..." />
      <p class="text-xs text-slate-500 mt-2">Astuce : pas sensible a la casse.</p>
    `;
  }

  document.getElementById("btn-submit-quiz").onclick = () => submitQuizAnswer();
}

function submitQuizAnswer() {
  const q = quizSession.items[quizSession.index];
  let userAnswer = "";

  if (q.type === "mcq") {
    const checked = document.querySelector('input[name="quizChoice"]:checked');
    if (!checked) return alert("Choisis une reponse.");
    userAnswer = checked.value;
  } else {
    const inp = document.getElementById("quiz-free-input");
    userAnswer = (inp.value || "").trim();
    if (!userAnswer) return alert("Ecris une reponse.");
  }

  const correct = isCorrectAnswer(q, userAnswer);

  if (!appState.progress.quiz) appState.progress.quiz = { answered: 0, correct: 0 };
  appState.progress.quiz.answered += 1;
  if (correct) appState.progress.quiz.correct += 1;

  if (correct) {
    appState.user.xp += 10;
    quizSession.score += 1;
  } else {
    appState.user.xp += 2;
  }

  saveState();
  updateHeaderUI();

  const fb = document.getElementById("quiz-feedback");
  fb.classList.remove("hidden");
  fb.innerHTML = `
    <div class="mt-4 p-4 rounded-2xl ${correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}">
      <div class="font-extrabold ${correct ? "text-green-800" : "text-red-800"}">
        ${correct ? "✅ Correct !" : "❌ Incorrect"}
      </div>
      <div class="text-slate-700 mt-2">
        <b>Bonne reponse :</b> ${escapeHtml(q.answer)}
      </div>
      ${q.explanation ? `<div class="text-slate-600 mt-2">${escapeHtml(q.explanation)}</div>` : ""}
      <div class="mt-3">
        <button class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition focus-ring"
          onclick="nextQuizQuestion()">
          Suivant ➜
        </button>
      </div>
    </div>
  `;
}

function nextQuizQuestion() {
  quizSession.index += 1;
  if (quizSession.index >= quizSession.items.length) renderQuizEnd();
  else renderQuizQuestion();
}

function renderQuizEnd() {
  const area = document.getElementById("practice-area");
  const total = quizSession.items.length;

  area.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div class="text-2xl font-extrabold text-slate-800">Session terminee 🎉</div>
      <div class="text-slate-600 mt-2">Score : <b>${quizSession.score}</b> / ${total}</div>
      <div class="text-slate-600 mt-1">XP total actuel : <b>${appState.user.xp}</b></div>
      <div class="mt-5 flex gap-2">
        <button class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition focus-ring"
          onclick="renderPracticeHome()">
          Retour aux modes
        </button>
        <button class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition focus-ring"
          onclick="startQuiz('${escapeAttr(quizSession.mode)}')">
          Rejouer
        </button>
      </div>
    </div>
  `;
}

function quitQuiz() {
  renderPracticeHome();
}

function isCorrectAnswer(q, userAnswer) {
  const ua = String(userAnswer || "").trim().toLowerCase();
  if (q.type === "mcq") return ua === String(q.answer).trim().toLowerCase();

  const expected = String(q.answer).trim().toLowerCase();
  const acc = (q.acceptable || []).map((x) => String(x).trim().toLowerCase());
  return ua === expected || acc.includes(ua);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

// =========================================================
// PHASE 4 : FLASHCARDS
// =========================================================

const flashSession = {
  category: null,
  index: 0,
  showingBack: false
};

function renderFlashcards() {
  const container = document.getElementById("content-flashcards");
  if (!container) return;

  // Créer l'UI si absente
  if (!document.getElementById("flashcards-root")) {
    container.innerHTML = `
      <div id="flashcards-root" class="space-y-4">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div class="text-sm text-slate-500">Flashcards</div>
              <div class="text-xl font-extrabold text-slate-800">Memoriser le vocabulaire</div>
            </div>

            <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
              <select id="flash-category" class="p-3 border-2 border-slate-300 rounded-xl focus-ring bg-white"></select>
              <button id="flash-audio" class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition focus-ring">🔊 Audio</button>
            </div>
          </div>

          <div class="mt-4 text-sm text-slate-500" id="flash-stats"></div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div class="text-sm text-slate-500 mb-3" id="flash-counter"></div>

          <button id="flash-card" class="w-full text-center rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition p-10 focus-ring">
            <div class="text-3xl font-extrabold text-slate-900" id="flash-front"></div>
            <div class="mt-4 text-lg text-slate-700 hidden" id="flash-back"></div>
            <div class="mt-6 text-xs text-slate-500">(Clique pour retourner)</div>
          </button>

          <div class="mt-5 flex items-center justify-between gap-2">
            <button id="flash-prev" class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition focus-ring">⬅ Precedent</button>
            <button id="flash-flip" class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition focus-ring">↩ Retourner</button>
            <button id="flash-next" class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition focus-ring">Suivant ➜</button>
          </div>
        </div>
      </div>
    `;

    bindFlashcardsEvents();
  }

  // Init catégorie par défaut
  const categories = Object.keys(FLASHCARDS || {});
  if (!categories.length) return;

  if (!flashSession.category) flashSession.category = categories[0];

  // Remplir le select
  const select = document.getElementById("flash-category");
  select.innerHTML = categories.map(c => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join("");
  select.value = flashSession.category;

  // Render carte
  renderFlashcardCard();
  renderFlashStats();
}

function ensureFlashProgress() {
  if (!appState.progress) appState.progress = {};
  if (!appState.progress.flashcards) {
    appState.progress.flashcards = { learned: [] }; // learned = liste de clés
  }
}

function flashKey(category, sv) {
  return `${category}||${sv}`;
}

function renderFlashStats() {
  ensureFlashProgress();
  const learned = appState.progress.flashcards.learned || [];
  const total = Object.values(FLASHCARDS || {}).reduce((acc, arr) => acc + (arr ? arr.length : 0), 0);

  const stats = document.getElementById("flash-stats");
  if (stats) stats.textContent = `Mots appris : ${learned.length} / ${total}`;
}

function renderFlashcardCard() {
  const list = (FLASHCARDS[flashSession.category] || []);
  if (!list.length) return;

  if (flashSession.index < 0) flashSession.index = 0;
  if (flashSession.index >= list.length) flashSession.index = list.length - 1;

  const item = list[flashSession.index];
  const counter = document.getElementById("flash-counter");
  if (counter) counter.textContent = `${flashSession.category} • Carte ${flashSession.index + 1} / ${list.length}`;

  const front = document.getElementById("flash-front");
  const back = document.getElementById("flash-back");

  if (front) front.textContent = item.sv;
  if (back) back.textContent = item.fr;

  flashSession.showingBack = false;
  if (back) back.classList.add("hidden");
}

function bindFlashcardsEvents() {
  const select = document.getElementById("flash-category");
  const card = document.getElementById("flash-card");
  const btnPrev = document.getElementById("flash-prev");
  const btnNext = document.getElementById("flash-next");
  const btnFlip = document.getElementById("flash-flip");
  const btnAudio = document.getElementById("flash-audio");

  if (select) {
    select.onchange = () => {
      flashSession.category = select.value;
      flashSession.index = 0;
      flashSession.showingBack = false;
      renderFlashcardCard();
      renderFlashStats();
    };
  }

  const flip = () => {
    const list = (FLASHCARDS[flashSession.category] || []);
    if (!list.length) return;
    const item = list[flashSession.index];

    const back = document.getElementById("flash-back");
    flashSession.showingBack = !flashSession.showingBack;

    if (flashSession.showingBack) {
      if (back) back.classList.remove("hidden");

      // Marquer comme appris quand on voit le verso
      ensureFlashProgress();
      const key = flashKey(flashSession.category, item.sv);
      const learned = appState.progress.flashcards.learned || (appState.progress.flashcards.learned = []);
      if (!learned.includes(key)) {
        learned.push(key);
        saveState();
        renderFlashStats();
      }
    } else {
      if (back) back.classList.add("hidden");
    }
  };

  if (card) card.onclick = flip;
  if (btnFlip) btnFlip.onclick = flip;

  if (btnPrev) {
    btnPrev.onclick = () => {
      flashSession.index -= 1;
      renderFlashcardCard();
    };
  }

  if (btnNext) {
    btnNext.onclick = () => {
      flashSession.index += 1;
      renderFlashcardCard();
    };
  }

  if (btnAudio) {
    btnAudio.onclick = () => {
      const list = (FLASHCARDS[flashSession.category] || []);
      if (!list.length) return;
      const item = list[flashSession.index];
      speakSv(item.sv);
    };
  }
}
