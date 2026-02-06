// assets/js/app.js

const App = {
  mount: document.getElementById("app"),

  // ---------- Levels ----------
  levels: {},
  levelsOrder: ["A1", "A2", "B1", "B2"],

  // ---------- Reference ----------
  ref: { title: "Références", modules: [] },

  // Référence+ (tables filtrables)
  refPlus: {
    title: "Référence+ (tableaux)",
    themes: [],
    verbs: [],
    vocab: [],
    particles: [],
    articles: [],
    articles_guide: []
  },

  async init() {
    // Nav
    document.getElementById("nav-home").onclick = () => Router.go("/");
    const homeBtn = document.getElementById("nav-home-btn");
    if (homeBtn) homeBtn.onclick = () => Router.go("/");

    document.getElementById("nav-ref").onclick = () => Router.go("/ref");
    document.getElementById("nav-review").onclick = () => Router.go("/review");
    document.getElementById("nav-stats").onclick = () => Router.go("/stats");

    // Routes
    Router.on("/", () => this.viewHome());
    Router.on("/level", (p) => this.viewLevel(p.level));
    Router.on("/lesson", (p) => this.viewLesson(p.level, p.lessonId));

    Router.on("/ref", () => this.viewRef());
    Router.on("/ref-lesson", (p) => this.viewRefLesson(p.moduleId, p.lessonId));
    Router.on("/ref-plus", (p) => this.viewRefPlus(p));

    Router.on("/review", () => this.viewReview());
    Router.on("/stats", () => this.viewStats());

    // Load data
    await this.loadAllData();

    // Build SRS cards from lessons + upsert
    Storage.upsertCards(SRS.buildCardsFromLevels(this.levels));

    this.bindClicks();
    Router.start("/");
  },

  bindClicks() {
    // Event delegation: évite les onclick inline (plus robuste)
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;

      const action = el.dataset.action;
      if (action === 'open-level') {
        const level = el.dataset.level;
        if (level) Router.go('/level', { level });
        return;
      }

      if (action === 'open-lesson') {
        const level = el.dataset.level;
        const lessonId = el.dataset.lessonId;
        if (level && lessonId) Router.go('/lesson', { level, lessonId });
        return;
      }
    }, { passive: true });
  }


  // ---------- Loading ----------
  async loadAllData() {
    for (const lvl of this.levelsOrder) {
      try {
        this.levels[lvl] = await this.loadJson(`assets/data/${lvl.toLowerCase()}.json`, lvl);
      } catch (e) {
        console.warn("[level] non chargé:", lvl, e.message || e);
      }
    }

    try {
      const r = await this.loadJson("assets/data/ref.json", "REF");
      this.ref = this.normalizeRef(r);
    } catch (e) {
      console.warn("[ref] non chargé:", e.message || e);
      this.ref = { title: "Références", modules: [] };
    }

    try {
      const rp = await this.loadJson("assets/data/ref_plus.json", "REFPLUS");
      this.refPlus = this.normalizeRefPlus(rp);
    } catch (e) {
      console.warn("[ref_plus] non chargé:", e.message || e);
      this.refPlus = {
        title: "Référence+ (tableaux)",
        themes: [],
        verbs: [],
        vocab: [],
        particles: [],
        articles: [],
        articles_guide: []
      };
    }
  },

  async loadJson(url, kind = "") {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch fail ${url} (${res.status})`);
    const json = await res.json();

    if (kind !== "REF" && kind !== "REFPLUS") {
      return {
        level: json.level || kind,
        title: json.title || "",
        modules: Array.isArray(json.modules) ? json.modules : []
      };
    }
    return json;
  },

  // ---------- Normalizers ----------
  normalizeRef(json) {
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

      return {
        id: moduleId,
        title: m?.title || m?.name || `Module ${mi + 1}`,
        lessons: lessons.map((l, li) => ({
          id: (l?.id && String(l.id)) || `l${li + 1}`,
          title: l?.title || l?.name || `Fiche ${li + 1}`,
          content: Array.isArray(l?.content) ? l.content : (l?.content ? [String(l.content)] : []),
          vocab: Array.isArray(l?.vocab) ? l.vocab : [],
          examples: Array.isArray(l?.examples) ? l.examples : []
        }))
      };
    });

    return { title: root?.title || "Références", modules: normModules };
  },

  normalizeRefPlus(json) {
    const themes = Array.isArray(json.themes) ? json.themes : [];
    return {
      title: json.title || "Référence+ (tableaux)",
      themes,
      verbs: Array.isArray(json.verbs) ? json.verbs : [],
      vocab: Array.isArray(json.vocab) ? json.vocab : [],
      particles: Array.isArray(json.particles) ? json.particles : [],
      articles: Array.isArray(json.articles) ? json.articles : [],
      articles_guide: Array.isArray(json.articles_guide) ? json.articles_guide : []
    };
  },

  // ---------- Rendering helpers ----------
  setView(html) {
    this.mount.innerHTML = html;
  },

  renderTable(headers, rows) {
    const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
    return `<table class="zebra">${thead}${tbody}</table>`;
  },

  // ---------- HOME ----------
  viewHome() {
    const s = Storage.load();
    const doneCount = Object.keys(s.done || {}).length;
    const st = Storage.getSrsStats();

    const levelCards = this.levelsOrder
      .map(l => this.levels[l])
      .filter(Boolean)
      .map(L => `
        <div class="card">
          <span class="pill">Niveau ${L.level}</span>
          <h3 style="margin-top:10px;">${L.title ? `${L.level} — ${L.title}` : L.level}</h3>
          <p class="muted">Modules : ${(L.modules || []).length}</p>
          <button class="btn" data-action="open-level" data-level="${L.level}">Ouvrir</button>
        </div>
      `).join("");

    this.setView(`
      <section class="card">
        <h2>Bienvenue 👋</h2>
        <p class="muted">Objectif : apprendre le suédois (A1 → C2) avec cours + exercices + SRS.</p>

        <div class="kpi" style="margin-top:12px;">
          <span class="pill">Leçons validées : <b>${doneCount}</b></span>
          <span class="pill">Bonnes : <b>${s.stats?.correct ?? 0}</b></span>
          <span class="pill">Erreurs : <b>${s.stats?.wrong ?? 0}</b></span>
        </div>

        <hr />

        <div class="kpi">
          <span class="pill">Cartes SRS : <b>${st.total}</b></span>
          <span class="pill">À réviser : <b>${st.due}</b></span>
          <span class="pill">Limite/jour : <b>${st.dailyLimit}</b></span>
        </div>

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn" onclick="Router.go('/ref')">📚 Référence</button>
          <button class="btn" onclick="Router.go('/ref-plus',{theme:'all', section:'all'})">📋 Référence+</button>
          <button class="btn" onclick="Router.go('/ref-plus',{theme:'all', section:'articles'})">🧩 Articles & accords</button>
          <button class="btn" onclick="Router.go('/review')">🎴 Révision</button>
          <button class="btn" onclick="Router.go('/stats')">📈 Stats</button>
        </div>
      </section>

      <section class="grid grid-2" style="margin-top:12px;">
        ${levelCards || `
          <div class="card">
            <h3>Aucun niveau chargé</h3>
            <p class="muted">Vérifie que tes fichiers JSON existent dans <code>assets/data/</code>.</p>
          </div>
        `}
      </section>
    `);
  },

  // ---------- LEVELS ----------
  viewLevel(level) {
    const L = this.levels[level];
    if (!L) {
      return this.setView(`
        <section class="card">
          <h2>Niveau introuvable</h2>
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </section>
      `);
    }

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
                <button class="btn" data-action="open-lesson" data-level="${L.level}" data-lesson-id="${les.id}">
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
    const L = this.levels[level];
    if (!L) return this.setView(`<section class="card"><h2>Leçon introuvable</h2></section>`);

    const lesson = (L.modules || []).flatMap(m => (m.lessons || [])).find(x => x.id === lessonId);
    if (!lesson) {
      return this.setView(`
        <section class="card">
          <h2>Leçon introuvable</h2>
          <button class="btn" data-action="open-level" data-level="${L.level}">← Retour</button>
        </section>
      `);
    }

    const contentHtml = (lesson.content || []).map(p => `<p>${p}</p>`).join("");
    const examplesHtml = (lesson.examples || []).map(e => `
      <div class="choice" style="cursor:default;">
        <div>
          <b>${e.sv || ""}</b>
          <div class="muted">${e.fr || ""}${e.pron ? ` • <i>${e.pron}</i>` : ""}</div>
        </div>
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
          <button class="btn" data-action="open-level" data-level="${L.level}">← Retour</button>
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
      const setFeedback = (ok, extra="") => fb.textContent = ok ? `✅ Correct. ${extra}` : `❌ Non. ${extra}`;
      const locked = () => answered[idx];

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
            if (locked()) return;
            const i = Number(node.dataset.i);
            const ok = i === q.answerIndex;
            Storage.addResult(ok);
            answered[idx] = true;
            nodes.forEach(n => n.classList.remove("correct","wrong"));
            node.classList.add(ok ? "correct" : "wrong");
            const ans = (q.choices && q.choices[q.answerIndex] != null) ? q.choices[q.answerIndex] : "";
            setFeedback(ok, ok ? "" : `Réponse : ${ans}`);
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
          if (locked()) return;
          const val = (input.value || "").trim().toLowerCase();
          const exp = (q.answer || "").trim().toLowerCase();
          const ok = val === exp;
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

  // ---------- REF (cartes/fiches) ----------
  viewRef() {
    const R = this.ref;
    const modules = R.modules || [];

    this.setView(`
      <section class="card">
        <span class="pill">Référence</span>
        <h2 style="margin-top:10px;">${R.title || "Références"}</h2>
        <p class="muted">Choisis un module, puis une fiche. (Astuce : pour les tableaux, va sur Référence+.)</p>

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn" onclick="Router.go('/ref-plus',{theme:'all', section:'all'})">📋 Référence+ (tableaux)</button>
          <button class="btn" onclick="Router.go('/ref-plus',{theme:'all', section:'articles'})">🧩 Articles & accords</button>
          <button class="btn" onclick="Router.go('/')">← Accueil</button>
        </div>
      </section>

      <section style="margin-top:12px;" class="grid">
        ${modules.map(m => `
          <div class="card">
            <h3>${m.title || "Module"}</h3>
            <p class="muted">Fiches : ${(m.lessons || []).length}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              ${(m.lessons || []).map(les => `
                <button class="btn" onclick="Router.go('/ref-lesson',{moduleId:'${m.id}', lessonId:'${les.id}'})">${les.title || "Fiche"}</button>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </section>
    `);
  },

  viewRefLesson(moduleId, lessonId) {
    const mod = (this.ref.modules || []).find(x => x.id === moduleId);
    const lesson = mod?.lessons?.find(x => x.id === lessonId);

    if (!mod || !lesson) {
      return this.setView(`
        <section class="card">
          <h2>Fiche introuvable</h2>
          <button class="btn" onclick="Router.go('/ref')">← Retour</button>
        </section>
      `);
    }

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
        <span class="pill">Référence</span>
        <h2 style="margin-top:10px;">${lesson.title || "Fiche"}</h2>

        ${contentHtml}
        ${(lesson.examples && lesson.examples.length) ? `<hr /><h3>Exemples</h3>${examplesHtml}` : ""}
        ${(lesson.vocab && lesson.vocab.length) ? `<hr /><h3>Vocabulaire</h3>${vocabHtml}` : ""}

        <div style="margin-top:12px;">
          <button class="btn" onclick="Router.go('/ref')">← Retour</button>
        </div>
      </section>
    `);
  },

  // ---------- REF+ (filtered tables) ----------
  viewRefPlus(params = {}) {
    const R = this.refPlus;

    const theme = (params.theme || "all").toLowerCase();
    const section = (params.section || "all").toLowerCase();

    const themesList = (R.themes && R.themes.length)
      ? R.themes
      : [{ id: "all", label: "Tous" }];

    const themeOptions = themesList.map(t =>
      `<option value="${t.id}" ${t.id === theme ? "selected" : ""}>${t.label}</option>`
    ).join("");

    const sectionOptions = [
      { id: "all", label: "Tout" },
      { id: "verbs", label: "Verbes" },
      { id: "vocab", label: "Vocabulaire" },
      { id: "particles", label: "Verbes à particules" },
      { id: "articles", label: "Articles & accords (noms + adj.)" }
    ].map(s =>
      `<option value="${s.id}" ${s.id === section ? "selected" : ""}>${s.label}</option>`
    ).join("");

    const filterByTheme = (arr) => {
      if (theme === "all") return (arr || []);
      return (arr || []).filter(x => (x.theme || "daily") === theme);
    };

    const verbs = filterByTheme(R.verbs);
    const vocab = filterByTheme(R.vocab);
    const particles = filterByTheme(R.particles);
    const articles = filterByTheme(R.articles);

    const showVerbs = section === "all" || section === "verbs";
    const showVocab = section === "all" || section === "vocab";
    const showParticles = section === "all" || section === "particles";
    const showArticles = section === "all" || section === "articles";

    const tableVerbs = this.renderTable(
      ["Inf.", "Présent", "Prétérit", "Supin", "Imp.", "FR", "Note", "Exemple"],
      (verbs || []).map(v => [
        `${v.inf || ""}`,
        `${v.pres || ""}`,
        `${v.pret || ""}`,
        `${v.sup || ""}`,
        `${v.imp || ""}`,
        `${v.fr || ""}`,
        `${v.note || ""}`,
        `${v.ex_sv || ""}${v.pron ? ` <span class="muted">• <i>${v.pron}</i></span>` : ""}<br><span class="muted">${v.ex_fr || ""}</span>`
      ])
    );

    const tableVocab = this.renderTable(
      ["SV", "FR", "Pron", "en/ett", "Déf. sg", "Pl", "Déf. pl"],
      (vocab || []).map(w => [
        `${w.sv || ""}`,
        `${w.fr || ""}`,
        `${w.pron || ""}`,
        `${w.enett || ""}`,
        `${w.def_sg || ""}`,
        `${w.pl || ""}`,
        `${w.def_pl || ""}`
      ])
    );

    const tableParticles = this.renderTable(
      ["SV", "FR", "Pron", "Exemple"],
      (particles || []).map(p => [
        `${p.sv || ""}`,
        `${p.fr || ""}`,
        `${p.pron || ""}`,
        `${p.ex_sv || ""}<br><span class="muted">${p.ex_fr || ""}</span>`
      ])
    );

    const guideHtml = (R.articles_guide || []).length
      ? `<div class="muted" style="margin-top:10px;">${(R.articles_guide || []).map(x => `<div>• ${x}</div>`).join("")}</div>`
      : "";

    const tableArticles = this.renderTable(
      ["Base", "FR", "en/ett", "Déf. sg", "Pl (indéf.)", "Pl (déf.)", "Démonstratif sg", "Démonstratif pl", "Ex. avec adjectif", "Note"],
      (articles || []).map(a => [
        `${a.base || ""}`,
        `${a.fr || ""}${a.pron ? ` <span class="muted">• <i>${a.pron}</i></span>` : ""}`,
        `${a.enett || ""}`,
        `${a.def_sg || ""}`,
        `${a.indef_pl || ""}`,
        `${a.def_pl || ""}`,
        `${a.demo_sg || ""}`,
        `${a.demo_pl || ""}`,
        `${a.adj_example || ""}`,
        `${a.note || ""}`
      ])
    );

    const noData =
      (showVerbs && verbs.length === 0) &&
      (showVocab && vocab.length === 0) &&
      (showParticles && particles.length === 0) &&
      (showArticles && articles.length === 0);

    this.setView(`
      <section class="card">
        <span class="pill">Référence+</span>
        <h2 style="margin-top:10px;">${R.title || "Référence+ (tableaux)"}</h2>
        <p class="muted">Filtre par thème (global) + section.</p>

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <label class="muted">Thème</label>
          <select id="ref-theme" style="max-width:260px;">
            ${themeOptions}
          </select>

          <label class="muted">Section</label>
          <select id="ref-section" style="max-width:320px;">
            ${sectionOptions}
          </select>

          <button class="btn" onclick="Router.go('/ref')">📚 Référence</button>
          <button class="btn" onclick="Router.go('/')">← Accueil</button>
        </div>
      </section>

      ${noData ? `
        <section class="card" style="margin-top:12px;">
          <h3>Aucun résultat</h3>
          <p class="muted">Aucune entrée pour ce thème/section. Essaie “Tous”.</p>
        </section>
      ` : ""}

      ${showVerbs ? `
        <section class="card" style="margin-top:12px;">
          <h3>Verbes essentiels</h3>
          <div class="table-wrap">${tableVerbs}</div>
        </section>
      ` : ""}

      ${showVocab ? `
        <section class="card" style="margin-top:12px;">
          <h3>Vocabulaire 20/80 + accords</h3>
          <div class="table-wrap">${tableVocab}</div>
        </section>
      ` : ""}

      ${showParticles ? `
        <section class="card" style="margin-top:12px;">
          <h3>Verbes à particules</h3>
          <div class="table-wrap">${tableParticles}</div>
        </section>
      ` : ""}

      ${showArticles ? `
        <section class="card" style="margin-top:12px;">
          <h3>Articles & accords (noms + adjectifs)</h3>
          <p class="muted">Tableau “réflexe” : indéfini → défini → pluriel → démonstratifs, + accord de l’adjectif.</p>
          ${guideHtml}
          <div class="table-wrap" style="margin-top:12px;">${tableArticles}</div>
        </section>
      ` : ""}
    `);

    const themeSel = document.getElementById("ref-theme");
    const sectionSel = document.getElementById("ref-section");

    if (themeSel) {
      themeSel.onchange = () => {
        Router.go("/ref-plus", { theme: themeSel.value, section: sectionSel ? sectionSel.value : "all" });
      };
    }
    if (sectionSel) {
      sectionSel.onchange = () => {
        Router.go("/ref-plus", { theme: themeSel ? themeSel.value : "all", section: sectionSel.value });
      };
    }
  },

  // ---------- REVIEW (SRS) ----------
  viewReview() {
    const s = Storage.load();
    const dailyLimit = (s.srs && typeof s.srs.dailyLimit === "number") ? s.srs.dailyLimit : 30;
    const due = Storage.getDueCards(dailyLimit);

    // Small settings panel (requested earlier)
    if (due.length === 0) {
      const st = Storage.getSrsStats();
      return this.setView(`
        <section class="card">
          <h2>Révision 🎴</h2>
          <p class="muted">Aucune carte à réviser pour le moment.</p>

          <hr />
          <div class="card">
            <h3>Paramètres</h3>
            <p class="muted">Choisis combien de cartes max tu veux réviser par jour.</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
              <label class="muted">Limite/jour</label>
              <input id="srs-limit" type="number" min="5" max="200" value="${st.dailyLimit}" style="max-width:160px;" />
              <button class="btn" onclick="App._saveDailyLimit()">Enregistrer</button>
            </div>
          </div>

          <hr />
          <div class="kpi">
            <span class="pill">Cartes SRS : <b>${st.total}</b></span>
            <span class="pill">À réviser : <b>${st.due}</b></span>
            <span class="pill">Limite/jour : <b>${st.dailyLimit}</b></span>
          </div>
          <hr />
          <button class="btn" onclick="Router.go('/')">← Accueil</button>
        </section>
      `);
    }

    let idx = 0;
    let showBack = false;

    const render = () => {
      const card = due[idx];
      const progress = `${idx + 1} / ${due.length}`;

      this.setView(`
        <section class="card">
          <h2>Révision 🎴</h2>
          <p class="muted">Carte ${progress}</p>

          <div class="card" style="margin-top:12px;">
            <h3>${showBack ? "Réponse" : "Question"}</h3>
            <p style="white-space:pre-line; margin-top:10px;">${showBack ? (card.back || "") : (card.front || "")}</p>

            <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn" onclick="App._toggleBack()">👁️ ${showBack ? "Masquer" : "Voir"} la réponse</button>
              <button class="btn" onclick="Router.go('/')">Quitter</button>
            </div>
          </div>

          ${showBack ? `
            <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn" onclick="App._grade('again')">Again</button>
              <button class="btn" onclick="App._grade('hard')">Hard</button>
              <button class="btn" onclick="App._grade('good')">Good</button>
              <button class="btn" onclick="App._grade('easy')">Easy</button>
            </div>
          ` : `
            <p class="muted" style="margin-top:12px;">Clique “Voir la réponse” puis choisis une note.</p>
          `}

          <hr />

          <div class="card">
            <h3>Paramètres</h3>
            <p class="muted">Limite/jour (impacte les cartes sélectionnées pour la session).</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
              <label class="muted">Limite/jour</label>
              <input id="srs-limit" type="number" min="5" max="200" value="${dailyLimit}" style="max-width:160px;" />
              <button class="btn" onclick="App._saveDailyLimit()">Enregistrer</button>
            </div>
          </div>
        </section>
      `);
    };

    this._saveDailyLimit = () => {
      const input = document.getElementById("srs-limit");
      const val = Math.max(5, Math.min(200, Number(input?.value || 30)));
      Storage.setDailyLimit(val);
      // Reload review so due list respects new limit
      Router.go("/review");
    };

    this._toggleBack = () => { showBack = !showBack; render(); };
    this._grade = (g) => {
      const card = due[idx];
      const map = { again: 0, hard: 1, good: 2, easy: 3 };
      Storage.gradeCard(card.id, map[g] ?? 2);

      idx++;
      showBack = false;

      if (idx >= due.length) {
        const st = Storage.getSrsStats();
        return this.setView(`
          <section class="card">
            <h2>Révision terminée ✅</h2>
            <p class="muted">Bravo — session du jour terminée.</p>
            <div class="kpi" style="margin-top:12px;">
              <span class="pill">Cartes totales : <b>${st.total}</b></span>
              <span class="pill">Encore dues : <b>${st.due}</b></span>
            </div>
            <hr />
            <button class="btn" onclick="Router.go('/')">← Accueil</button>
          </section>
        `);
      }

      render();
    };

    render();
  },

  // ---------- STATS ----------
  viewStats() {
    const s = Storage.load();
    const total = (s.stats?.correct ?? 0) + (s.stats?.wrong ?? 0);
    const rate = total ? Math.round(((s.stats?.correct ?? 0) / total) * 100) : 0;
    const st = Storage.getSrsStats();

    this.setView(`
      <section class="card">
        <h2>Stats 📈</h2>

        <div class="kpi" style="margin-top:12px;">
          <span class="pill">Total réponses : <b>${total}</b></span>
          <span class="pill">Taux : <b>${rate}%</b></span>
          <span class="pill">Bonnes : <b>${s.stats?.correct ?? 0}</b></span>
          <span class="pill">Erreurs : <b>${s.stats?.wrong ?? 0}</b></span>
        </div>

        <hr />

        <div class="kpi">
          <span class="pill">Cartes SRS : <b>${st.total}</b></span>
          <span class="pill">À réviser : <b>${st.due}</b></span>
          <span class="pill">Limite/jour : <b>${st.dailyLimit}</b></span>
        </div>

        <hr />

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn" onclick="localStorage.removeItem(Storage.key); location.reload()">Réinitialiser</button>
          <button class="btn" onclick="Router.go('/')">← Accueil</button>
        </div>
      </section>
    `);
  }
};

App.init();
