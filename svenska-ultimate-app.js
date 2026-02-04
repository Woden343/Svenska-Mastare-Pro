// ============================================
// SVENSKA MÄSTARE PRO - APPLICATION FINALE
// Version fusionnée optimisée
// + Support contentBlocks (dialogue/vocab/grammar/examples/exercises/checklist)
// ============================================

// ==================== STATE MANAGEMENT ====================

const STORAGE_KEY = "svenska-mastare-pro";

const appState = {
  currentTab: "learn",
  currentLevel: "A1",
  user: {
    xp: 0,
    level: "A1",
    streak: 0
  },
  settings: {
    sound: true,
    autoNext: false,
    dailyGoal: 20
  },
  progress: {
    lessonsCompleted: [],
    flashcardsLearned: [],
    stats: {
      questionsAnswered: 0,
      questionsCorrect: 0,
      grammarQuestions: 0,
      vocabularyQuestions: 0,
      studyTime: 0,
      lastStudyDate: null,
      dailyStreak: 0,
      bestStreak: 0
    },
    spacedRepetition: {}
  }
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(appState, parsed);

    // Hardening for older states
    appState.progress ||= { lessonsCompleted: [], flashcardsLearned: [], stats: {}, spacedRepetition: {} };
    appState.progress.lessonsCompleted ||= [];
    appState.progress.flashcardsLearned ||= [];
    appState.progress.stats ||= {
      questionsAnswered: 0, questionsCorrect: 0, grammarQuestions: 0, vocabularyQuestions: 0,
      studyTime: 0, lastStudyDate: null, dailyStreak: 0, bestStreak: 0
    };
    appState.progress.spacedRepetition ||= {};
    appState.settings ||= { sound: true, autoNext: false, dailyGoal: 20 };
    appState.user ||= { xp: 0, level: "A1", streak: 0 };
  }
}

function toast(msg) {
  const el = document.getElementById("toast");
  const txt = document.getElementById("toast-text");
  if (!el || !txt) return;
  txt.textContent = msg;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 1800);
}

function updateHeaderUI() {
  const xp = document.getElementById("ui-xp");
  const level = document.getElementById("ui-level");
  const streak = document.getElementById("ui-streak");
  const goal = document.getElementById("ui-goal");
  const prog = document.getElementById("ui-progress");

  if (xp) xp.textContent = String(appState.user.xp || 0);
  if (level) level.textContent = String(appState.currentLevel || "A1");
  if (streak) streak.textContent = `${appState.progress.stats.dailyStreak || 0} jour`;
  if (goal) goal.textContent = String(appState.settings.dailyGoal || 20);

  // Progress = % leçons complétées sur le niveau actuel
  const lessons = LESSONS[appState.currentLevel] || [];
  const done = lessons.filter(l => appState.progress.lessonsCompleted.includes(l.id)).length;
  const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  if (prog) prog.textContent = `${percent}%`;
}

// ==================== NAVIGATION ====================

function showTab(tabName) {
  appState.currentTab = tabName;
  saveState();

  // Tabs styling
  ["learn","practice","flashcards","dialogue","progress"].forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    const content = document.getElementById(`content-${t}`);
    if (btn) {
      btn.classList.toggle("tab-active", t === tabName);
      btn.classList.toggle("tab-inactive", t !== tabName);
    }
    if (content) content.classList.toggle("hidden", t !== tabName);
  });

  if (tabName === "learn") renderLearn();
  if (tabName === "practice") renderPractice();
  if (tabName === "flashcards") renderFlashcards();
  if (tabName === "dialogue") renderDialogueTab();
  if (tabName === "progress") renderProgress();

  updateHeaderUI();
}

// ==================== AUDIO ====================

function playLessonAudio(text) {
  if (!appState.settings.sound) {
    toast("Audio désactivé dans les paramètres");
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "sv-SE";
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } catch (e) {
    toast("Audio non disponible sur ce navigateur");
  }
}

// ==================== LESSON CONTENTBLOCKS (NEW) ====================
// Format: lesson.contentBlocks = [{ type, title, ... }]
// Types supported: dialogue, vocab, pronunciation, grammar, examples, exercises, checklist

function escHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function encodeSV(str) {
  return encodeURIComponent(String(str || ""));
}

function playSVTextEncoded(encoded) {
  playLessonAudio(decodeURIComponent(encoded));
}

