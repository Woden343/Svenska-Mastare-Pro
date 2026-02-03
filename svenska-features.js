// svenska-features.js
// Phase 2 : onglet Apprendre (lecons + modal + audio)

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

function renderLearn() {
  const levelSelect = document.getElementById("level-selector");

  // Synchroniser le select avec le state
  if (levelSelect && levelSelect.value !== (appState.user.level || "A1")) {
    levelSelect.value = appState.user.level || "A1";
  }

  // Binder l'event une seule fois
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
  const list = LESSONS[level] || [];
  const grid = document.getElementById("lessons-grid");
  const container = document.getElementById("content-learn");
  if (!grid || !container) return;

  if (!list.length) {
    grid.innerHTML = `<div class="text-slate-600">Aucune leçon disponible pour ${level}.</div>`;
  } else {
    grid.innerHTML = list
      .map((lesson) => {
        const done = isLessonCompleted(lesson.id);
        return `
        <button
          class="text-left bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition focus-ring"
          onclick="openLesson('${lesson.id}')"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs text-slate-500">${lesson.id}</div>
              <div class="font-extrabold text-slate-800 mt-1">${lesson.title}</div>
              <div class="text-xs text-slate-500 mt-2">${(lesson.tags || []).map(t => `#${t}`).join(" ")}</div>
            </div>
            <div class="text-xl" aria-hidden="true">${done ? "✅" : "⬜"}</div>
          </div>
        </button>`;
      })
      .join("");
  }

  // Créer le modal si absent
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
            <button id="lesson-toggle-done" class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition focus-ring">✅ Terminé</button>
          </div>
        </div>

        <div id="lesson-modal-body" class="space-y-4"></div>
      </div>
    </div>
  </div>`;
}

function bindLessonModalEvents() {
  const modal = document.getElementById("lesson-modal");
  document.getElementById("lesson-modal-close").onclick = () => modal.classList.add("hidden");
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
    ? "↩️ Marquer non terminé"
    : "✅ Marquer terminé";

  const body = document.getElementById("lesson-modal-body");
  body.innerHTML = (lesson.sections || [])
    .map((sec) => {
      if (sec.type === "examples") {
        const ex = (sec.examples || [])
          .map((e) => `
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div class="font-semibold text-slate-800">${e.sv}</div>
              <div class="text-sm text-slate-600">${e.fr}</div>
            </div>
          `)
          .join("");

        return `
          <section>
            <h4 class="font-extrabold text-slate-800">${sec.title || "Exemples"}</h4>
            <div class="mt-2 space-y-2">${ex}</div>
          </section>
        `;
      }

      return `
        <section>
          <h4 class="font-extrabold text-slate-800">${sec.title || "Théorie"}</h4>
          <p class="text-slate-700 mt-2 leading-relaxed">${sec.text || ""}</p>
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
