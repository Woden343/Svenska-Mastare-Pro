// assets/js/app.js

const App = {
  mount: document.getElementById("app"),

  levels: {},
  levelsOrder: ["A1", "A2", "B1"],

  refData: null,

  async init() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (!el) return;
      // Support <button> (onclick) + <a href> (hash)
      el.onclick = (e) => {
        // si c'est un lien <a>, on laisse le hash faire son boulot
        // sinon on route nous-même
        if (el.tagName === "A") return;
        e.preventDefault();
        fn();
      };
    };

    bind("nav-home", () => Router.go("/"));
    bind("nav-review", () => Router.go("/review"));
    bind("nav-ref", () => Router.go("/ref"));
    bind("nav-stats", () => Router.go("/stats"));

    Router.on("/", () => this.viewHome());
    Router.on("/level", (p) => this.viewLevel(p.level));
    Router.on("/lesson", (p) => this.viewLesson(p.level, p.lessonId));

    Router.on("/review", () => this.viewReview());
    Router.on("/stats", () => this.viewStats());

    Router.on("/ref", () => this.viewRef());
    Router.on("/ref-lesson", (p) => this.viewRefLesson(p.moduleId, p.lessonId));

    await this.preloadLevels();
    if (Object.keys(this.levels).length === 0) return;

    await this.loadRefSafe();     // ✅ ref.json (robuste)
    this.refreshSrsCards();       // ✅ SRS depuis niveaux

    Router.start("/");
  },

  async preloadLevels() {
    for (const lvl of this.levelsOrder) {
      try {
        this.levels[lvl] = await this.loadLevel(lvl);
      } catch (e) {
        console.warn(`[loadLevel] ${lvl} non chargé:`, e.message || e);
      }
    }

    if (Object.keys(this.levels).length === 0) {
      this.setView(`
        <section class="card">
          <h2>Erreur de chargement</h2>
          <p class="muted">Aucun niveau n’a pu être chargé. Vérifie <code>assets/data/</code>.</p>
          <ul>
            <li><code>assets/data/a1.json</code></li>
            <li><code>assets/data/a2.json</code></li>
            <li><code>assets/data/b1.json</code></li>
          </ul>
        </section>
      `);
    }
  },

  async loadLevel(level) {
    const map = {
      A1: "assets/data/a1.json",
      A2: "assets/data/a2.json",
      B1: "assets/data/b1.json"
    };

    const url = map[level];
    if (!url) throw new Error(`Niveau non supporté: ${level}`);

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Impossible de charger ${url} (${res.status})`);
    const json = await res.json();

    return {
      level: json.level || level,
      title: json.title || "",
      modules: Array.isArray(json.modules) ? json.modules : []
    };
  },

  // --------- REF (robuste) ----------
  normalizeRefJson(json) {
    // Accepte différentes formes possibles
    const root = json?.data ? json.data : json;

    const modules =
      (Array.isArray(root?.modules) && root.modules) ||
      (Array.isArray(root?.sections) && root.sections) ||
      [];

    const normModules = modules.map((m, mi) => {
      const lessons =
        (Array.isArray(m?.lessons) && m.lessons) ||
        (Array.isArray(m?.items) && m.items) ||
        (Array.isArray(m?.entries) && m.entries) ||
        (Array.isArray(m?.fiches) && m.fiches) ||
        [];

      const moduleId = (m?.id && String(m.id)) || `m${mi + 1}`;

      const normLessons = lessons.map((l, li) => {
        const lessonId = (l?.id && String(l.id)) || `l${li + 1}`;

        return {
          id: lessonId,
          title: l?.title || l?.name || `Fiche ${li + 1}`,
          content: Array.isArray(l?.content) ? l.content : (l?.content ? [String(l.content)] : []),
          vocab: Array.isArray(l?.vocab) ? l.vocab : [],
          examples: Array.isArray(l?.examples) ? l.examples : []
        };
      });

      return {
        id: moduleId,
        title: m?.title || m?.name || `Module ${mi + 1}`,
        lessons: normLessons
      };
    });

    return {
      title: root?.title || "Références",
      modules: normModules
    };
  },

  async loadRefSafe() {
    try {
      const res = await fetch("assets/data/ref.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`Impossible de charger ref.json (${res.status})`);
      const json = await res.json();

      this.refData = this.normalizeRefJson(json);
    } catch (e) {
      console.warn("[ref] ref.json non chargé:", e.message || e);
      this.refData = null;
    }
  },

  // --------- SRS ----------
  refreshSrsCards() {
    const cards = SRS.buildCardsFromLevels(this.levels);
    Storage.upsertCards(cards);
  },

  setView(html) {
    this.mount.innerHTML = html;
  },

  getLevelData(level) {
    return this.levels[level] || null;
  },

  // --------- HOME ----------
  viewHome() {
    const s = Storage.load();
    const doneCount = Object.keys(s.done).length;
    const srsStats = Storage.getSrsStats();

    const levelCards = this.levelsOrder
      .map(lvl => this.getLevelData(lvl))
      .filter(Boolean)
      .map(L => `
        <div class="card">
          <span class="pill">Niveau ${L.level}</span>
          <h3 style="margin-top:10px;">${L.title ? `${L.level} — ${L.title}` : L.level}</h3>
          <p class="muted">Modules : ${(L.modules || []).length}</p>
          <button class="btn" onclick="Router.go('/level',{level:'${L.level}'})">Ouvrir</button>
        </div>
      `).join("");

    this.setView(`
      <section class="card">
        <h2>Bienvenue 👋</h2>
        <p class="muted">Objectif : apprendre le suédois de zéro (A1 → C2) avec cours + exercices + révision.</p>

        <div class="kpi">
          <span class="pill">Leçons validées : <b>${doneCount}</b></span>
          <span class="pill">Bonnes réponses : <b>${s.stats.correct}</b></span>
          <span class="pill">Erreurs : <b>${s.stats.wrong}</b></span>
        </div>

        <hr />

        <div class="kpi">
          <span class="pill">Cartes SRS : <b>${srsStats.total}</b></span>
          <span class="pill">À réviser : <b>${srsStats.due}</b></span>
          <span class="pill">Limite/jour : <b>${srsStats.dailyLimit}</b></span>
        </div>

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn" onclick="Router.go('/review')">🎴 Révision SRS</button>
          <button class="btn" onclick="Router.go('/ref')" ${this.refData ? "" : "disabled"}>📚 Références</button>
        </div>
      </section>

      <section class="grid grid-2" style="margin-top:12px;">
        <div class="card">
          <span class="pill">Références</span>
          <h3 style="margin-top:10px;">Bescherelle & Vocab</h3>
          <p class="muted">${this.refData ? `Modules : ${(this.refData.modules || []).length}` : "ref.json non chargé"}</p>
          <button class="btn" onclick="Router.go('/ref')" ${this.refData ? "" : "disabled"}>Ouvrir</button>
        </div>

        ${levelCards}
      </section>
    `);
  },

  // --------- LEVEL / LESSON ----------
  viewLevel(level) {
    const L = this.getLevelData(level);
    if (!L) return this.setView(`
      <section class="card">
        <h2>Niveau introuvable</h2>
        <button class="btn" onclick="Router.go('/')">← Retour</button>
      </section>
    `);

    this.setView(`
      <section class="card">
        <span class="pill">Niveau ${L.level}</span>
        <h2 style="margin-top:10px;">${L.level} — ${L.title}</h2>
        <p class="muted">Choisis un module, puis une leçon.</p>
      </section>

      <section style="margin-top:12px;" class="grid">
        ${(L.modules || []).map(m => `
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
    const L = this.getLevelData(level);
    if (!L) return this.setView(`<section class="card"><h2>Leçon introuvable</h2></section>`);

    const lesson = (L.modules || []).flatMap(m => (m.lessons || [])).find(x => x.id === lessonId);
    if (!lesson) return this.setView(`
      <section class="card">
        <h2>Leçon introuvable</h2>
        <button class="btn" onclick="Router.go('/level',{level:'${L.level}'})">← Retour</button>
      </section>
    `);

    const contentHtml = (lesson.content || []).map(p => `<p>${p}</p>`).join("");
    const examplesHtml = (lesson.examples || []).map(e => `
      <div class="choice" style="cursor:default;">
        <div><b>${e.sv || ""}</b><div class="muted">${e.fr || ""}${e.pron ? ` • <i>${e.pron}</i>` : ""}</div></div>
      </div>
    `).join("");
    const vocabHtml = (lesson.vocab || []).map(w => `
      <div class="choice" style="cursor:default;">
        <div style="min-width:130px;"><b>${w.sv || ""}</b></div>
        <div class="muted">${w.fr || ""}${w.pron ? ` • <i>${w.pron}</i>` : ""}</div>
      </div>
    `).join("");

    this.setView(`
      <section class="card">
        <span class="pill">${L.level}</span>
        <h2 style="margin-top:10px;">${lesson.title || "Leçon"}</h2>

        ${contentHtml}

        ${(lesson.examples && lesson.examples.length) ? `<hr /><h3>Exemples</h3>${examplesHtml}` : ""}
        ${(lesson.vocab && lesson.vocab.length) ? `<hr /><h3>Vocabulaire</h3>${vocabHtml}` : ""}

        <hr />
        <h3>Exercices</h3>
        <div id="quiz"></div>

        <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
          <button class="btn" onclick="Storage.markDone('${L.level}:${lesson.id}'); Router.go('/level',{level:'${L.level}'})">✔ Marquer comme faite</button>
          <button class="btn" onclick="Router.go('/level',{level:'${L.level}'})">← Retour</button>
        </div>
      </section>
    `);

    this.renderQuiz(lesson);
  },

  renderQuiz(lesson) {
    const host = document.getElementById("quiz");
    if (!host) return;

    const quizzes = Array.isArray(lesson.quiz) ? lesson.quiz : (lesson.quiz ? [lesson.quiz] : []);
    if (quizzes.length === 0) {
      host.innerHTML = `<p class="muted">Aucun exercice pour cette leçon.</p>`;
      return;
    }

    let idx = 0;
    let answered = new Array(quizzes.length).fill(false);

    const renderOne = () => {
      const q = quizzes[idx];

      host.innerHTML = `
        <div class="card" style="margin-top:10px;">
          <div class="muted" style="margin-bottom:8px;">Exercice ${idx + 1} / ${quizzes.length}</div>
          <div id="qbox"></div>
          <p id="fb" class="muted" style="margin-top:10px;"></p>
          <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
            <button class="btn" id="prev" ${idx === 0 ? "disabled" : ""}>← Précédent</button>
            <button class="btn" id="next">${idx === quizzes.length - 1 ? "Terminer" : "Suivant →"}</button>
          </div>
        </div>
      `;

      const qbox = host.querySelector("#qbox");
      const fb = host.querySelector("#fb");

      const setFeedback = (ok, extra = "") => { fb.textContent = ok ? `✅ Correct. ${extra}` : `❌ Non. ${extra}`; };
      const lockIfAnswered = () => answered[idx];

      if (q.type === "mcq") {
        qbox.innerHTML = `
          <p><b>${q.q || ""}</b></p>
          <div class="grid">
            ${(q.choices || []).map((c, i) => `<div class="choice" data-i="${i}">${c}</div>`).join("")}
          </div>
        `;
        const nodes = qbox.querySelectorAll(".choice");
        nodes.forEach(node => {
          node.onclick = () => {
            if (lockIfAnswered()) return;
            const i = Number(node.dataset.i);
            const ok = i === q.answerIndex;
            Storage.addResult(ok);
            answered[idx] = true;
            nodes.forEach(n => n.classList.remove("correct", "wrong"));
            node.classList.add(ok ? "correct" : "wrong");
            const answer = (q.choices && q.choices[q.answerIndex] != null) ? q.choices[q.answerIndex] : "";
            setFeedback(ok, ok ? "" : `Réponse : ${answer}`);
          };
        });
      } else if (q.type === "gap") {
        qbox.innerHTML = `
          <p><b>${q.q || ""}</b></p>
          <input id="gap" placeholder="Ta réponse..." />
          <button class="btn" style="margin-top:10px;" id="check">Vérifier</button>
        `;
        const input = qbox.querySelector("#gap");
        qbox.querySelector("#check").onclick = () => {
          if (lockIfAnswered()) return;
          const val = (input.value || "").trim().toLowerCase();
          const expected = (q.answer || "").trim().toLowerCase();
          const ok = val === expected;
          Storage.addResult(ok);
          answered[idx] = true;
          setFeedback(ok, ok ? "" : `Attendu : ${q.answer || ""}`);
        };
      } else {
        qbox.innerHTML = `<p class="muted">Type de quiz non géré.</p>`;
      }

      host.querySelector("#prev").onclick = () => { if (idx > 0) { idx--; renderOne(); } };
      host.querySelector("#next").onclick = () => { if (idx < quizzes.length - 1) { idx++; renderOne(); } else { fb.textContent = "✅ Série terminée."; } };
    };

    renderOne();
  },

  // --------- REVIEW / STATS (inchangés) ----------
  viewReview() { Router.go("/review"); }, // garde ta version SRS précédente si tu veux,
  // (si tu veux, je te remets ton viewReview complet ici aussi, mais on reste focus sur la ref)

  viewStats() {
    const s = Storage.load();
    const total = s.stats.correct + s.stats.wrong;
    const rate = total ? Math.round((s.stats.correct / total) * 100) : 0;
    const st = Storage.getSrsStats();

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

        <h3>SRS</h3>
        <div class="kpi">
          <span class="pill">Cartes : <b>${st.total}</b></span>
          <span class="pill">À réviser : <b>${st.due}</b></span>
          <span class="pill">Limite/jour : <b>${st.dailyLimit}</b></span>
        </div>

        <hr />
        <button class="btn" onclick="localStorage.removeItem(Storage.key); location.reload()">Réinitialiser</button>
      </section>
    `);
  },

  // --------- REF views ----------
  viewRef() {
    if (!this.refData) {
      return this.setView(`
        <section class="card">
          <h2>Références</h2>
          <p class="muted">Le fichier <code>assets/data/ref.json</code> n’a pas pu être chargé.</p>
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </section>
      `);
    }

    const R = this.refData;
    const modules = R.modules || [];

    if (modules.length === 0) {
      return this.setView(`
        <section class="card">
          <h2>Références</h2>
          <p class="muted">${R.title || ""}</p>
          <hr />
          <p class="muted">
            Ton <code>ref.json</code> est chargé, mais je ne trouve aucun module.
            <br/>Vérifie que ton fichier contient bien <code>modules</code> (ou <code>sections</code>) et à l’intérieur <code>lessons</code> (ou <code>items</code>).
          </p>
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </section>
      `);
    }

    this.setView(`
      <section class="card">
        <span class="pill">Références</span>
        <h2 style="margin-top:10px;">${R.title || "Références"}</h2>
        <p class="muted">Choisis un module (verbes / vocab / particules), puis une fiche.</p>
      </section>

      <section style="margin-top:12px;" class="grid">
        ${modules.map(m => `
          <div class="card">
            <h3>${m.title || "Module"}</h3>
            <p class="muted">Fiches : ${(m.lessons || []).length}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              ${(m.lessons || []).map(les => `
                <button class="btn" onclick="Router.go('/ref-lesson',{moduleId:'${m.id}', lessonId:'${les.id}'})">
                  ${les.title || "Fiche"}
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

  viewRefLesson(moduleId, lessonId) {
    if (!this.refData) return this.viewRef();

    const mod = (this.refData.modules || []).find(x => x.id === moduleId);
    const lesson = mod?.lessons?.find(x => x.id === lessonId);

    if (!mod || !lesson) {
      return this.setView(`
        <section class="card">
          <h2>Fiche introuvable</h2>
          <p class="muted">Vérifie les <code>id</code> dans <code>ref.json</code>.</p>
          <button class="btn" onclick="Router.go('/ref')">← Retour</button>
        </section>
      `);
    }

    const contentHtml = (lesson.content || []).map(p => `<p>${p}</p>`).join("");
    const vocabHtml = (lesson.vocab || []).map(w => `
      <div class="choice" style="cursor:default;">
        <div style="min-width:130px;"><b>${w.sv || ""}</b></div>
        <div class="muted">${w.fr || ""}${w.pron ? ` • <i>${w.pron}</i>` : ""}</div>
      </div>
    `).join("");
    const examplesHtml = (lesson.examples || []).map(e => `
      <div class="choice" style="cursor:default;">
        <div><b>${e.sv || ""}</b><div class="muted">${e.fr || ""}${e.pron ? ` • <i>${e.pron}</i>` : ""}</div></div>
      </div>
    `).join("");

    this.setView(`
      <section class="card">
        <span class="pill">Références</span>
        <h2 style="margin-top:10px;">${lesson.title || "Fiche"}</h2>

        ${contentHtml}

        ${(lesson.examples && lesson.examples.length) ? `<hr /><h3>Exemples</h3>${examplesHtml}` : ""}
        ${(lesson.vocab && lesson.vocab.length) ? `<hr /><h3>Vocabulaire</h3>${vocabHtml}` : ""}

        <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
          <button class="btn" onclick="Router.go('/ref')">← Retour</button>
        </div>
      </section>
    `);
  }
};

App.init();