function renderLessonBlocksHTML(lesson) {
  const blocks = lesson.contentBlocks || [];
  const section = (title, inner) => `
    <div class="mt-4">
      <h4 class="text-lg font-bold text-slate-800 mb-2">${escHtml(title || "")}</h4>
      <div class="space-y-2">${inner}</div>
    </div>
  `;

  let out = "";
  for (const b of blocks) {
    if (!b) continue;

    if (b.type === "dialogue") {
      const inner = (b.lines || []).map(l => `
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div class="flex items-start gap-2">
            <button class="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 transition"
              onclick="playSVTextEncoded('${encodeSV(l.sv)}')" title="Écouter">🔊</button>
            <div class="flex-1">
              <div class="font-semibold text-slate-900">${escHtml(l.sv || "")} <span class="font-normal text-slate-600">(${escHtml(l.pron || "")})</span></div>
              <div class="text-slate-600 italic">${escHtml(l.fr || "")}</div>
            </div>
          </div>
        </div>
      `).join("");
      out += section(b.title || "Dialogue", inner);
      continue;
    }

    if (b.type === "vocab") {
      const inner = (b.items || []).map(i => `
        <div class="flex items-start justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl">
          <div class="flex-1">
            <div class="font-semibold text-slate-900">${escHtml(i.sv || "")} <span class="font-normal text-slate-600">(${escHtml(i.pron || "")})</span></div>
            <div class="text-slate-600">${escHtml(i.fr || "")}</div>
          </div>
          <button class="shrink-0 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 transition"
            onclick="playSVTextEncoded('${encodeSV(i.sv)}')" title="Écouter">🔊</button>
        </div>
      `).join("");
      out += section(b.title || "Vocabulaire", inner);
      continue;
    }

    if (b.type === "examples") {
      const inner = (b.items || []).map(e => `
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div class="flex items-start gap-2">
            <button class="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 transition"
              onclick="playSVTextEncoded('${encodeSV(e.sv)}')" title="Écouter">🔊</button>
            <div class="flex-1">
              <div class="font-semibold text-slate-900">${escHtml(e.sv || "")} <span class="font-normal text-slate-600">(${escHtml(e.pron || "")})</span></div>
              <div class="text-slate-600">${escHtml(e.fr || "")}</div>
            </div>
          </div>
        </div>
      `).join("");
      out += section(b.title || "Exemples", inner);
      continue;
    }

    if (b.type === "exercises" || b.type === "checklist") {
      const inner = `
        <ul class="list-disc pl-6 space-y-1 text-slate-700">
          ${(b.items || []).map(x => `<li>${escHtml(x)}</li>`).join("")}
        </ul>
      `;
      out += section(b.title || (b.type === "exercises" ? "Exercices" : "Checklist"), inner);
      continue;
    }

    if (b.type === "grammar" || b.type === "pronunciation") {
      out += section(b.title || "Explications", `<div class="lesson-content">${b.html || ""}</div>`);
      continue;
    }
  }

  if (!out) out = `<div class="text-slate-600">Contenu de leçon indisponible.</div>`;
  return out;
}

function renderLessonHTML(lesson) {
  if (lesson && Array.isArray(lesson.contentBlocks)) return renderLessonBlocksHTML(lesson);
  return `<div class="lesson-content prose max-w-none">${lesson.content || ""}</div>`;
}

// ==================== LEARN TAB ====================

