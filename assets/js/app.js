// assets/js/app.js - VERSION COMPLÈTE CORRIGÉE

const App = {
  mount: null,  // ✅ Initialisé dans init()

  levels: {},
  levelsOrder: ["A1", "A2", "B1", "B2"],

  ref: { title: "Références", modules: [] },

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
  console.log("[App] Démarrage...");
  
  // ✅ Initialiser mount
  this.mount = document.getElementById("app");
  if (!this.mount) {
    console.error("[App] Element #app introuvable");
    alert("Erreur : Element #app introuvable dans le DOM");
    return;
  }
  console.log("[App] Mount trouvé:", this.mount);

  // ✅ Navigation
  const navHome = document.getElementById("navHome");
  const navRef = document.getElementById("navRef");
  const navRefPlus = document.getElementById("navRefPlus");
  const navReview = document.getElementById("navReview");
  const navStats = document.getElementById("navStats");

  if (navHome) navHome.addEventListener("click", () => Router.go("/"));
  if (navRef) navRef.addEventListener("click", () => Router.go("/ref"));
  if (navRefPlus) navRefPlus.addEventListener("click", () => Router.go("/ref-plus", {}));
  if (navReview) navReview.addEventListener("click", () => Router.go("/review"));
  if (navStats) navStats.addEventListener("click", () => Router.go("/stats"));

  console.log("[App] Navigation configurée");

  // ✅ Router
  Router.on("/", () => this.viewHome());
  Router.on("/level", (p) => this.viewLevel(p.level));
  Router.on("/lesson", (p) => this.viewLesson(p.level, p.lessonId));
  Router.on("/ref", () => this.viewRef());
  Router.on("/ref-lesson", (p) => this.viewRefLesson(p.moduleId, p.lessonId));
  Router.on("/ref-plus", (p) => this.viewRefPlus(p));
  Router.on("/review", () => this.viewReview());
  Router.on("/stats", () => this.viewStats());

  console.log("[App] Routes configurées");

  // ✅ Load data avec meilleure gestion d'erreurs
  try {
    await this.loadAllData();
    console.log("[App] Données chargées");
  } catch (e) {
    console.error("[App] Erreur critique lors du chargement:", e);
    this.setView(`
      <section class="card">
        <h2>❌ Erreur de chargement</h2>
        <p class="muted">Impossible de charger les données de formation.</p>
        <pre style="background:rgba(255,0,0,0.1); padding:12px; border-radius:8px; overflow:auto;">${e.message}</pre>
        <p style="margin-top:12px;"><b>Vérifiez que :</b></p>
        <ul>
          <li>Le dossier <code>assets/data/</code> existe</li>
          <li>Le fichier <code>a1.json</code> est présent</li>
          <li>Les fichiers JSON sont valides (pas d'erreur de syntaxe)</li>
        </ul>
        <button class="btn" onclick="location.reload()">🔄 Recharger</button>
      </section>
    `);
    return;
  }

  // ✅ Build SRS cards
  try {
    const cards = SRS.buildCardsFromLevels(this.levels);
    Storage.upsertCards(cards);
    console.log("[App] SRS initialisé:", cards.length, "cartes");
  } catch (e) {
    console.error("[App] Erreur SRS:", e);
  }

  // ✅ Start router
  console.log("[App] Démarrage du router...");
  Router.start("/");
  console.log("[App] Application prête !");
},

  // ✅ Chargement avec bon chemin
  async loadAllData() {
    for (const lvl of this.levelsOrder) {
      try {
        this.levels[lvl] = await this.loadJson(`assets/data/${lvl.toLowerCase()}.json`);
        console.log(`[App] Niveau ${lvl} chargé:`, this.levels[lvl]);
      } catch (e) {
        console.warn(`[App] Niveau ${lvl} non chargé:`, e.message);
      }
    }

    try {
      this.ref = await this.loadJson("assets/data/ref.json");
      console.log("[App] Références chargées:", this.ref);
    } catch (e) {
      console.warn("[App] ref.json non chargé:", e.message);
    }

    try {
      const json = await this.loadJson("assets/data/ref_plus.json");
      this.refPlus = {
        title: json.title || "Référence+ (tableaux)",
        themes: Array.isArray(json.themes) ? json.themes : [],
        verbs: Array.isArray(json.verbs) ? json.verbs : [],
        vocab: Array.isArray(json.vocab) ? json.vocab : [],
        particles: Array.isArray(json.particles) ? json.particles : [],
        articles: Array.isArray(json.articles) ? json.articles : [],
        articles_guide: Array.isArray(json.articles_guide) ? json.articles_guide : []
      };
      console.log("[App] Référence+ chargée:", this.refPlus);
    } catch (e) {
      console.warn("[App] ref_plus.json non chargé:", e.message);
    }
  },

  async loadJson(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} sur ${path}`);
    return await res.json();
  },

  // ========== HELPERS ==========

  setView(html) {
    if (this.mount) {
      this.mount.innerHTML = html;
    }
  },

  escapeHtml(str) {
    return (str ?? "")
      .toString()
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  },

  renderLessonContent(lines) {
    let html = "";
    let open = false;

    const isSeparator = (t) => /^=+$/.test((t || "").trim()) || (t || "").startsWith("====");
    const isHeading = (t) => {
      const s = (t || "").trim();
      return (
        s.startsWith("SITUATION") ||
        s.startsWith("DÉCOMPOSITION") ||
        s.startsWith("🧑‍🏫") ||
        s.startsWith("STRUCTURES") ||
        s.startsWith("ORDRE") ||
        s.startsWith("POINT") ||
        s.startsWith("TABLEAU") ||
        s.startsWith("DRILLS") ||
        s.startsWith("MINI-STORY") ||
        s.startsWith("PRODUCTION") ||
        s.startsWith("🎯") ||
        s.startsWith("✅") ||
        s.startsWith("⚡") ||
        s.startsWith("📚") ||
        s.startsWith("🔑") ||
        s.startsWith("✓") ||
        s.startsWith("📖") ||
        s.startsWith("🔤") ||
        s.startsWith("📌") ||
        s.startsWith("1️⃣") ||
        s.startsWith("2️⃣") ||
        s.startsWith("3️⃣") ||
        s.startsWith("4️⃣") ||
        s.startsWith("5️⃣") ||
        s.startsWith("6️⃣") ||
        s.startsWith("⚠️") ||
        s.startsWith("💡")
      );
    };

    const looksSwedish = (t) => {
      const s = (t || "").trim();
      if (!s) return false;
      if (/[åäöÅÄÖ]/.test(s)) return true;
      if (/^(Jag|Du|Han|Hon|Vi|Ni|De|Det|Den|Vad|Vart|Var|Kan|Ska|Imorgon|Idag|Okej|Ja|Nej)\b/.test(s)) return true;
      if (s.includes("?")) return true;
      return false;
    };

    for (const raw of (lines || [])) {
      const l = (raw ?? "").toString();

      if (isSeparator(l)) {
        if (open) html += "</div>";
        open = true;
        html += `<div class="lesson-block">`;
        continue;
      }

      if (!open) {
        open = true;
        html += `<div class="lesson-block">`;
      }

      if (l.trim() === "") {
        html += `<div class="lesson-spacer"></div>`;
        continue;
      }

      if (isHeading(l)) {
        html += `<div class="lesson-heading">${this.escapeHtml(l)}</div>`;
        continue;
      }

      // Dialogue A: / B:
      const dlg = l.match(/^([AB]):\s*(.*)$/);
      if (dlg) {
        const who = dlg[1];
        const txt = dlg[2] || "";
        html += `
          <div class="lesson-dialogue">
            <span class="dlg-who dlg-${who}">${who}</span>
            <span class="dlg-text">${this.escapeHtml(txt)}</span>
          </div>
        `;
        continue;
      }

      // Phonétique : ( ... )
      const trimmed = l.trim();
      if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
        const phon = trimmed.slice(1, -1);
        html += `<div class="lesson-phon">${this.escapeHtml(phon)}</div>`;
        continue;
      }

      if (looksSwedish(l)) {
        html += `<div class="lesson-sv">${this.escapeHtml(l)}</div>`;
      } else {
        html += `<p>${this.escapeHtml(l)}</p>`;
      }
    }

    if (open) html += "</div>";
    return html;
  },

  renderTable(headers, rows) {
    const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
    return `<div class="table-wrap"><table>${thead}${tbody}</table></div>`;
  },

  // ========== VIEWS ==========

  viewHome() {
    const cards = this.levelsOrder
      .filter((lvl) => this.levels[lvl])
      .map((lvl) => {
        const L = this.levels[lvl];
        return `
          <div class="item" onclick="Router.go('/level',{level:'${lvl}'})">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
              <div>
                <div class="pill">${lvl}</div>
                <div style="margin-top:10px; font-weight:800; font-size:1.05rem;">${this.escapeHtml(L.title || lvl)}</div>
                <div class="muted" style="margin-top:6px;">${this.escapeHtml(L.description || "")}</div>
              </div>
              <div class="muted">→</div>
            </div>
          </div>
        `;
      })
      .join("");

    this.setView(`
      <section class="card">
        <div class="brand">
          <h1>Svenska Mästare Pro</h1>
          <div class="sub">Apprentissage structuré • drills • SRS</div>
        </div>

        <h2 style="margin-top:18px;">Niveaux</h2>
        <div class="list">${cards || `<div class="muted">Aucun niveau trouvé.</div>`}</div>

        <hr />
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-ghost" onclick="Router.go('/ref')">📌 Références</button>
          <button class="btn btn-ghost" onclick="Router.go('/ref-plus',{})">📚 Référence+</button>
          <button class="btn btn-ghost" onclick="Router.go('/review')">🧠 Révision (SRS)</button>
          <button class="btn btn-ghost" onclick="Router.go('/stats')">📈 Stats</button>
        </div>
      </section>
    `);
  },

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

    const modules = (L.modules || [])
      .map((m) => {
        const lessons = (m.lessons || [])
          .map((ls) => {
            const done = Storage.isDone(`${L.level}:${ls.id}`);
            return `
              <div class="item" onclick="Router.go('/lesson',{level:'${L.level}',lessonId:'${ls.id}'})">
                <div style="display:flex; justify-content:space-between; gap:12px;">
                  <div>
                    <div style="font-weight:800;">${this.escapeHtml(ls.title || ls.id)}</div>
                    <div class="muted" style="margin-top:6px;">${done ? "✅ Fait" : "⏳ À faire"}</div>
                  </div>
                  <div class="muted">→</div>
                </div>
              </div>
            `;
          })
          .join("");

        return `
          <div style="margin-top:18px;">
            <div class="pill">${this.escapeHtml(m.id || "")}</div>
            <h2 style="margin:10px 0 6px;">${this.escapeHtml(m.title || "Module")}</h2>
            <div class="list">${lessons || `<div class="muted">Aucune leçon.</div>`}</div>
          </div>
        `;
      })
      .join("");

    this.setView(`
      <section class="card">
        <span class="pill">${this.escapeHtml(L.level)}</span>
        <h2 style="margin-top:10px;">${this.escapeHtml(L.title || "Niveau")}</h2>
        <div class="muted">${this.escapeHtml(L.description || "")}</div>

        ${modules}

        <div style="margin-top:12px;">
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </div>
      </section>
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

    const contentHtml = this.renderLessonContent(lesson.content || []);
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
        <div style="min-width:130px;"><b>${this.escapeHtml(w.sv || "")}</b></div>
        <div class="muted">${this.escapeHtml(w.fr || "")}${w.pron ? ` • <i>${this.escapeHtml(w.pron)}</i>` : ""}</div>
      </div>
    `).join("");

    this.setView(`
      <section class="card">
        <span class="pill">${this.escapeHtml(L.level)}</span>
        <h2 style="margin-top:10px;">${this.escapeHtml(lesson.title || "Leçon")}</h2>

        ${contentHtml}

        ${(lesson.examples && lesson.examples.length) ? `<hr /><h3>Exemples</h3>${examplesHtml}` : ""}
        ${(lesson.vocab && lesson.vocab.length) ? `<hr /><h3>Vocabulaire</h3>${vocabHtml}` : ""}

        <hr />
        <h3>Exercices</h3>
        <div id="quiz"></div>

        <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
          <button class="btn" onclick="Storage.markDone('${L.level}:${lesson.id}'); Router.go('/level',{level:'${L.level}'})">✔ Marquer comme faite</button>
          <button class="btn btn-ghost" onclick="Router.go('/review')">🧠 Réviser (SRS)</button>
          <button class="btn btn-ghost" onclick="Router.go('/level',{level:'${L.level}'})">← Retour</button>
        </div>
      </section>
    `);

    this.renderQuiz(lesson);
  },

  renderQuiz(lesson) {
    const host = document.getElementById("quiz");
    if (!host) return;
    host.innerHTML = "";

    const quiz = lesson.quiz || [];
    if (!quiz.length) {
      host.innerHTML = `<div class="muted">Aucun exercice pour cette leçon.</div>`;
      return;
    }

    let idx = 0;
    const answered = new Array(quiz.length).fill(false);

    const renderOne = () => {
      const q = quiz[idx];
      host.innerHTML = `
        <div class="card" style="margin-top:10px;">
          <div class="muted" style="margin-bottom:8px;">Exercice ${idx + 1} / ${quiz.length}</div>
          <div id="qbox"></div>
          <p id="fb" class="muted" style="margin-top:10px;"></p>
          <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
            <button class="btn" id="prev" ${idx === 0 ? "disabled" : ""}>← Précédent</button>
            <button class="btn" id="next">${idx === quiz.length - 1 ? "Terminer" : "Suivant →"}</button>
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
          <input id="gap" placeholder="Ta réponse..." style="width:100%; padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,.15); background:rgba(0,0,0,.25); color:white;" />
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
        if (idx < quiz.length - 1) { idx++; renderOne(); }
        else { fb.textContent = "✅ Série terminée."; }
      };
    };

    renderOne();
  },

  viewRef() {
    const modules = (this.ref.modules || [])
      .map(
        (m) => `
      <div style="margin-top:16px;">
        <div class="pill">${this.escapeHtml(m.id || "")}</div>
        <h2 style="margin-top:10px;">${this.escapeHtml(m.title || "Référence")}</h2>
        <div class="list">
          ${(m.lessons || [])
            .map(
              (ls) => `
            <div class="item" onclick="Router.go('/ref-lesson',{moduleId:'${m.id}',lessonId:'${ls.id}'})">
              <div style="display:flex; justify-content:space-between; gap:12px;">
                <div style="font-weight:800;">${this.escapeHtml(ls.title || ls.id)}</div>
                <div class="muted">→</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("");

    this.setView(`
      <section class="card">
        <h2>${this.escapeHtml(this.ref.title || "Références")}</h2>
        ${modules || `<div class="muted">Aucune référence.</div>`}
        <div style="margin-top:12px;">
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </div>
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

    const contentHtml = this.renderLessonContent(lesson.content || []);
    const examplesHtml = (lesson.examples || []).map(e => `
      <div class="choice" style="cursor:default;">
        <div><b>${this.escapeHtml(e.sv || "")}</b><div class="muted">${this.escapeHtml(e.fr || "")}${e.pron ? ` • <i>${this.escapeHtml(e.pron)}</i>` : ""}</div></div>
      </div>
    `).join("");
    const vocabHtml = (lesson.vocab || []).map(w => `
      <div class="choice" style="cursor:default;">
        <div style="min-width:130px;"><b>${this.escapeHtml(w.sv || "")}</b></div>
        <div class="muted">${this.escapeHtml(w.fr || "")}${w.pron ? ` • <i>${this.escapeHtml(w.pron)}</i>` : ""}</div>
      </div>
    `).join("");

    this.setView(`
      <section class="card">
        <h2>${this.escapeHtml(lesson.title || "Fiche")}</h2>

        ${contentHtml}

        ${(lesson.examples && lesson.examples.length) ? `<hr /><h3>Exemples</h3>${examplesHtml}` : ""}
        ${(lesson.vocab && lesson.vocab.length) ? `<hr /><h3>Vocabulaire</h3>${vocabHtml}` : ""}

        <div style="margin-top:12px;">
          <button class="btn" onclick="Router.go('/ref')">← Retour</button>
        </div>
      </section>
    `);
  },

  viewRefPlus() {
    this.setView(`
      <section class="card">
        <h2>${this.escapeHtml(this.refPlus.title || "Référence+ (tableaux)")}</h2>
        <div class="muted">Référence+ chargée. (Rendu à compléter.)</div>
        <div style="margin-top:12px;">
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </div>
      </section>
    `);
  },

  viewReview() {
    const due = Storage.getDueCards(30);
    const stats = Storage.getSrsStats();

    if (due.length === 0) {
      return this.setView(`
        <section class="card">
          <h2>🎉 Révision SRS</h2>
          <p class="muted">Aucune carte à réviser pour le moment !</p>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
            <div class="pill">Total cartes : <b>${stats.total}</b></div>
            <div class="pill">Dues : <b>${stats.due}</b></div>
          </div>
          <button class="btn" onclick="Router.go('/')" style="margin-top:12px;">← Retour</button>
        </section>
      `);
    }

    let idx = 0;
    let showAnswer = false;

    const render = () => {
      const c = due[idx];
      
      const html = `
        <section class="card">
          <div class="muted" style="margin-bottom:8px;">Carte ${idx + 1} / ${due.length}</div>
          <div id="srs-card" style="min-height:150px; padding:20px; background:rgba(255,255,255,0.03); border-radius:12px; text-align:center;">
            <div style="font-size:24px; margin-bottom:12px;">${this.escapeHtml(c.front)}</div>
            ${showAnswer ? `<hr style="margin:20px 0;"><div style="font-size:18px; color:var(--accent-blue);">${this.escapeHtml(c.back)}</div>` : ""}
          </div>
          <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap; justify-content:center;">
            ${!showAnswer ? `
              <button class="btn btn-primary" id="show-answer">Afficher la réponse</button>
            ` : `
              <button class="btn" id="grade-0">❌ Oublié</button>
              <button class="btn" id="grade-1">😐 Difficile</button>
              <button class="btn btn-primary" id="grade-2">✅ Bon</button>
              <button class="btn btn-success" id="grade-3">🎯 Facile</button>
            `}
          </div>
        </section>
      `;

      this.setView(html);

      if (!showAnswer) {
        document.getElementById("show-answer").onclick = () => {
          showAnswer = true;
          render();
        };
      } else {
        for (let g = 0; g <= 3; g++) {
          const btn = document.getElementById(`grade-${g}`);
          if (btn) {
            btn.onclick = () => {
              Storage.gradeCard(c.id, g);
              showAnswer = false;
              idx++;
              if (idx < due.length) {
                render();
              } else {
                this.setView(`
                  <section class="card">
                    <h2>🎉 Session terminée !</h2>
                    <p class="muted">Vous avez révisé ${due.length} carte(s).</p>
                    <button class="btn btn-primary" onclick="Router.go('/')">← Retour à l'accueil</button>
                  </section>
                `);
              }
            };
          }
        }
      }
    };

    render();
  },

  viewStats() {
    const s = Storage.load();
    const total = (s.stats?.correct ?? 0) + (s.stats?.wrong ?? 0);
    const rate = total ? Math.round(((s.stats?.correct ?? 0) / total) * 100) : 0;
    const srsStats = Storage.getSrsStats();

    this.setView(`
      <section class="card">
        <h2>📊 Statistiques</h2>
        
        <h3 style="margin-top:20px;">Exercices</h3>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
          <div class="pill">Total réponses : <b>${total}</b></div>
          <div class="pill">Taux réussite : <b>${rate}%</b></div>
          <div class="pill" style="background:rgba(34,197,94,.2);">Bonnes : <b>${s.stats?.correct ?? 0}</b></div>
          <div class="pill" style="background:rgba(239,68,68,.2);">Erreurs : <b>${s.stats?.wrong ?? 0}</b></div>
        </div>

        <h3 style="margin-top:20px;">Révision SRS</h3>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
          <div class="pill">Total cartes : <b>${srsStats.total}</b></div>
          <div class="pill" style="background:rgba(251,191,36,.2);">Dues : <b>${srsStats.due}</b></div>
          <div class="pill">Nouvelles : <b>${srsStats.newCards || 0}</b></div>
          <div class="pill" style="background:rgba(34,197,94,.2);">Maîtrisées : <b>${srsStats.mature || 0}</b></div>
        </div>

        <hr />
        <button class="btn" onclick="Storage.reset()">⚠️ Réinitialiser les données</button>
        <button class="btn btn-ghost" onclick="Router.go('/')" style="margin-left:10px;">← Retour</button>
      </section>
    `);
  }
};

// ✅ Auto-init
window.addEventListener("DOMContentLoaded", () => App.init());