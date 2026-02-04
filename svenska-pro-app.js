// svenska-pro-app.js
// Moteur principal Svenska Mästar Pro
// Supporte content + contentBlocks (dialogue / vocab / grammar / exercises)
// Audio WebSpeech intégré

const STORAGE_KEY = "svenska-pro-state";

const appState = {
  currentTab: "learn",
  user: { xp: 0, level: "A1" },
  progress: {},
  settings: { sound: true }
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function loadState() {
  const s = localStorage.getItem(STORAGE_KEY);
  if (s) Object.assign(appState, JSON.parse(s));
}

// ================= AUDIO =================

function speakSV(text) {
  if (!appState.settings.sound) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "sv-SE";
  speechSynthesis.speak(u);
}

// ================= LEARN RENDER =================

function renderLearn() {
  const container = document.getElementById("content-learn");
  container.innerHTML = "";

  const level = appState.user.level || "A1";
  const lessons = LESSONS[level] || [];

  lessons.forEach(lesson => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4 mb-4";

    card.innerHTML = `
      <h3 class="text-xl font-bold mb-2">${lesson.icon || ""} ${lesson.title}</h3>
      <p class="text-sm opacity-70 mb-3">${lesson.duration || ""}</p>
      <button class="bg-blue-600 text-white px-3 py-1 rounded">Ouvrir</button>
      <div class="lesson-body hidden mt-4"></div>
    `;

    const btn = card.querySelector("button");
    const body = card.querySelector(".lesson-body");

    btn.onclick = () => {
      body.classList.toggle("hidden");
      renderLessonContent(body, lesson);
    };

    container.appendChild(card);
  });
}

// ================= BLOCKS =================

function renderLessonContent(target, lesson) {
  target.innerHTML = "";

  if (lesson.contentBlocks) {
    lesson.contentBlocks.forEach(block => {
      if (block.type === "dialogue") renderDialogue(target, block);
      if (block.type === "vocab") renderVocab(target, block);
      if (block.type === "grammar") renderGrammar(target, block);
      if (block.type === "examples") renderExamples(target, block);
      if (block.type === "exercises") renderExercises(target, block);
    });
  } else if (lesson.content) {
    target.innerHTML = lesson.content;
  }
}

// ================= BLOCK TYPES =================

function renderDialogue(parent, block) {
  const d = document.createElement("div");
  d.innerHTML = `<h4 class="font-bold mt-4 mb-2">${block.title}</h4>`;
  block.lines.forEach(l => {
    const p = document.createElement("p");
    p.innerHTML = `
      <button onclick="speakSV('${l.sv}')" class="mr-2">🔊</button>
      <strong>${l.sv}</strong> (${l.pron})<br/>
      <em>${l.fr}</em>
    `;
    d.appendChild(p);
  });
  parent.appendChild(d);
}

function renderVocab(parent, block) {
  const d = document.createElement("div");
  d.innerHTML = `<h4 class="font-bold mt-4 mb-2">${block.title}</h4>`;
  block.items.forEach(i => {
    const p = document.createElement("p");
    p.innerHTML = `
      <button onclick="speakSV('${i.sv}')" class="mr-2">🔊</button>
      ${i.sv} (${i.pron}) — ${i.fr}
    `;
    d.appendChild(p);
  });
  parent.appendChild(d);
}

function renderGrammar(parent, block) {
  const d = document.createElement("div");
  d.innerHTML = `<h4 class="font-bold mt-4 mb-2">${block.title}</h4>${block.html}`;
  parent.appendChild(d);
}

function renderExamples(parent, block) {
  const d = document.createElement("div");
  d.innerHTML = `<h4 class="font-bold mt-4 mb-2">${block.title}</h4>`;
  block.items.forEach(e => {
    const p = document.createElement("p");
    p.innerHTML = `
      <button onclick="speakSV('${e.sv}')" class="mr-2">🔊</button>
      ${e.sv} (${e.pron}) — ${e.fr}
    `;
    d.appendChild(p);
  });
  parent.appendChild(d);
}

function renderExercises(parent, block) {
  const d = document.createElement("div");
  d.innerHTML = `<h4 class="font-bold mt-4 mb-2">${block.title}</h4>`;
  block.items.forEach(q => {
    const p = document.createElement("p");
    p.textContent = "• " + q;
    d.appendChild(p);
  });
  parent.appendChild(d);
}

// ================= INIT =================

window.addEventListener("load", () => {
  loadState();
  renderLearn();
});