function renderLearn() {
  const container = document.getElementById("content-learn");
  const lessons = LESSONS[appState.currentLevel] || [];

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h3 class="text-2xl font-extrabold text-slate-800">Leçons académiques</h3>
        <p class="text-slate-600">Contenu théorique complet avec exemples</p>
      </div>
      <div class="min-w-[200px]">
        <select id="level-selector" class="w-full p-3 border-2 border-slate-300 rounded-xl focus-ring">
          <option value="A1" ${appState.currentLevel === "A1" ? "selected" : ""}>A1 - Débutant</option>
          <option value="A2" ${appState.currentLevel === "A2" ? "selected" : ""}>A2 - Élémentaire</option>
          <option value="B1" ${appState.currentLevel === "B1" ? "selected" : ""}>B1 - Intermédiaire</option>
          <option value="B2" ${appState.currentLevel === "B2" ? "selected" : ""}>B2 - Intermédiaire Avancé</option>
          <option value="C1" ${appState.currentLevel === "C1" ? "selected" : ""}>C1 - Avancé</option>
          <option value="C2" ${appState.currentLevel === "C2" ? "selected" : ""}>C2 - Maîtrise</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="lessons-grid">
      ${lessons.map(lesson => {
        const isCompleted = appState.progress.lessonsCompleted.includes(lesson.id);
        return `
          <button onclick="openLesson('${lesson.id}')" class="card text-left bg-white border-2 border-slate-200 rounded-xl p-5 hover:border-blue-400 transition">
            <div class="flex items-start justify-between mb-2">
              <div class="text-3xl">${lesson.icon || "📘"}</div>
              <div class="text-xl">${isCompleted ? "✅" : "⬜"}</div>
            </div>
            <div class="text-xs text-blue-600 font-semibold mb-1">${lesson.category || ""}</div>
            <h4 class="font-bold text-slate-800 mb-2">${lesson.title}</h4>
            <div class="text-xs text-slate-500">⏱️ ${lesson.duration || ""}</div>
          </button>
        `;
      }).join("")}
    </div>
  `;

  document.getElementById("level-selector").addEventListener("change", (e) => {
    appState.currentLevel = e.target.value;
    appState.user.level = e.target.value;
    saveState();
    updateHeaderUI();
    renderLearn();
  });
}

function openLesson(lessonId) {
  const lessons = LESSONS[appState.currentLevel] || [];
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  const isCompleted = appState.progress.lessonsCompleted.includes(lessonId);

  const modal = document.createElement("div");
  modal.id = "lesson-modal";
  modal.className = "fixed inset-0 z-50 overflow-y-auto";
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeLessonModal()"></div>
    <div class="relative max-w-4xl mx-auto mt-10 mb-10 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
        <div>
          <div class="text-xs text-blue-100">${appState.currentLevel} • ${lesson.category || ""}</div>
          <h3 class="font-extrabold text-xl">${lesson.title}</h3>
        </div>
        <button onclick="closeLessonModal()" class="p-2 hover:bg-white/15 rounded-lg">✕</button>
      </div>

      <div class="p-6 space-y-4">
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <div class="text-sm text-slate-600">⏱️ ${lesson.duration || ""}</div>
          <div class="flex gap-2">
            <button onclick="playLessonAudio('${(lesson.title || "").replaceAll("'", "\\'")}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              🔊 Audio
            </button>
            <button onclick="toggleLessonComplete('${lessonId}')" class="px-4 py-2 ${isCompleted ? "bg-slate-700" : "bg-green-600"} text-white rounded-lg hover:opacity-90 transition">
              ${isCompleted ? "↩️ Non terminée" : "✅ Terminée"}
            </button>
          </div>
        </div>

        ${renderLessonHTML(lesson)}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeLessonModal() {
  const modal = document.getElementById("lesson-modal");
  if (modal) modal.remove();
  renderLearn();
}

function toggleLessonComplete(lessonId) {
  const index = appState.progress.lessonsCompleted.indexOf(lessonId);
  if (index > -1) {
    appState.progress.lessonsCompleted.splice(index, 1);
  } else {
    appState.progress.lessonsCompleted.push(lessonId);
    appState.user.xp += 50;
    toast("🎉 +50 XP pour la leçon complétée !");
  }
  saveState();
  updateHeaderUI();
  closeLessonModal();
}

// ==================== PRACTICE TAB ====================
// (inchangé - ton code original utilise QUESTION_BANK)

let sessionQuestions = [];
let sessionIndex = 0;
let sessionCorrect = 0;
let sessionStartTime = null;

function renderPractice() {
  const container = document.getElementById("content-practice");
  container.innerHTML = `
    <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Modes d'entraînement</h3>
    <p class="text-slate-600 mb-6">Quiz grammaire & vocabulaire avec explications</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <button onclick="startMode('quick')" class="card p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition">
        <div class="text-3xl mb-2">⚡</div>
        <h4 class="font-bold text-slate-800 mb-1">Session Rapide</h4>
        <p class="text-xs text-slate-600">10 questions mixtes</p>
      </button>

      <button onclick="startMode('grammar')" class="card p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl hover:border-emerald-400 transition">
        <div class="text-3xl mb-2">📚</div>
        <h4 class="font-bold text-slate-800 mb-1">Grammaire</h4>
        <p class="text-xs text-slate-600">Ciblage grammaire</p>
      </button>

      <button onclick="startMode('vocabulary')" class="card p-5 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl hover:border-amber-400 transition">
        <div class="text-3xl mb-2">💬</div>
        <h4 class="font-bold text-slate-800 mb-1">Vocabulaire</h4>
        <p class="text-xs text-slate-600">Mots & expressions</p>
      </button>

      <button onclick="startMode('review')" class="card p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition">
        <div class="text-3xl mb-2">🔄</div>
        <h4 class="font-bold text-slate-800 mb-1">Révision</h4>
        <p class="text-xs text-slate-600">Répétition espacée</p>
      </button>
    </div>

    <div id="quiz-area" class="mt-6"></div>
  `;
}

function pickRandom(arr, n) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function startMode(mode) {
  const bank = QUESTION_BANK[appState.currentLevel] || { grammar: [], vocabulary: [] };
  let pool = [];
  if (mode === "quick") pool = [...bank.grammar, ...bank.vocabulary];
  if (mode === "grammar") pool = [...bank.grammar];
  if (mode === "vocabulary") pool = [...bank.vocabulary];

  if (mode === "review") {
    // fallback simple : mélange tout si pas de SRS
    pool = [...bank.grammar, ...bank.vocabulary];
  }

  if (!pool.length) {
    toast("Pas de questions disponibles pour ce niveau.");
    return;
  }

  sessionQuestions = pickRandom(pool, Math.min(10, pool.length));
  sessionIndex = 0;
  sessionCorrect = 0;
  sessionStartTime = Date.now();
  renderQuestion();
}

function renderQuestion() {
  const area = document.getElementById("quiz-area");
  const q = sessionQuestions[sessionIndex];
  if (!q) return;

  const progress = `${sessionIndex + 1}/${sessionQuestions.length}`;
  const optionsHtml = (q.type === "multiple-choice" && Array.isArray(q.options))
    ? q.options.map((opt, idx) => `
        <button class="w-full text-left p-3 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition"
          onclick="answerChoice(${idx})">${opt}</button>
      `).join("")
    : `
      <input id="text-answer" class="w-full p-3 border-2 border-slate-200 rounded-xl" placeholder="Votre réponse…" />
      <button class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl" onclick="answerText()">Valider</button>
    `;

  area.innerHTML = `
    <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
      <div class="flex items-center justify-between mb-2">
        <div class="text-sm text-slate-600">${progress}</div>
        <div class="text-sm font-semibold text-slate-700">${q.category || ""}</div>
      </div>
      <h4 class="font-bold text-slate-900 mb-4">${q.question}</h4>
      <div class="space-y-2">${optionsHtml}</div>
      <div id="explain" class="mt-4 hidden"></div>
    </div>
  `;
}

function nextQuestion() {
  sessionIndex++;
  if (sessionIndex >= sessionQuestions.length) return endSession();
  renderQuestion();
}

function endSession() {
  const area = document.getElementById("quiz-area");
  const durationMin = Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000));

  appState.progress.stats.questionsAnswered += sessionQuestions.length;
  appState.progress.stats.questionsCorrect += sessionCorrect;
  appState.progress.stats.studyTime += durationMin;

  saveState();
  updateHeaderUI();

  area.innerHTML = `
    <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
      <h4 class="text-xl font-extrabold text-slate-800 mb-2">Session terminée ✅</h4>
      <p class="text-slate-600 mb-4">Score : <strong>${sessionCorrect}/${sessionQuestions.length}</strong> • Temps : ${durationMin} min</p>
      <button onclick="renderPractice()" class="px-4 py-2 bg-blue-600 text-white rounded-xl">Revenir aux modes</button>
    </div>
  `;
}

function answerChoice(idx) {
  const q = sessionQuestions[sessionIndex];
  const ok = idx === q.correct;
  if (ok) {
    sessionCorrect++;
    appState.user.xp += (q.points || 10);
  }

  const explain = document.getElementById("explain");
  explain.classList.remove("hidden");
  explain.innerHTML = `
    <div class="p-4 rounded-xl ${ok ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}">
      <div class="font-bold mb-1">${ok ? "✅ Correct" : "❌ Incorrect"}</div>
      <div class="text-slate-700">${q.explanation || ""}</div>
      ${q.hint ? `<div class="text-sm text-slate-500 mt-2">💡 Indice : ${q.hint}</div>` : ""}
      <button class="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl" onclick="nextQuestion()">
        ${sessionIndex + 1 === sessionQuestions.length ? "Terminer" : "Suivant"}
      </button>
    </div>
  `;

  saveState();
  updateHeaderUI();
}

function answerText() {
  const q = sessionQuestions[sessionIndex];
  const input = document.getElementById("text-answer");
  const val = (input.value || "").trim().toLowerCase();
  const answers = (q.correctAnswers || []).map(x => String(x).toLowerCase());
  const ok = answers.includes(val);

  if (ok) {
    sessionCorrect++;
    appState.user.xp += (q.points || 10);
  }

  const explain = document.getElementById("explain");
  explain.classList.remove("hidden");
  explain.innerHTML = `
    <div class="p-4 rounded-xl ${ok ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}">
      <div class="font-bold mb-1">${ok ? "✅ Correct" : "❌ Incorrect"}</div>
      <div class="text-slate-700">${q.explanation || ""}</div>
      <button class="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl" onclick="nextQuestion()">
        ${sessionIndex + 1 === sessionQuestions.length ? "Terminer" : "Suivant"}
      </button>
    </div>
  `;

  saveState();
  updateHeaderUI();
}

// ==================== FLASHCARDS TAB ====================

let currentCategory = "basics";
let currentCardIndex = 0;

function renderFlashcards() {
  const container = document.getElementById("content-flashcards");
  const categories = Object.keys(FLASHCARDS || {});
  if (!categories.length) {
    container.innerHTML = `<p class="text-slate-600">Aucune flashcard.</p>`;
    return;
  }

  if (!categories.includes(currentCategory)) currentCategory = categories[0];

  const cards = FLASHCARDS[currentCategory] || [];
  const card = cards[currentCardIndex] || { swedish: "", french: "" };

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h3 class="text-2xl font-extrabold text-slate-800">Flashcards</h3>
        <p class="text-slate-600">Clique pour retourner la carte</p>
      </div>
      <div class="min-w-[220px]">
        <select id="flashcat" class="w-full p-3 border-2 border-slate-300 rounded-xl focus-ring">
          ${categories.map(c => `<option value="${c}" ${c===currentCategory?"selected":""}>${c}</option>`).join("")}
        </select>
      </div>
    </div>

    <div class="flip-card ${appState.progress.flashcardsLearned.includes(card.swedish) ? "opacity-90" : ""}" onclick="toggleFlip()">
      <div class="flip-card-inner" id="flip-inner">
        <div class="flip-card-front bg-white border-2 border-slate-200">
          <div class="text-4xl font-extrabold text-slate-800">${card.swedish}</div>
          <div class="mt-3 text-slate-500 text-sm">Clique pour voir la traduction</div>
          <div class="mt-4">
            <button class="px-3 py-2 bg-blue-600 text-white rounded-xl" onclick="event.stopPropagation(); playLessonAudio('${card.swedish.replaceAll("'", "\\'")}')">🔊 Écouter</button>
          </div>
        </div>
        <div class="flip-card-back bg-slate-900 text-white">
          <div class="text-3xl font-extrabold">${card.french}</div>
          <div class="mt-3 text-white/80 text-sm">${card.category || ""}</div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6">
      <button onclick="prevCard()" class="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl">⬅️ Précédente</button>
      <div class="text-sm text-slate-600">${currentCardIndex + 1}/${cards.length}</div>
      <button onclick="nextCard()" class="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl">Suivante ➡️</button>
    </div>
  `;

  document.getElementById("flashcat").onchange = (e) => {
    currentCategory = e.target.value;
    currentCardIndex = 0;
    saveState();
    renderFlashcards();
  };
}

