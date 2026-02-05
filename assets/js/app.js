// assets/js/app.js

const App = {
  mount: document.getElementById("app"),

  levels: {},
  levelsOrder: ["A1", "A2", "B1"],

  ref: { title: "Références", modules: [] },

  async init() {
    Router.on("/", () => this.viewHome());
    Router.on("/level", (p) => this.viewLevel(p.level));
    Router.on("/lesson", (p) => this.viewLesson(p.level, p.lessonId));
    Router.on("/review", () => this.viewReview());
    Router.on("/stats", () => this.viewStats());
    Router.on("/ref", () => this.viewRef());
    Router.on("/ref-lesson", (p) => this.viewRefLesson(p.moduleId, p.lessonId));

    await this.loadAllData();

    // Build SRS cards
    Storage.upsertCards(SRS.buildCardsFromLevels(this.levels));

    Router.start("/");
  },

  async loadAllData() {
    // levels
    for (const lvl of this.levelsOrder) {
      try {
        this.levels[lvl] = await this.loadJson(`assets/data/${lvl.toLowerCase()}.json`, lvl);
      } catch (e) {
        console.warn("[level] non chargé:", lvl, e.message || e);
      }
    }

    // ref
    try {
      const r = await this.loadJson("assets/data/ref.json", "REF");
      this.ref = this.normalizeRef(r);
    } catch (e) {
      console.warn("[ref] non chargé:", e.message || e);
      this.ref = { title: "Références", modules: [] };
    }

    if (Object.keys(this.levels).length === 0) {
      this.setView(`
        <section class="card">
          <h2>Erreur de chargement</h2>
          <p class="muted">Aucun niveau n’a pu être chargé.</p>
          <p class="muted">Vérifie les fichiers dans <code>assets/data/</code> : a1.json, a2.json, b1.json.</p>
        </section>
      `);
    }
  },

  async loadJson(url, fallbackLevel = "") {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch fail ${url} (${res.status})`);
    const json = await res.json();

    // Level normalization (A1/A2/B1)
    if (fallbackLevel !== "REF") {
      return {
        level: json.level || fallbackLevel,
        title: json.title || "",
        modules: Array.isArray(json.modules) ? json.modules : []
      };
    }

    return json;
  },

  normalizeRef(json) {
    // accepte modules/sections + lessons/items/entries/fiches
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

    return {
      title: root?.title || "Références",
      modules: normModules
    };
  },

  setView(html) {
    this.mount.innerHTML = html;
  },

  // ---------- HOME ----------
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

        <div class="kpi">
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
          <button class="btn" onclick="Router.go('/review')">🎴 Révision</button>
          <button class="btn" onclick="Router.go('/ref')" ${this.ref.modules.length ? "" : ""}>📚 Références</button>
          <button class="btn" onclick="Router.go('/stats')">📈 Stats</button>
        </div>
      </section>

      <section class="grid grid-2" style="margin-top:12px;">
        <div class="card">
          <span class="pill">Références</span>
          <h3 style="margin-top:10px;">${this.ref.title || "Références"}</h3>
          <p class="muted">Modules : ${(this.ref.modules || []).length}</p>
          <button class="btn" onclick="Router.go('/ref')">Ouvrir</button>
        </div>

        ${levelCards}
      </section>
    `);
  },

  // ---------- LEVEL ----------
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

  // ---------- LESSON ----------
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

  // ---------- REVIEW (SRS) ----------
  viewReview() {
    // refresh SRS cards each time (safe)
    Storage.upsertCards(SRS.buildCardsFromLevels(this.levels));

    const st = Storage.getSrsStats();
    const levelOptions = ["ALL", ...this.levelsOrder.filter(l => this.levels[l])];
    const selected = (window.__reviewLevel && levelOptions.includes(window.__reviewLevel)) ? window.__reviewLevel : "ALL";
    window.__reviewLevel = selected;

    const due = Storage.getDueCards({ level: selected, limit: st.dailyLimit });

    this.setView(`
      <section class="card">
        <h2>Révision SRS 🎴</h2>
        <p class="muted">Cartes générées depuis tes leçons (vocab + exemples).</p>

        <div class="kpi">
          <span class="pill">Cartes : <b>${st.total}</b></span>
          <span class="pill">À réviser : <b>${st.due}</b></span>
          <span class="pill">Limite/jour : <b>${st.dailyLimit}</b></span>
        </div>

        <hr />

        <div class="grid grid-2">
          <div class="card">
            <label class="muted" style="display:block; margin-bottom:6px;">Niveau</label>
            <select id="revLevel" style="width:100%; padding:10px 12px; border-radius:12px; background:rgba(255,255,255,.04); color:var(--text); border:1px solid rgba(255,255,255,.10);">
              ${levelOptions.map(l => `<option value="${l}" ${l===selected?"selected":""}>${l==="ALL"?"Tous":l}</option>`).join("")}
            </select>

            <div style="margin-top:10px;">
              <label class="muted" style="display:block; margin-bottom:6px;">Limite / jour (5 → 50)</label>
              <input id="dailyLimit" type="number" min="5" max="50" value="${st.dailyLimit}" />
              <button class="btn" style="margin-top:10px;" id="saveLimit">Enregistrer</button>
            </div>
          </div>

          <div class="card">
            <h3>Session</h3>
            <p class="muted">Dues (filtrées) : <b>${due.length}</b></p>
            <button class="btn" id="start" ${due.length ? "" : "disabled"}>Commencer</button>
          </div>
        </div>

        <div id="srsHost" style="margin-top:12px;"></div>

        <div style="margin-top:12px;">
          <button class="btn" onclick="Router.go('/')">← Retour</button>
        </div>
      </section>
    `);

    document.getElementById("revLevel").onchange = (e) => {
      window.__reviewLevel = e.target.value;
      Router.go("/review");
    };

    document.getElementById("saveLimit").onclick = () => {
      Storage.setDailyLimit(document.getElementById("dailyLimit").value);
      Router.go("/review");
    };

    document.getElementById("start").onclick = () => this.runSrsSession(selected);
  },

  runSrsSession(level) {
    const host = document.getElementById("srsHost");
    if (!host) return;

    const st = Storage.getSrsStats();
    const cards = Storage.getDueCards({ level, limit: st.dailyLimit });
    if (!cards.length) {
      host.innerHTML = `<p class="muted">Aucune carte à réviser.</p>`;
      return;
    }

    let idx = 0;
    let revealed = false;

    const render = () => {
      const c = cards[idx];
      const front = SRS.escapeHtml(c.front);
      const back = SRS.escapeHtml(c.back);

      host.innerHTML = `
        <div class="card" style="margin-top:12px;">
          <div class="muted" style="margin-bottom:8px;">Carte ${idx+1} / ${cards.length} • <span class="pill" style="margin-left:8px;">${c.level}</span></div>

          <div>
            <div class="muted">Recto</div>
            <div style="font-size:18px; margin-top:6px;"><b>${front}</b></div>
          </div>

          <div style="margin-top:12px; display:${revealed ? "block":"none"};">
            <hr />
            <div class="muted">Verso</div>
            <div style="font-size:18px; margin-top:6px;"><b>${back}</b></div>
          </div>

          <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap;">
            <button class="btn" id="reveal">${revealed ? "Masquer" : "Voir la réponse"}</button>
            <div style="flex:1;"></div>
            <button class="btn" id="again" ${revealed ? "" : "disabled"}>🔁 Again</button>
            <button class="btn" id="hard"  ${revealed ? "" : "disabled"}>😅 Hard</button>
            <button class="btn" id="good"  ${revealed ? "" : "disabled"}>✅ Good</button>
            <button class="btn" id="easy"  ${revealed ? "" : "disabled"}>🚀 Easy</button>
          </div>
        </div>
      `;

      host.querySelector("#reveal").onclick = () => { revealed = !revealed; render(); };

      const grade = (g) => {
        Storage.gradeCard(c.id, g);
        idx++;
        revealed = false;

        if (idx >= cards.length) {
          const st2 = Storage.getSrsStats();
          host.innerHTML = `
            <div class="card" style="margin-top:12px;">
              <h3>Session terminée ✅</h3>
              <p class="muted">À réviser maintenant : <b>${st2.due}</b></p>
              <button class="btn" onclick="Router.go('/review')">↻ Retour Révision</button>
            </div>
          `;
          return;
        }
        render();
      };

      host.querySelector("#again").onclick = () => grade("again");
      host.querySelector("#hard").onclick  = () => grade("hard");
      host.querySelector("#good").onclick  = () => grade("good");
      host.querySelector("#easy").onclick  = () => grade("easy");
    };

    render();
  },

  // ---------- REF ----------
  viewRef() {
    const R = this.ref;
    const modules = R.modules || [];

    this.setView(`
      <section class="card">
        <span class="pill">Références</span>
        <h2 style="margin-top:10px;">${R.title || "Références"}</h2>
        <p class="muted">Choisis un module, puis une fiche.</p>
      </section>

      <section style="margin-top:12px;" class="grid">
        ${modules.length ? modules.map(m => `
          <div class="card">
            <h3>${m.title || "Module"}</h3>
            <p class="muted">Fiches : ${(m.lessons || []).length}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              ${(m.lessons || []).map(les => `
                <button class="btn" onclick="Router.go('/ref-lesson',{moduleId:'${m.id}', lessonId:'${les.id}'})">${les.title || "Fiche"}</button>
              `).join("")}
            </div>
          </div>
        `).join("") : `
          <div class="card">
            <h3>Aucun module trouvé</h3>
            <p class="muted">Ton <code>ref.json</code> est chargé mais ne contient pas de modules lisibles (modules/sections + lessons/items...).</p>
          </div>
        `}
      </section>

      <div style="margin-top:12px;">
        <button class="btn" onclick="Router.go('/')">← Retour</button>
      </div>
    `);
  },

  viewRefLesson(moduleId, lessonId) {
    const mod = (this.ref.modules || []).find(x => x.id === moduleId);
    const lesson = mod?.lessons?.find(x => x.id === lessonId);

    if (!mod || !lesson) {
      return this.setView(`
        <section class="card">
          <h2>Fiche introuvable</h2>
          <p class="muted">Vérifie les <code>id</code> dans ref.json.</p>
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
        <span class="pill">Références</span>
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

  // ---------- STATS ----------
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
  }
};

App.init();