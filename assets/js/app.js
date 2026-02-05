// assets/js/app.js

const App = {
  mount: document.getElementById("app"),

  levels: {},
  levelsOrder: ["A1", "A2", "B1", "B2"],

  refData: null,

  async init() {
    // Nav
    const navHome = document.getElementById("nav-home");
    const navReview = document.getElementById("nav-review");
    const navStats = document.getElementById("nav-stats");
    const navRef = document.getElementById("nav-ref");

    if (navHome) navHome.onclick = () => Router.go("/");
    if (navReview) navReview.onclick = () => Router.go("/review");
    if (navStats) navStats.onclick = () => Router.go("/stats");
    if (navRef) navRef.onclick = () => Router.go("/ref");

    // Routes
    Router.on("/", () => this.viewHome());
    Router.on("/level", (p) => this.viewLevel(p.level));
    Router.on("/lesson", (p) => this.viewLesson(p.level, p.lessonId));
    Router.on("/review", () => this.viewReview());
    Router.on("/stats", () => this.viewStats());

    // Référence
    Router.on("/ref", () => this.viewRef());
    Router.on("/ref-sheet", (p) => this.viewRefSheet(p.moduleId));

    // Preload
    await this.preloadLevels();
    await this.preloadRef();

    Router.start("/");
  },

  // -------------------- LOADERS --------------------

  async loadJson(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);
    return await res.json();
  },

  async preloadLevels() {
    this.levels = {};
    for (const lvl of this.levelsOrder) {
      try {
        this.levels[lvl] = await this.loadLevel(lvl);
      } catch (e) {
        console.warn(`[loadLevel] ${lvl} non chargé:`, e.message || e);
      }
    }
  },

  async loadLevel(level) {
    const map = {
      A1: "assets/data/a1.json",
      A2: "assets/data/a2.json",
      B1: "assets/data/b1.json",
      B2: "assets/data/b2.json"
    };
    const url = map[level];
    if (!url) throw new Error(`Niveau non supporté: ${level}`);

    const json = await this.loadJson(url);
    return {
      level: json.level || level,
      title: json.title || "",
      modules: Array.isArray(json.modules) ? json.modules : []
    };
  },

  async preloadRef() {
    try {
      this.refData = await this.loadJson("assets/data/ref.json");
    } catch (e) {
      this.refData = null;
      console.warn("[ref] non chargé:", e.message || e);
    }
  },

  // -------------------- HELPERS --------------------

  setView(html) {
    this.mount.innerHTML = html;
  },

  getLevelData(level) {
    return this.levels[level] || null;
  },

  escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  },

  // Permet d’injecter une string dans onclick sans casser (JSON.stringify safe)
  jsString(s) {
    return JSON.stringify(String(s ?? ""));
  },

  // ----------- RÉFÉRENCE : extraction ultra-tolérante -----------

  refGetModules() {
    const r = this.refData;
    if (!r) return [];

    return (
      (Array.isArray(r.modules) && r.modules) ||
      (Array.isArray(r.sections) && r.sections) ||
      (Array.isArray(r.sheets) && r.sheets) ||
      (Array.isArray(r.categories) && r.categories) ||
      []
    );
  },

  refGetModuleId(mod, idx) {
    return String(mod.id || mod.key || mod.slug || mod.name || mod.title || `module_${idx}`);
  },

  // Détecte si un objet ressemble à une entrée de ref (verbe / vocab / particule)
  looksLikeRefItem(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
    const keys = Object.keys(obj);

    // verbes (bescherelle)
    const verbKeys = ["infinitive","inf","sv_inf","pres","present","pret","preteritum","past","sup","supinum","imp","imperativ"];
    // vocab
    const vocabKeys = ["sv","word","lemma","fr","meaning","translation"];
    // particules
    const partKeys = ["expression","verb","particle","fr","meaning","example","pron"];

    const hasAny = (arr) => arr.some(k => keys.includes(k));

    return hasAny(verbKeys) || hasAny(vocabKeys) || hasAny(partKeys);
  },

  // Extraction standard + deep fallback
  refGetItems(mod) {
    if (!mod) return [];

    const direct =
      (Array.isArray(mod.items) && mod.items) ||
      (Array.isArray(mod.rows) && mod.rows) ||
      (Array.isArray(mod.entries) && mod.entries) ||
      (Array.isArray(mod.lessons) && mod.lessons) ||
      (Array.isArray(mod.data) && mod.data) ||
      (Array.isArray(mod.list) && mod.list) ||
      null;

    if (direct && direct.length && this.looksLikeRefItem(direct[0])) return direct;

    // Fallback deep : on explore l'objet et on récupère la première “grosse” liste d’objets
    // qui ressemble à des entrées (sv/fr ou infinitive/pres/etc).
    const visited = new Set();
    const stack = [mod];

    while (stack.length) {
      const cur = stack.pop();
      if (!cur || typeof cur !== "object") continue;
      if (visited.has(cur)) continue;
      visited.add(cur);

      if (Array.isArray(cur)) {
        if (cur.length && this.looksLikeRefItem(cur[0])) return cur;
        for (const it of cur) stack.push(it);
        continue;
      }

      for (const k of Object.keys(cur)) {
        const v = cur[k];
        if (Array.isArray(v)) {
          if (v.length && this.looksLikeRefItem(v[0])) return v;
          // explore aussi au cas où les objets sont 1 niveau plus bas
          stack.push(v);
        } else if (v && typeof v === "object") {
          stack.push(v);
        }
      }
    }

    // Rien trouvé
    return direct || [];
  },

  // Détection type tableau
  refDetectTableType(items) {
    const sample = items[0] || {};
    const keys = Object.keys(sample);

    const has = (k) => keys.includes(k);

    const isVerb =
      ["infinitive","inf","sv_inf"].some(has) &&
      (["pres","present"].some(has) || ["pret","preteritum","past"].some(has) || ["sup","supinum"].some(has));

    const isParticle =
      ["expression","verb"].some(has) && (has("particle") || has("example") || has("fr") || has("meaning"));

    const isVocab =
      (["sv","word","lemma"].some(has)) && (["fr","meaning","translation"].some(has));

    return isVerb ? "verb" : isParticle ? "particle" : isVocab ? "vocab" : "generic";
  },

  // -------------------- VIEWS --------------------

  viewHome() {
    const s = Storage.load();
    const doneCount = Object.keys(s.done || {}).length;

    const cards = this.levelsOrder
      .map(lvl => this.getLevelData(lvl))
      .filter(Boolean)
      .map(L => {
        const modulesCount = (L.modules || []).length;
        const levelTitle = L.title ? `${L.level} — ${L.title}` : L.level;
        return `
          <div class="card">
            <span class="pill">Niveau ${this.escapeHtml(L.level)}</span>
            <h3 style="margin-top:10px;">${this.escapeHtml(levelTitle)}</h3>
            <p class="muted">Modules : ${modulesCount}</p>
            <button class="btn btn-primary" onclick="Router.go('/level',{level:${this.jsString(L.level)}})">Ouvrir</button>
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
          <span class="pill">Bonnes réponses : <b>${s.stats?.correct ?? 0}</b></span>
          <span class="pill">Erreurs : <b>${s.stats?.wrong ?? 0}</b></span>
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
    const L = this.getLevelData(level);
    if (!L) return Router.go("/");

    this.setView(`
      <section class="card">
        <span class="pill">Niveau ${this.escapeHtml(L.level)}</span>
        <h2 style="margin-top:10px;">${this.escapeHtml(L.level)} — ${this.escapeHtml(L.title)}</h2>
        <p class="muted">Choisis un module, puis une leçon.</p>
      </section>

      <section style="margin-top:12px;" class="grid">
        ${(L.modules || []).map(m => `
          <div class="card">
            <h3>${this.escapeHtml(m.title || "Module")}</h3>
            <p class="muted">Leçons : ${(m.lessons || []).length}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              ${(m.lessons || []).map(les => `
                <button class="btn" onclick="Router.go('/lesson',{level:${this.jsString(L.level)}, lessonId:${this.jsString(les.id)}})">
                  ${this.escapeHtml(les.title || "Leçon")}
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
    if (!L) return Router.go("/");

    const lesson =
      (L.modules || [])
        .flatMap(m => (m.lessons || []))
        .find(x => x.id === lessonId);

    if (!lesson) return Router.go("/level", { level: L.level });

    const contentHtml = (lesson.content || []).map(p => `<p>${this.escapeHtml(p)}</p>`).join("");

    const examplesHtml = (lesson.examples || []).map(e => `
      <div class="choice" style="cursor:default;">
        <div>
          <b>${this.escapeHtml(e.sv || "")}</b>
          <div class="muted">${this.escapeHtml(e.fr || "")}${e.pron ? ` • <i>${this.escapeHtml(e.pron)}</i>` : ""}</div>
        </div>
      </div>
    `).join("");

    const vocabHtml = (lesson.vocab || []).map(w => `
      <div class="choice" style="cursor:default;">
        <div style="min-width:110px;"><b>${this.escapeHtml(w.sv || "")}</b></div>
        <div class="muted">${this.escapeHtml(w.fr || "")}${w.pron ? ` • <i>${this.escapeHtml(w.pron)}</i>` : ""}</div>
      </div>
    `).join("");

    this.setView(`
      <section class="card">
        <span class="pill">${this.escapeHtml(L.level)}</span>
        <h2 style="margin-top:10px;">${this.escapeHtml(lesson.title || "Leçon")}</h2>

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
          <button class="btn btn-success" onclick="Storage.markDone(${this.jsString(L.level + ':' + lesson.id)}); Router.go('/level',{level:${this.jsString(L.level)}})">✔ Marquer comme faite</button>
          <button class="btn" onclick="Router.go('/level',{level:${this.jsString(L.level)}})">← Retour</button>
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
    const answered = new Array(quizzes.length).fill(false);

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
      const lock = () => answered[idx];
      const setFeedback = (ok, extra = "") => {
        fb.textContent = ok ? `✅ Correct. ${extra}` : `❌ Non. ${extra}`;
      };

      if (q.type === "mcq") {
        qbox.innerHTML = `
          <p><b>${this.escapeHtml(q.q || "")}</b></p>
          <div class="grid">
            ${(q.choices || []).map((c, i) => `<div class="choice" data-i="${i}">${this.escapeHtml(c)}</div>`).join("")}
          </div>
        `;

        const nodes = qbox.querySelectorAll(".choice");
        nodes.forEach(node => {
          node.onclick = () => {
            if (lock()) return;
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
          <p><b>${this.escapeHtml(q.q || "")}</b></p>
          <input id="gap" placeholder="Ta réponse..." />
          <button class="btn" style="margin-top:10px;" id="check">Vérifier</button>
        `;

        const input = qbox.querySelector("#gap");
        const btn = qbox.querySelector("#check");

        btn.onclick = () => {
          if (lock()) return;

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
    this.setView(`
      <section class="card">
        <h2>Révision</h2>
        <p class="muted">Bientôt : flashcards + rappel espacée (SRS).</p>
      </section>
    `);
  },

  viewStats() {
    const s = Storage.load();
    const total = (s.stats?.correct ?? 0) + (s.stats?.wrong ?? 0);
    const rate = total ? Math.round(((s.stats?.correct ?? 0) / total) * 100) : 0;

    this.setView(`
      <section class="card">
        <h2>Stats</h2>
        <div class="kpi">
          <span class="pill">Total réponses : <b>${total}</b></span>
          <span class="pill">Taux : <b>${rate}%</b></span>
          <span class="pill">Bonnes : <b>${s.stats?.correct ?? 0}</b></span>
          <span class="pill">Erreurs : <b>${s.stats?.wrong ?? 0}</b></span>
        </div>
        <hr />
        <button class="btn" onclick="localStorage.removeItem(Storage.key); location.reload()">Réinitialiser</button>
      </section>
    `);
  },

  // -------------------- RÉFÉRENCE --------------------

  viewRef() {
    if (!this.refData) {
      return this.setView(`
        <section class="card">
          <h2>Références (M+)</h2>
          <p class="muted">Le fichier <code>assets/data/ref.json</code> n’est pas chargé (ou absent).</p>
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </section>
      `);
    }

    const mods = this.refGetModules();
    if (!mods.length) {
      return this.setView(`
        <section class="card">
          <h2>Références (M+)</h2>
          <p class="muted">Aucun module détecté dans <code>ref.json</code>.</p>
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </section>
      `);
    }

    this.setView(`
      <section class="card">
        <h2>Références (M+)</h2>
        <p class="muted">Choisis un module, puis ouvre le tableau complet.</p>
      </section>

      <section class="grid grid-2" style="margin-top:12px;">
        ${mods.map((m, idx) => {
          const id = this.refGetModuleId(m, idx);
          const title = m.title || m.name || "Module";
          const items = this.refGetItems(m);

          return `
            <div class="card">
              <span class="pill">Référence</span>
              <h3 style="margin-top:10px;">${this.escapeHtml(title)}</h3>
              <p class="muted"><b>${items.length}</b> entrées détectées</p>
              <button class="btn btn-primary"
                onclick="Router.go('/ref-sheet',{moduleId:${this.jsString(id)}})">
                Ouvrir le tableau
              </button>
            </div>
          `;
        }).join("")}
      </section>
    `);
  },

  viewRefSheet(moduleId) {
    if (!this.refData) return Router.go("/ref");

    const mods = this.refGetModules();
    const mod = mods.find((m, idx) => this.refGetModuleId(m, idx) === String(moduleId));

    if (!mod) {
      return this.setView(`
        <section class="card">
          <h2>Référence</h2>
          <p class="muted">Module introuvable (id: <code>${this.escapeHtml(moduleId)}</code>).</p>
          <button class="btn" onclick="Router.go('/ref')">← Retour</button>
        </section>
      `);
    }

    const title = mod.title || mod.name || "Module";
    const items = this.refGetItems(mod);

    if (!items.length) {
      return this.setView(`
        <section class="card">
          <span class="pill">Référence</span>
          <h2 style="margin-top:10px;">${this.escapeHtml(title)}</h2>
          <p class="muted">Aucune entrée détectée dans ce module (même en mode deep).</p>
          <p class="muted">➡️ Ça veut dire que tes entrées ne ressemblent pas à des objets “ref” (sv/fr, infinitive/pres/pret, expression...).</p>
          <button class="btn" onclick="Router.go('/ref')">← Retour</button>
        </section>
      `);
    }

    const type = this.refDetectTableType(items);

    let header = [];
    let rowsHtml = "";

    if (type === "verb") {
      header = ["Infinitif", "Présent", "Prétérit", "Supinum", "Impératif", "FR", "Pron"];
      rowsHtml = items.map(v => `
        <tr>
          <td><b>${this.escapeHtml(v.infinitive || v.inf || v.sv_inf || v.sv || v.word || "")}</b></td>
          <td>${this.escapeHtml(v.pres || v.present || "")}</td>
          <td>${this.escapeHtml(v.pret || v.preteritum || v.past || "")}</td>
          <td>${this.escapeHtml(v.sup || v.supinum || "")}</td>
          <td>${this.escapeHtml(v.imp || v.imperativ || "")}</td>
          <td class="muted">${this.escapeHtml(v.fr || v.meaning || "")}</td>
          <td class="muted">${this.escapeHtml(v.pron || "")}</td>
        </tr>
      `).join("");
    } else if (type === "particle") {
      header = ["Expression", "FR", "Exemple", "Pron", "Note"];
      rowsHtml = items.map(p => `
        <tr>
          <td><b>${this.escapeHtml(p.expression || p.verb || p.sv || p.word || "")}</b></td>
          <td>${this.escapeHtml(p.fr || p.meaning || "")}</td>
          <td class="muted">${this.escapeHtml(p.example || p.ex || "")}</td>
          <td class="muted">${this.escapeHtml(p.pron || "")}</td>
          <td class="muted">${this.escapeHtml(p.note || "")}</td>
        </tr>
      `).join("");
    } else if (type === "vocab") {
      header = ["Suédois", "Français", "Pron", "Genre/Pluriel", "Note"];
      rowsHtml = items.map(w => `
        <tr>
          <td><b>${this.escapeHtml(w.sv || w.word || w.lemma || "")}</b></td>
          <td>${this.escapeHtml(w.fr || w.meaning || w.translation || "")}</td>
          <td class="muted">${this.escapeHtml(w.pron || "")}</td>
          <td class="muted">${this.escapeHtml(w.gender || w.plural || w.forms || "")}</td>
          <td class="muted">${this.escapeHtml(w.note || "")}</td>
        </tr>
      `).join("");
    } else {
      // generic
      const keys = Object.keys(items[0] || {}).slice(0, 6);
      header = keys.length ? keys : ["Donnée"];
      rowsHtml = items.map(obj => `
        <tr>
          ${(keys.length ? keys : ["_"]).map(k => `<td class="muted">${this.escapeHtml(k === "_" ? JSON.stringify(obj) : obj[k])}</td>`).join("")}
        </tr>
      `).join("");
    }

    this.setView(`
      <section class="card">
        <span class="pill">Référence</span>
        <h2 style="margin-top:10px;">${this.escapeHtml(title)}</h2>
        <p class="muted">${items.length} entrées</p>
        <button class="btn" onclick="Router.go('/ref')">← Retour</button>
      </section>

      <div class="table-wrap" style="margin-top:12px;">
        <table class="zebra">
          <thead><tr>${header.map(h => `<th>${this.escapeHtml(h)}</th>`).join("")}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `);
  }
};

App.init();