function toggleFlip() {
  const inner = document.getElementById("flip-inner");
  if (!inner) return;
  inner.parentElement.classList.toggle("flipped");
  const cards = FLASHCARDS[currentCategory] || [];
  const card = cards[currentCardIndex];
  if (card && !appState.progress.flashcardsLearned.includes(card.swedish)) {
    appState.progress.flashcardsLearned.push(card.swedish);
    appState.user.xp += 2;
    saveState();
    updateHeaderUI();
  }
}

function prevCard() {
  const cards = FLASHCARDS[currentCategory] || [];
  currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
  renderFlashcards();
}

function nextCard() {
  const cards = FLASHCARDS[currentCategory] || [];
  currentCardIndex = (currentCardIndex + 1) % cards.length;
  renderFlashcards();
}

// ==================== DIALOGUE TAB ====================

function renderDialogueTab() {
  const container = document.getElementById("content-dialogue");
  const scenarios = Object.keys(DIALOGUE_SCENARIOS || {});
  const current = scenarios[0];

  if (!current) {
    container.innerHTML = `<p class="text-slate-600">Aucun scénario.</p>`;
    return;
  }

  container.innerHTML = `
    <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Dialogue</h3>
    <p class="text-slate-600 mb-4">Scénarios simples (réponses simulées)</p>

    <div class="flex flex-wrap gap-2 mb-4">
      ${scenarios.map(s => `
        <button class="px-3 py-2 rounded-xl border-2 border-slate-200 bg-white" onclick="startScenario('${s}')">${s}</button>
      `).join("")}
    </div>

    <div id="chat-area" class="bg-white border-2 border-slate-200 rounded-2xl p-4 min-h-[280px]"></div>

    <div class="mt-4 flex gap-2">
      <input id="chat-input" class="flex-1 p-3 border-2 border-slate-200 rounded-xl" placeholder="Écris en suédois…" />
      <button onclick="sendChat()" class="px-4 py-2 bg-blue-600 text-white rounded-xl">Envoyer</button>
    </div>
  `;

  startScenario(current);
}

