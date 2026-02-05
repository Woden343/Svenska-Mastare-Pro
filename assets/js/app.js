// assets/js/app.js

const App = {
  mount: document.getElementById("app"),

  // Contiendra tous les niveaux chargés : { A1: {...}, A2: {...} }
  levels: {},

  // Ordre d’affichage sur l’accueil
  levelsOrder: ["A1", "A2"],

  // Références (Bescherelle + vocab)
  refData: null,

  async init() {
    // Nav
    document.getElementById("nav-home").onclick = () => Router.go("/");
    document.getElementById("nav-review").onclick = () => Router.go("/review");
    document.getElementById("nav-stats").onclick = () => Router.go("/stats");
    document.getElementById("nav-ref").onclick = () => Router.go("/ref");

    // Routes
    Router.on("/", () => this.viewHome());
    Router.on("/level", (p) => this.viewLevel(p.level));
    Router.on("/lesson", (p) => this.viewLesson(p.level, p.lessonId));
    Router.on("/review", () => this.viewReview());
    Router.on("/stats", () => this.viewStats());
    Router.on("/ref", () => this.viewRef());

    // Charger A1 + A2
    await this.preloadLevels();

    Router.start("/");
  },

  /* =========================
     UX helpers
  ========================= */

  setActiveNav(activeId) {
    const ids = ["nav-home", "nav-review", "nav-stats", "nav-ref"];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const isActive = id === activeId;

      // Reset minimal
      el.style.borderColor = "";
      el.style.background = "";
      el.style.boxShadow = "";

      if (isActive) {
        // Active look (works even without CSS class)
        el.style.borderColor = "rgba(106,169,255,.55)";
        el.style.background = "rgba(106,169,255,.12)";
        el.style.boxShadow = "0 8px 20px rgba(0,0,0,.20)";
      }
    });
  },

  breadcrumb(items) {
    // items: [{label, onClick?}]
    const parts = items.map((it, idx) => {
      const isLast = idx === items.length - 1;
      if (isLast || !it.onClick) {
        return `<span class="muted">${it.label}</span>`;
      }
      // inline link button style
      return `<button class="btn" style="padding:6px 10px; font-weight:700;" onclick="${it.onClick}">${it.label}</button>`;
    });

    return `
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
        ${parts.join(`<span class="muted">→</span>`)}
      </div>
    `;
  },

  setView(html) {
    this.mount.innerHTML = html;
  },

  getLevelData(level) {
    return this.levels[level] || null;
  },

  /* =========================
     Data loaders
  ========================= */

  async preloadLevels() {
    const toLoad = this.levelsOrder.slice();

    for (const lvl of toLoad) {
      try {
        this.levels[lvl] = await this.loadLevel(lvl);
      } catch (e) {
        console.warn(`[loadLevel] ${lvl} non chargé:`, e.message || e);
      }
    }

    if (Object.keys(this.levels).length === 0) {
      this.setActiveNav("nav-home");
      this.setView(`
        <section class="card">
          <h2>Erreur de chargement</h2>
          <p class="muted">Aucun niveau n’a pu être chargé. Vérifie que les fichiers JSON existent bien dans <code>assets/data/</code>.</p>
          <ul>
            <li><code>assets/data/a1.json</code></li>
            <li><code>assets/data/a2.json</code></li>
          </ul>
        </section>
      `);
      return;
    }
  },

  async loadLevel(level) {
    const map = {
      A1: "assets/data/a1.json",
      A2: "assets/data/a2.json"
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

  async loadRef() {
    if (this.refData) return this.refData;

    const url = "assets/data/ref.json";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Impossible de charger ${url} (${res.status})`);
    const json = await res.json();

    this.refData = {
      title: json.title || "Références",
      verbs: Array.isArray(json.verbs) ? json.verbs : [],
      phrasalVerbs: Array.isArray(json.phrasalVerbs) ? json.phrasalVerbs : [],
      nouns: Array.isArray(json.nouns) ? json.nouns : []
    };

    return this.refData;
  },

  /* =========================
     Views
  ========================= */

  viewHome() {
    this.setActiveNav("nav-home");

    const s = Storage.load();
    const doneCount = Object.keys(s.done).length;

    const cards = this.levelsOrder
      .map(lvl => this.getLevelData(lvl))
      .filter(Boolean)
      .map(L => {
        const modulesCount = (L.modules || []).length;
        const levelTitle = L.title ? `${L.level} — ${L.title}` : L.level;

        return `
          <div class="card">
            <span class="pill">Niveau ${L.level}</span>
            <h3 style="margin-top:10px;">${levelTitle}</h3>
            <p class="muted">Modules : ${modulesCount}</p>
            <button class="btn" onclick="Router.go('/level',{level:'${L.level}'})">Ouvrir</button>
          </div>
        `;
      })
      .join("");

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
        ${cards || `
          <div class="card">
            <h3>Aucun niveau chargé</h3>
            <p class="muted">Vérifie tes fichiers JSON.</p>
          </div>
        `}
      </section>
    `);
  },

  viewLevel(level) {
    this.setActiveNav("nav-home");

    const L = this.getLevelData(level);
    if (!L) {
      const loaded = Object.keys(this.levels).join(", ") || "aucun";
      return this.setView(`
        <section class="card">
          <h2>Niveau introuvable</h2>
          <p class="muted">Niveaux chargés : ${loaded}</p>
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </section>
      `);
    }

    const bc = this.breadcrumb([
      { label: "Accueil", onClick: "Router.go('/')" },
      { label: `${L.level}` }
    ]);

    this.setView(`
      <section class="card">
        ${bc}
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
        <button class="btn" onclick="Router.go('/')">← Retour accueil</button>
      </div>
    `);
  },

  viewLesson(level, lessonId) {
    this.setActiveNav("nav-home");

    const L = this.getLevelData(level);
    if (!L) {
      return this.setView(`
        <section class="card">
          <h2>Leçon introuvable</h2>
          <p class="muted">Niveau non chargé : ${level}</p>
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </section>
      `);
    }

    const lesson =
      (L.modules || [])
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

    const bc = this.breadcrumb([
      { label: "Accueil", onClick: "Router.go('/')" },
      { label: `${L.level}`, onClick: `Router.go('/level',{level:'${L.level}'})` },
      { label: lesson.title || "Leçon" }
    ]);

    const vocabHtml = (lesson.vocab || []).map(w => `
      <div class="choice" style="cursor:default;">
        <div style="min-width:120px;"><b>${w.sv || ""}</b></div>
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
        ${bc}
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
        <h3>Exercices</h3>
        <div id="quiz"></div>

        <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
          <button class="btn" onclick="Storage.markDone('${L.level}:${lesson.id}'); Router.go('/level',{level:'${L.level}'})">✔ Marquer comme faite</button>
          <button class="btn" onclick="Router.go('/level',{level:'${L.level}'})">← Retour au niveau</button>
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

      const setFeedback = (ok, extra = "") => {
        fb.textContent = ok ? `✅ Correct. ${extra}` : `❌ Non. ${extra}`;
      };

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
        const btn = qbox.querySelector("#check");

        btn.onclick = () => {
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
      host.querySelector("#next").onclick = () => {
        if (idx < quizzes.length - 1) { idx++; renderOne(); }
        else { fb.textContent = "✅ Série terminée."; }
      };
    };

    renderOne();
  },

  viewReview() {
    this.setActiveNav("nav-review");

    const bc = this.breadcrumb([
      { label: "Accueil", onClick: "Router.go('/')" },
      { label: "Révision" }
    ]);

    this.setView(`
      <section class="card">
        ${bc}
        <h2>Révision</h2>
        <p class="muted">Bientôt : flashcards + rappel espacée (SRS).</p>
      </section>
    `);
  },

  viewStats() {
    this.setActiveNav("nav-stats");

    const s = Storage.load();
    const total = s.stats.correct + s.stats.wrong;
    const rate = total ? Math.round((s.stats.correct / total) * 100) : 0;

    const bc = this.breadcrumb([
      { label: "Accueil", onClick: "Router.go('/')" },
      { label: "Stats" }
    ]);

    this.setView(`
      <section class="card">
        ${bc}
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
  },

  async viewRef() {
    this.setActiveNav("nav-ref");

    let R;
    try {
      R = await this.loadRef();
    } catch (e) {
      return this.setView(`
        <section class="card">
          <h2>Références</h2>
          <p class="muted">Erreur : ${String(e.message || e)}</p>
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </section>
      `);
    }

    const bc = this.breadcrumb([
      { label: "Accueil", onClick: "Router.go('/')" },
      { label: "Références" }
    ]);

    const renderRows = (items) => items.map(v => `
      <tr>
        <td><b>${v.inf || ""}</b><div class="muted">${v.pron ? `<i>${v.pron}</i>` : ""}</div></td>
        <td>${v.pres || ""}</td>
        <td>${v.pret || ""}</td>
        <td>${v.sup || ""}</td>
        <td>${v.imp || ""}</td>
        <td class="muted">${v.fr || ""}</td>
      </tr>
    `).join("");

    const renderNounRows = (items) => items.map(n => `
      <tr>
        <td><b>${n.base || ""}</b><div class="muted">${n.pron ? `<i>${n.pron}</i>` : ""}</div></td>
        <td>${n.indef || ""}</td>
        <td>${n.def || ""}</td>
        <td>${n.pl_indef || ""}</td>
        <td>${n.pl_def || ""}</td>
        <td>${n.this_sg || ""}</td>
        <td>${n.this_pl || ""}</td>
        <td class="muted">${n.fr || ""}</td>
      </tr>
    `).join("");

    this.setView(`
      <section class="card">
        ${bc}
        <h2>Références 📚</h2>
        <p class="muted">
          3 modules : <b>Verbes</b>, <b>Verbes à particules</b>, <b>Vocabulaire</b>.
          Recherche + filtre.
        </p>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
          <input id="ref-search" placeholder="Rechercher (ex: vara / gjort / gå ut / boken / husen)..." style="flex:1; min-width:240px;" />
          <select id="ref-scope" style="width:auto; min-width:190px;">
            <option value="all">Tout</option>
            <option value="verbs">Verbes</option>
            <option value="phrasal">Verbes à particules</option>
            <option value="nouns">Vocabulaire</option>
          </select>
        </div>
      </section>

      <section class="card" style="margin-top:12px;">
        <h3>Module 1 — Verbes (type Bescherelle)</h3>
        <div style="overflow:auto;">
          <table>
            <thead>
              <tr>
                <th>Infinitif</th><th>Présent</th><th>Prétérit</th><th>Supin</th><th>Impératif</th><th>FR</th>
              </tr>
            </thead>
            <tbody id="verb-rows">${renderRows(R.verbs)}</tbody>
          </table>
        </div>
      </section>

      <section class="card" style="margin-top:12px;">
        <h3>Module 2 — Verbes à particules</h3>
        <p class="muted">Très utiles au quotidien (ex : <i>gå ut</i>, <i>ta med</i>, <i>sätta på</i>…).</p>
        <div style="overflow:auto;">
          <table>
            <thead>
              <tr>
                <th>Infinitif</th><th>Présent</th><th>Prétérit</th><th>Supin</th><th>Impératif</th><th>FR</th>
              </tr>
            </thead>
            <tbody id="phrasal-rows">${renderRows(R.phrasalVerbs)}</tbody>
          </table>
        </div>
      </section>

      <section class="card" style="margin-top:12px;">
        <h3>Module 3 — Vocabulaire (articles + accords)</h3>
        <p class="muted">
          <b>un</b>=en/ett • <b>le</b>=défini • <b>des</b>=pluriel indéfini •
          <b>les</b>=pluriel défini • <b>ce</b>=den här/det här • <b>ces</b>=de här
        </p>
        <div style="overflow:auto;">
          <table>
            <thead>
              <tr>
                <th>Nom</th><th>un</th><th>le</th><th>des</th><th>les</th><th>ce</th><th>ces</th><th>FR</th>
              </tr>
            </thead>
            <tbody id="noun-rows">${renderNounRows(R.nouns)}</tbody>
          </table>
        </div>
      </section>

      <div style="margin-top:12px;">
        <button class="btn" onclick="Router.go('/')">← Retour accueil</button>
      </div>
    `);

    const input = document.getElementById("ref-search");
    const scope = document.getElementById("ref-scope");
    const norm = (x) => (x || "").toString().toLowerCase();

    const filter = () => {
      const q = norm(input.value).trim();
      const sc = scope.value;

      const inRow = (obj, fields) => {
        const hay = fields.map(k => norm(obj[k])).join(" | ");
        return !q || hay.includes(q);
      };

      const verbItems = (sc === "all" || sc === "verbs")
        ? R.verbs.filter(v => inRow(v, ["inf", "pres", "pret", "sup", "imp", "fr", "pron"]))
        : [];

      const phrasalItems = (sc === "all" || sc === "phrasal")
        ? R.phrasalVerbs.filter(v => inRow(v, ["inf", "pres", "pret", "sup", "imp", "fr", "pron"]))
        : [];

      const nounItems = (sc === "all" || sc === "nouns")
        ? R.nouns.filter(n => inRow(n, ["base", "indef", "def", "pl_indef", "pl_def", "this_sg", "this_pl", "fr", "pron"]))
        : [];

      document.getElementById("verb-rows").innerHTML = renderRows(verbItems);
      document.getElementById("phrasal-rows").innerHTML = renderRows(phrasalItems);
      document.getElementById("noun-rows").innerHTML = renderNounRows(nounItems);
    };

    input.addEventListener("input", filter);
    scope.addEventListener("change", filter);
  }
};

App.init();