// assets/js/app.js

const App = {
  mount: document.getElementById("app"),

  levels: {},
  levelsOrder: ["A1", "A2", "B1"],

  ref: { title: "Références", modules: [] },
  refPlus: { title: "Référence+ (tableaux)", themes: [], verbs: [], vocab: [], particles: [] },

  async init() {
    document.getElementById("nav-home").onclick = () => Router.go("/");
    document.getElementById("nav-home-btn").onclick = () => Router.go("/");
    document.getElementById("nav-ref").onclick = () => Router.go("/ref");
    document.getElementById("nav-review").onclick = () => Router.go("/review");
    document.getElementById("nav-stats").onclick = () => Router.go("/stats");

    Router.on("/", () => this.viewHome());
    Router.on("/level", (p) => this.viewLevel(p.level));
    Router.on("/lesson", (p) => this.viewLesson(p.level, p.lessonId));

    Router.on("/ref", () => this.viewRef());
    Router.on("/ref-lesson", (p) => this.viewRefLesson(p.moduleId, p.lessonId));
    Router.on("/ref-plus", (p) => this.viewRefPlus(p));

    Router.on("/review", () => this.viewReview());
    Router.on("/stats", () => this.viewStats());

    await this.loadAllData();
    Storage.upsertCards(SRS.buildCardsFromLevels(this.levels));

    Router.start("/");
  },

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
      this.refPlus = { title: "Référence+ (tableaux)", themes: [], verbs: [], vocab: [], particles: [] };
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
      particles: Array.isArray(json.particles) ? json.particles : []
    };
  },

  setView(html) {
    this.mount.innerHTML = html;
  },

  // ---------------- PEDAGO RENDERER (NO JSON CHANGE) ----------------

  esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  },

  // inline formatting: **bold**, *italic*, `code`
  renderInline(text) {
    let t = this.esc(text);

    // code
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");

    // bold
    t = t.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

    // italic (avoid conflict with bold already processed)
    t = t.replace(/\*([^*]+)\*/g, "<i>$1</i>");

    // simple arrows
    t = t.replaceAll("->", "→");

    return t;
  },

  // callouts: [TIP] ..., [WARNING] ..., [MEMO] ..., [PRON] ..., [TRAP] ..., [EX] ...
  renderCallout(kind, bodyHtml) {
    const map = {
      TIP: { label: "Astuce", icon: "✅" },
      WARNING: { label: "Attention", icon: "⚠️" },
      MEMO: { label: "Mémo", icon: "🧠" },
      PRON: { label: "Prononciation", icon: "🗣️" },
      TRAP: { label: "Piège (FR → SV)", icon: "🇫🇷➡️🇸🇪" },
      EX: { label: "Exemple", icon: "💬" }
    };
    const meta = map[kind] || { label: kind, icon: "ℹ️" };

    // use existing .card styling (nested card)
    return `
      <div class="card" style="margin:12px 0; padding:16px;">
        <div class="muted" style="font-weight:700; margin-bottom:8px;">${meta.icon} ${meta.label}</div>
        <div>${bodyHtml}</div>
      </div>
    `;
  },

  // Supports:
  // - "## title" / "### subtitle"
  // - "- item" list
  // - "[TIP] ..." single line callout
  // - "[SPOILER:Title]" ... "[END]" collapsible block (content inside can include normal lines)
  renderContentBlock(lines = []) {
    const out = [];
    let listOpen = false;

    const closeList = () => {
      if (listOpen) {
        out.push("</ul>");
        listOpen = false;
      }
    };

    // spoiler handling
    let inSpoiler = false;
    let spoilerTitle = "";
    let spoilerLines = [];

    const flushSpoiler = () => {
      if (!inSpoiler) return;
      const inner = this.renderContentBlock(spoilerLines);
      out.push(`
        <details class="card" style="margin:12px 0; padding:14px;">
          <summary style="cursor:pointer; font-weight:700;">${this.renderInline(spoilerTitle || "Détails")}</summary>
          <div style="margin-top:10px;">${inner}</div>
        </details>
      `);
      inSpoiler = false;
      spoilerTitle = "";
      spoilerLines = [];
    };

    for (const raw of lines) {
      const line = String(raw ?? "").trim();

      if (!line) {
        // blank line = paragraph break
        if (inSpoiler) spoilerLines.push("");
        else {
          closeList();
          out.push(`<div style="height:6px;"></div>`);
        }
        continue;
      }

      // spoiler start
      const spo = line.match(/^\[SPOILER:(.+?)\]$/i);
      if (spo) {
        closeList();
        flushSpoiler();
        inSpoiler = true;
        spoilerTitle = spo[1].trim();
        spoilerLines = [];
        continue;
      }
      // spoiler end
      if (/^\[END\]$/i.test(line)) {
        closeList();
        flushSpoiler();
        continue;
      }

      // if inside spoiler, just collect
      if (inSpoiler) {
        spoilerLines.push(line);
        continue;
      }

      // headings
      if (line.startsWith("### ")) {
        closeList();
        out.push(`<h3 style="margin:14px 0 8px;">${this.renderInline(line.slice(4))}</h3>`);
        continue;
      }
      if (line.startsWith("## ")) {
        closeList();
        out.push(`<h2 style="margin:16px 0 10px;">${this.renderInline(line.slice(3))}</h2>`);
        continue;
      }

      // callouts one-liners
      const call = line.match(/^\[(TIP|WARNING|MEMO|PRON|TRAP|EX)\]\s*(.+)$/i);
      if (call) {
        closeList();
        const kind = call[1].toUpperCase();
        const body = this.renderInline(call[2]);
        out.push(this.renderCallout(kind, `<p style="margin:0;">${body}</p>`));
        continue;
      }

      // list items
      const li = line.match(/^[-*]\s+(.+)$/);
      if (li) {
        if (!listOpen) {
          closeList();
          out.push(`<ul style="margin:8px 0 8px 20px;">`);
          listOpen = true;
        }
        out.push(`<li style="margin:6px 0;">${this.renderInline(li[1])}</li>`);
        continue;
      }

      // normal paragraph
      closeList();
      out.push(`<p style="margin:8px 0;">${this.renderInline(line)}</p>`);
    }

    closeList();
    flushSpoiler();

    return out.join("");
  },

  // ------------- HOME -------------
  viewHome() {
    const s = Storage.load();
    const doneCount = Object.keys(s.done).length;
    const st = Storage.getSrsStats();

    const levelCards = this.levelsOrder
      .map(l => this.levels[l])
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
        <p class="muted">Objectif : apprendre le suédois (A1 → C2) avec cours + exercices + SRS.</p>

        <div class="kpi" style="margin-top:12px;">
          <span class="pill">Leçons validées : <b>${doneCount}</b></span>
          <span class="pill">Bonnes : <b>${s.stats.correct}</b></span>
          <span class="pill">Erreurs : <b>${s.stats.wrong}</b></span>
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
          <button class="btn" onclick="Router.go('/review')">🎴 Révision</button>
          <button class="btn" onclick="Router.go('/stats')">📈 Stats</button>
        </div>
      </section>

      <section class="grid grid-2" style="margin-top:12px;">
        ${levelCards}
      </section>
    `);
  },

  // ------------- LEVELS -------------
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
    const L = this.levels[level];
    if (!L) return this.setView(`<section class="card"><h2>Leçon introuvable</h2></section>`);

    const lesson = (L.modules || []).flatMap(m => (m.lessons || [])).find(x => x.id === lessonId);
    if (!lesson) {
      return this.setView(`
        <section class="card">
          <h2>Leçon introuvable</h2>
          <button class="btn" onclick="Router.go('/level',{level:'${L.level}'})">← Retour</button>
        </section>
      `);
    }

    // ✅ Better pedagogy rendering without JSON changes
    const contentHtml = this.renderContentBlock(lesson.content || []);

    const examplesHtml = (lesson.examples || []).map(e => `
      <div class="choice" style="cursor:default;">
        <div>
          <b>${this.esc(e.sv || "")}</b>
          <div class="muted">${this.esc(e.fr || "")}${e.pron ? ` • <i>${this.esc(e.pron)}</i>` : ""}</div>
        </div>
      </div>
    `).join("");

    const vocabHtml = (lesson.vocab || []).map(w => `
      <div class="choice" style="cursor:default;">
        <div style="min-width:130px;"><b>${this.esc(w.sv || "")}</b></div>
        <div class="muted">${this.esc(w.fr || "")}${w.pron ? ` • <i>${this.esc(w.pron)}</i>` : ""}</div>
      </div>
    `).join("");

    this.setView(`
      <section class="card">
        <span class="pill">${L.level}</span>
        <h2 style="margin-top:10px;">${this.esc(lesson.title || "Leçon")}</h2>

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
      const setFeedback = (ok, extra="") => fb.textContent = ok ? `✅ Correct. ${extra}` : `❌ Non. ${extra}`;
      const locked = () => answered[idx];

      if (q.type === "mcq") {
        qbox.innerHTML = `
          <p><b>${this.esc(q.q || "")}</b></p>
          <div class="grid">
            ${(q.choices || []).map((c, i) => `<div class="choice" data-i="${i}">${this.esc(c)}</div>`).join("")}
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
          <p><b>${this.esc(q.q || "")}</b></p>
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

  // ---------------- REF (cards/fiches) ----------------
  viewRef() {
    const R = this.ref;
    const modules = R.modules || [];

    this.setView(`
      <section class="card">
        <span class="pill">Référence</span>
        <h2 style="margin-top:10px;">${this.esc(R.title || "Références")}</h2>
        <p class="muted">Choisis un module, puis une fiche.</p>

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn" onclick="Router.go('/ref-plus',{theme:'all', section:'all'})">📋 Référence+ (tableaux)</button>
          <button class="btn" onclick="Router.go('/')">← Accueil</button>
        </div>
      </section>

      <section style="margin-top:12px;" class="grid">
        ${modules.map(m => `
          <div class="card">
            <h3>${this.esc(m.title || "Module")}</h3>
            <p class="muted">Fiches : ${(m.lessons || []).length}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              ${(m.lessons || []).map(les => `
                <button class="btn" onclick="Router.go('/ref-lesson',{moduleId:'${m.id}', lessonId:'${les.id}'})">${this.esc(les.title || "Fiche")}</button>
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

    // same pedago rendering for ref fiches
    const contentHtml = this.renderContentBlock(lesson.content || []);

    const examplesHtml = (lesson.examples || []).map(e => `
      <div class="choice" style="cursor:default;">
        <div><b>${this.esc(e.sv || "")}</b><div class="muted">${this.esc(e.fr || "")}${e.pron ? ` • <i>${this.esc(e.pron)}</i>` : ""}</div></div>
      </div>
    `).join("");

    const vocabHtml = (lesson.vocab || []).map(w => `
      <div class="choice" style="cursor:default;">
        <div style="min-width:130px;"><b>${this.esc(w.sv || "")}</b></div>
        <div class="muted">${this.esc(w.fr || "")}${w.pron ? ` • <i>${this.esc(w.pron)}</i>` : ""}</div>
      </div>
    `).join("");

    this.setView(`
      <section class="card">
        <span class="pill">Référence</span>
        <h2 style="margin-top:10px;">${this.esc(lesson.title || "Fiche")}</h2>

        ${contentHtml}
        ${(lesson.examples && lesson.examples.length) ? `<hr /><h3>Exemples</h3>${examplesHtml}` : ""}
        ${(lesson.vocab && lesson.vocab.length) ? `<hr /><h3>Vocabulaire</h3>${vocabHtml}` : ""}

        <div style="margin-top:12px;">
          <button class="btn" onclick="Router.go('/ref')">← Retour</button>
        </div>
      </section>
    `);
  },

  // ---------------- REF+ (kept, minimal) ----------------
  viewRefPlus(params = {}) {
    const R = this.refPlus;

    const theme = (params.theme || "all").toLowerCase();
    const section = (params.section || "all").toLowerCase();

    const themesList = (R.themes && R.themes.length)
      ? R.themes
      : [{ id: "all", label: "Tous" }];

    const themeOptions = themesList.map(t =>
      `<option value="${t.id}" ${t.id === theme ? "selected" : ""}>${this.esc(t.label)}</option>`
    ).join("");

    const sectionOptions = [
      { id: "all", label: "Tout" },
      { id: "verbs", label: "Verbes" },
      { id: "vocab", label: "Vocabulaire" },
      { id: "particles", label: "Verbes à particules" }
    ].map(s =>
      `<option value="${s.id}" ${s.id === section ? "selected" : ""}>${this.esc(s.label)}</option>`
    ).join("");

    const filterByTheme = (arr) => {
      if (theme === "all") return arr || [];
      return (arr || []).filter(x => (x.theme || "daily") === theme);
    };

    const verbs = filterByTheme(R.verbs);
    const vocab = filterByTheme(R.vocab);
    const particles = filterByTheme(R.particles);

    const showVerbs = section === "all" || section === "verbs";
    const showVocab = section === "all" || section === "vocab";
    const showParticles = section === "all" || section === "particles";

    const tableVerbs = this.renderTable(
      ["Inf.", "Présent", "Prétérit", "Supin", "Imp.", "FR", "Note", "Exemple"],
      (verbs || []).map(v => [
        this.esc(v.inf || ""),
        this.esc(v.pres || ""),
        this.esc(v.pret || ""),
        this.esc(v.sup || ""),
        this.esc(v.imp || ""),
        this.esc(v.fr || ""),
        this.esc(v.note || ""),
        `${this.esc(v.ex_sv || "")}${v.pron ? ` <span class="muted">• <i>${this.esc(v.pron)}</i></span>` : ""}<br><span class="muted">${this.esc(v.ex_fr || "")}</span>`
      ])
    );

    const tableVocab = this.renderTable(
      ["SV", "FR", "Pron", "en/ett", "Déf. sg", "Pl", "Déf. pl"],
      (vocab || []).map(w => [
        this.esc(w.sv || ""),
        this.esc(w.fr || ""),
        this.esc(w.pron || ""),
        this.esc(w.enett || ""),
        this.esc(w.def_sg || ""),
        this.esc(w.pl || ""),
        this.esc(w.def_pl || "")
      ])
    );

    const tableParticles = this.renderTable(
      ["SV", "FR", "Pron", "Exemple"],
      (particles || []).map(p => [
        this.esc(p.sv || ""),
        this.esc(p.fr || ""),
        this.esc(p.pron || ""),
        `${this.esc(p.ex_sv || "")}<br><span class="muted">${this.esc(p.ex_fr || "")}</span>`
      ])
    );

    const noData =
      (showVerbs && verbs.length === 0) &&
      (showVocab && vocab.length === 0) &&
      (showParticles && particles.length === 0);

    this.setView(`
      <section class="card">
        <span class="pill">Référence+</span>
        <h2 style="margin-top:10px;">${this.esc(R.title || "Référence+ (tableaux)")}</h2>
        <p class="muted">Filtre par thème (global) + section.</p>

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <label class="muted">Thème</label>
          <select id="ref-theme" style="max-width:260px;">${themeOptions}</select>

          <label class="muted">Section</label>
          <select id="ref-section" style="max-width:260px;">${sectionOptions}</select>

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
    `);

    const themeSel = document.getElementById("ref-theme");
    const sectionSel = document.getElementById("ref-section");

    if (themeSel) {
      themeSel.onchange = () => Router.go("/ref-plus", { theme: themeSel.value, section: sectionSel ? sectionSel.value : "all" });
    }
    if (sectionSel) {
      sectionSel.onchange = () => Router.go("/ref-plus", { theme: themeSel ? themeSel.value : "all", section: sectionSel.value });
    }
  },

  renderTable(headers, rows) {
    const thead = `<thead><tr>${headers.map(h => `<th>${this.esc(h)}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
    return `<table class="zebra">${thead}${tbody}</table>`;
  },

  // ---------------- REVIEW (SRS) ----------------
  viewReview() {
    const s = Storage.load();
    const due = Storage.getDueCards(s.srs.dailyLimit || 30);

    if (due.length === 0) {
      const st = Storage.getSrsStats();
      return this.setView(`
        <section class="card">
          <h2>Révision 🎴</h2>
          <p class="muted">Aucune carte à réviser pour le moment.</p>
          <div class="kpi" style="margin-top:12px;">
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
            <p style="white-space:pre-line; margin-top:10px;">${this.esc(showBack ? (card.back || "") : (card.front || ""))}</p>

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
        </section>
      `);
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

  // ---------------- STATS ----------------
  viewStats() {
    const s = Storage.load();
    const total = s.stats.correct + s.stats.wrong;
    const rate = total ? Math.round((s.stats.correct / total) * 100) : 0;
    const st = Storage.getSrsStats();

    this.setView(`
      <section class="card">
        <h2>Stats 📈</h2>

        <div class="kpi" style="margin-top:12px;">
          <span class="pill">Total réponses : <b>${total}</b></span>
          <span class="pill">Taux : <b>${rate}%</b></span>
          <span class="pill">Bonnes : <b>${s.stats.correct}</b></span>
          <span class="pill">Erreurs : <b>${s.stats.wrong}</b></span>
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