let currentScenarioKey = null;

function startScenario(key) {
  currentScenarioKey = key;
  const area = document.getElementById("chat-area");
  const s = DIALOGUE_SCENARIOS[key];
  if (!area || !s) return;
  area.innerHTML = s.messages.map(m => `
    <div class="message-bubble ${m.role === "user" ? "message-user" : "message-ai"}">
      ${escHtml(m.text)}
    </div>
  `).join("");
}

function sendChat() {
  const input = document.getElementById("chat-input");
  const area = document.getElementById("chat-area");
  if (!input || !area) return;
  const text = input.value.trim();
  if (!text) return;

  area.innerHTML += `<div class="message-bubble message-user">${escHtml(text)}</div>`;
  input.value = "";

  // Réponse simulée
  setTimeout(() => {
    area.innerHTML += `<div class="message-bubble message-ai">Bra! (bra) — continue 😊</div>`;
    area.scrollTop = area.scrollHeight;
  }, 350);

  area.scrollTop = area.scrollHeight;
}

// ==================== PROGRESS TAB ====================

function renderProgress() {
  const container = document.getElementById("content-progress");
  const lessons = LESSONS[appState.currentLevel] || [];
  const done = lessons.filter(l => appState.progress.lessonsCompleted.includes(l.id)).length;
  const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;

  container.innerHTML = `
    <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Progression</h3>
    <p class="text-slate-600 mb-6">Suivi simple de ta progression</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div class="text-slate-500 text-sm">XP</div>
        <div class="text-3xl font-extrabold text-slate-800">${appState.user.xp}</div>
      </div>
      <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div class="text-slate-500 text-sm">Leçons complétées (${appState.currentLevel})</div>
        <div class="text-3xl font-extrabold text-slate-800">${done}/${lessons.length}</div>
      </div>
      <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div class="text-slate-500 text-sm">Progression</div>
        <div class="text-3xl font-extrabold text-slate-800">${percent}%</div>
      </div>
    </div>

    <div class="mt-6 bg-white border-2 border-slate-200 rounded-2xl p-5">
      <h4 class="font-bold text-slate-800 mb-2">Stats quiz</h4>
      <div class="text-slate-700">Questions répondues : <strong>${appState.progress.stats.questionsAnswered}</strong></div>
      <div class="text-slate-700">Bonnes réponses : <strong>${appState.progress.stats.questionsCorrect}</strong></div>
    </div>
  `;
}

// ==================== INIT ====================

window.addEventListener("load", () => {
  loadState();

  // Bind tabs
  const btnLearn = document.getElementById("tab-learn");
  const btnPractice = document.getElementById("tab-practice");
  const btnFlashcards = document.getElementById("tab-flashcards");
  const btnDialogue = document.getElementById("tab-dialogue");
  const btnProgress = document.getElementById("tab-progress");

  if (btnLearn) btnLearn.onclick = () => showTab("learn");
  if (btnPractice) btnPractice.onclick = () => showTab("practice");
  if (btnFlashcards) btnFlashcards.onclick = () => showTab("flashcards");
  if (btnDialogue) btnDialogue.onclick = () => showTab("dialogue");
  if (btnProgress) btnProgress.onclick = () => showTab("progress");

  updateHeaderUI();
  showTab(appState.currentTab || "learn");
});