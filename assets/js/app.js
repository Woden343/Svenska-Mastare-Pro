// assets/js/app.js

const App = {
  mount: document.getElementById("app"),
  data: null, // contiendra le JSON de A1

  async init() {
    // Nav
    document.getElementById("nav-home").onclick = () => Router.go("/");
    document.getElementById("nav-review").onclick = () => Router.go("/review");
    document.getElementById("nav-stats").onclick = () => Router.go("/stats");

    // Routes
    Router.on("/", () => this.viewHome());
    Router.on("/level", (p) => this.viewLevel(p.level));
    Router.on("/lesson", (p) => this.viewLesson(p.level, p.lessonId));
    Router.on("/review", () => this.viewReview());
    Router.on("/stats", () => this.viewStats());

    // Charger le contenu A1 depuis le JSON
    this.data = await this.loadLevel("A1");

    Router.start("/");
  },

  async loadLevel(level) {
    // Pour l’instant: uniquement A1. (On ajoutera A2/B1/etc après)
    const map = {
      A1: "assets/data/a1.json"
    };

    const url = map[level];
    if (!url) throw new Error(`Niveau non supporté: ${level}`);

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Impossible de charger ${url} (${res.status})`);
    const json = await res.json();

    // Normalisation minimaliste
    // On s’assure que les champs existent pour éviter les crashs.
    return {
      level: json.level || level,
      title: json.title || "",
      modules: Array.isArray(json.modules) ? json.modules : []
    };
  },

  setView(html) {
    this.mount.innerHTML = html;
  },

  viewHome() {
    const s = Storage.load();
    const doneCount = Object.keys(s.done).length;

    // V1: on expose A1 (on ajoutera les autres niveaux ensuite)
    const level = this.data.level || "A1";
    const levelTitle = this.data.title ? `${level} — ${this.data.title}` : level;
    const modulesCount = this.data.modules.length;

    this.setView(`
      <section class="card">
        <h2>Bienvenue 👋</h2>
        <p class="muted">Objectif : apprendre le suédois de zéro (A1 → C2) avec cours + exercices + révision.</p>
        <div class="kpi">
          <span class="pill">Leçons validées : <b>${doneCount}</b></span>
          <span class="pill">Bonnes réponses : <b>${s.stats.correct}</b></span>
          <span class="pill">Erreurs : <b>${s.stats.wrong}</b></span>
        </div>
      </section>

      <section class="grid grid-2" style="margin-top:12px;">
        <div class="card">
          <span class="pill">Niveau ${level}</span>
          <h3 style="margin-top:10px;">${levelTitle}</h3>
          <p class="muted">Modules : ${modulesCount}</p>
          <button class="btn" onclick="Router.go('/level',{level:'${level}'})">Ouvrir</button>
        </div>
      </section>
    `);
  },

  viewLevel(level) {
    // V1: seul A1 est chargé
    if (level !== (this.data.level || "A1")) {
      return this.setView(`
        <section class="card">
          <h2>Niveau introuvable</h2>
          <p class="muted">Pour l’instant, seul le niveau ${this.data.level || "A1"} est chargé.</p>
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </section>
      `);
    }

    const L = this.data;

    this.setView(`
      <section class="card">
        <span class="pill">Niveau ${L.level}</span>
        <h2 style="margin-top:10px;">${L.level} — ${L.title}</h2>
        <p class="muted">Choisis un module, puis une leçon.</p>
      </section>

      <section style="margin-top:12px;" class="grid">
        ${L.modules.map(m => `
          <div class="card">
            <h3>${m.title || "Module"}</h3>
            <p class="muted">Leçons : ${(m.lessons || []).length}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              ${(m.lessons || []).map(les => `
                <button class="btn" onclick="Router.go('/lesson',{level:'${L.level}', lessonId:'${les.id}'})">
                  ${les.title || "Leçon"}
                </button>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </section>

      <div style="margin-top:12px;">
        <button class="btn" onclick="Router.go('/')">← Retour</button>
      </div>
    `);
  },

  viewLesson(level, lessonId) {
    if (level !== (this.data.level || "A1")) {
      return this.setView(`<div class="card">Leçon introuvable (niveau non chargé).</div>`);
    }

    const L = this.data;

    const lesson =
      L.modules
        .flatMap(m => (m.lessons || []))
        .find(x => x.id === lessonId);

    if (!lesson) {
      return this.setView(`
        <section class="card">
          <h2>Leçon introuvable</h2>
          <button class="btn" onclick="Router.go('/level',{level:'${L.level}'})">← Retour</button>
        </section>
      `);
    }

    const vocabHtml = (lesson.vocab || []).map(w => `
      <div class="choice" style="cursor:default;">
        <div style="min-width:110px;"><b>${w.sv || ""}</b></div>
        <div class="muted">${w.fr || ""}${w.pron ? ` • <i>${w.pron}</i>` : ""}</div>
      </div>
    `).join("");

    const examplesHtml = (lesson.examples || []).map(e => `
      <div class="choice" style="cursor:default;">
        <div>
          <b>${e.sv || ""}</b>
          <div class="muted">${e.fr || ""}${e.pron ? ` • <i>${e.pron}</i>` : ""}</div>
        </div>
      </div>
    `).join("");

    const contentHtml = (lesson.content || []).map(p => `<p>${p}</p>`).join("");

    this.setView(`
      <section class="card">
        <span class="pill">${L.level}</span>
        <h2 style="margin-top:10px;">${lesson.title || "Leçon"}</h2>

        ${contentHtml}

        ${(lesson.examples && lesson.examples.length) ? `
          <hr />
          <h3>Exemples</h3>
          ${examplesHtml}
        ` : ""}

        ${(lesson.vocab && lesson.vocab.length) ? `
          <hr />
          <h3>Vocabulaire</h3>
          ${vocabHtml}
        ` : ""}

        <hr />
        <h3>Exercice</h3>
        <div id="quiz"></div>

        <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
          <button class="btn" onclick="Storage.markDone('${lesson.id}'); Router.go('/level',{level:'${L.level}'})">✔ Marquer comme faite</button>
          <button class="btn" onclick="Router.go('/level',{level:'${L.level}'})">← Retour</button>
        </div>
      </section>
    `);

    this.renderQuiz(lesson);
  },

  renderQuiz(lesson) {
    const q = lesson.quiz;
    const el = document.getElementById("quiz");
    if (!el) return;

    if (!q) {
      el.innerHTML = `<p class="muted">Aucun exercice pour cette leçon.</p>`;
      return;
    }

    if (q.type === "mcq") {
      el.innerHTML = `
        <p><b>${q.q || ""}</b></p>
        <div class="grid">
          ${(q.choices || []).map((c, i) => `<div class="choice" data-i="${i}">${c}</div>`).join("")}
        </div>
        <p id="fb" class="muted" style="margin-top:10px;"></p>
      `;

      const choicesNodes = el.querySelectorAll(".choice");
      choicesNodes.forEach(node => {
        node.onclick = () => {
          const i = Number(node.dataset.i);
          const ok = i === q.answerIndex;

          Storage.addResult(ok);

          choicesNodes.forEach(n => n.classList.remove("correct", "wrong"));
          node.classList.add(ok ? "correct" : "wrong");

          const fb = el.querySelector("#fb");
          if (fb) {
            const answer = (q.choices && q.choices[q.answerIndex] != null) ? q.choices[q.answerIndex] : "";
            fb.textContent = ok ? "✅ Correct." : `❌ Non. Réponse : ${answer}`;
          }
        };
      });
      return;
    }

    if (q.type === "gap") {
      el.innerHTML = `
        <p><b>${q.q || ""}</b></p>
        <input id="gap" placeholder="Ta réponse..." />
        <button class="btn" style="margin-top:10px;" id="check">Vérifier</button>
        <p id="fb" class="muted" style="margin-top:10px;"></p>
      `;

      el.querySelector("#check").onclick = () => {
        const val = (el.querySelector("#gap").value || "").trim().toLowerCase();
        const expected = (q.answer || "").trim().toLowerCase();
        const ok = val === expected;

        Storage.addResult(ok);

        const fb = el.querySelector("#fb");
        fb.textContent = ok ? "✅ Correct." : `❌ Attendu : ${q.answer || ""}`;
      };
      return;
    }

    el.innerHTML = `<p class="muted">Type de quiz non géré.</p>`;
  },

  viewReview() {
    this.setView(`
      <section class="card">
        <h2>Révision</h2>
        <p class="muted">Bientôt : flashcards + rappel espacée (SRS).</p>
      </section>
    `);
  },

  viewStats() {
    const s = Storage.load();
    const total = s.stats.correct + s.stats.wrong;
    const rate = total ? Math.round((s.stats.correct / total) * 100) : 0;

    this.setView(`
      <section class="card">
        <h2>Stats</h2>
        <div class="kpi">
          <span class="pill">Total réponses : <b>${total}</b></span>
          <span class="pill">Taux : <b>${rate}%</b></span>
          <span class="pill">Bonnes : <b>${s.stats.correct}</b></span>
          <span class="pill">Erreurs : <b>${s.stats.wrong}</b></span>
        </div>
        <hr />
        <button class="btn" onclick="localStorage.removeItem(Storage.key); location.reload()">Réinitialiser</button>
      </section>
    `);
  }
};

App.init();
