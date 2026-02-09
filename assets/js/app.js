// assets/js/app.js — NORDIC MINIMAL (stable + clean layout)

const App = {,
  mount: null,

  levels: {},
  levelsOrder: ["A1", "A2", "B1", "B2"],

  ref: { title: "Références", modules: [] },

  refPlus: {
    title: "Référence+",
    themes: [],
    verbs: [],
    vocab: [],
    particles: [],
    articles: [],
    articles_guide: []
  },

  async init() {
    console.log("[App] Démarrage...");

    this.mount = document.getElementById("app");
    if (!this.mount) {
      console.error("[App] Element #app introuvable");
      return;
    }

    // Brand dot (optional)
    const brand = document.getElementById("nav-home");
    if (brand && !brand.querySelector(".brand-badge")) {
      const dot = document.createElement("span");
      dot.className = "brand-badge";
      brand.prepend(dot);
    }

    // Nav
    const navHomeBrand = document.getElementById("nav-home");
    const navHomeBtn   = document.getElementById("nav-home-btn");
    const navRef       = document.getElementById("nav-ref");
    const navReview    = document.getElementById("nav-review");
    const navStats     = document.getElementById("nav-stats");

    if (navHomeBrand) navHomeBrand.addEventListener("click", () => Router.go("/"));
    if (navHomeBtn)   navHomeBtn.addEventListener("click", () => Router.go("/"));
    if (navRef)       navRef.addEventListener("click", () => Router.go("/ref"));
    if (navReview)    navReview.addEventListener("click", () => Router.go("/review"));
    if (navStats)     navStats.addEventListener("click", () => Router.go("/stats"));

    // Routes
    Router.add("/", () => this.viewHome());
    Router.add("/level", (params) => this.viewLevel(params));
    Router.add("/lesson", (params) => this.viewLesson(params));
    Router.add("/ref", () => this.viewRef());
    Router.add("/ref-lesson", (params) => this.viewRefLesson(params));
    Router.add("/ref-plus", () => this.viewRefPlus());
    Router.add("/review", () => this.viewReview());
    Router.add("/stats", () => this.viewStats());

    // Load JSON
    try {
      const [a1, a2, b1, b2] = await Promise.all([
        fetch("assets/data/a1.json").then(r => r.json()),
        fetch("assets/data/a2.json").then(r => r.json()).catch(() => ({})),
        fetch("assets/data/b1.json").then(r => r.json()).catch(() => ({})),
        fetch("assets/data/b2.json").then(r => r.json()).catch(() => ({})),
      ]);

      if (a1 && a1.modules) this.levels.A1 = a1;
      if (a2 && a2.modules) this.levels.A2 = a2;
      if (b1 && b1.modules) this.levels.B1 = b1;
      if (b2 && b2.modules) this.levels.B2 = b2;

      const ref = await fetch("assets/data/ref.json").then(r => r.json());
      if (ref && ref.modules) this.ref = ref;

      const refPlus = await fetch("assets/data/ref_plus.json").then(r => r.json());
      if (refPlus) this.refPlus = refPlus;

      // SRS init
      try {
        if (window.SRS && typeof SRS.buildCardsFromLevels === "function") {
          const cards = SRS.buildCardsFromLevels(this.levels);
          AppStorage.upsertCards(cards);
        } else {
          console.warn("[App] SRS indisponible (SRS.buildCardsFromLevels introuvable)");
        }
      } catch (e) {
        console.error("[App] Erreur SRS:", e);
      }

    } catch (e) {
      console.error("[App] Erreur chargement JSON:", e);
      this.setView(`
        <div class="card error">
          <h2>Erreur de chargement</h2>
          <p class="muted">Impossible de charger les fichiers JSON.</p>
          <pre class="muted">${this.esc(e && e.stack ? e.stack : String(e))}</pre>
          <button class="btn" id="goHome">Retour</button>
        </div>
      `);
      document.getElementById("goHome")?.addEventListener("click", () => Router.go("/"));
      return;
    }

    Router.start();
  },

  // ===== helpers =====
  setView(html) { this.mount.innerHTML = html; },

  esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  },

  // ===== HOME =====
  viewHome() {
    const levelsCards = this.levelsOrder
      .filter(lvl => this.levels[lvl]?.modules?.length)
      .map(lvl => {
        const L = this.levels[lvl];
        const modulesCount = L.modules.length;
        const lessonsCount = L.modules.reduce((acc, m) => acc + ((m.lessons || []).length), 0);

        return `
          <div class="card">
            <div class="row between">
              <div>
                <h2>${this.esc(lvl)} — ${this.esc(L.title || "")}</h2>
                <p class="muted">${modulesCount} modules • ${lessonsCount} leçons</p>
              </div>
              <button class="btn primary" data-go="/level" data-level="${this.esc(lvl)}">Ouvrir</button>
            </div>
          </div>
        `;
      }).join("");

    const srsStats = AppStorage.getSrsStats();
    const due = srsStats.due || 0;

    this.setView(`
      <div class="stack">
        <div class="hero">
          <h1>Svenska Mästare Pro</h1>
          <p class="muted">Minimal, clair, et efficace — avec révision SRS.</p>
          <div class="hero-actions">
            <button class="btn primary" data-go="/review">Révision SRS ${due ? `<span class="badge warn">${due}</span>` : ""}</button>
            <button class="btn" data-go="/stats">Statistiques</button>
          </div>
        </div>

        <div class="grid">
          ${levelsCards || `<div class="card"><p class="muted">Aucun niveau chargé.</p></div>`}
        </div>

        <div class="grid grid-2">
          <div class="card">
            <h2>Références</h2>
            <p class="muted">Bescherelles, verbes, particules…</p>
            <button class="btn" data-go="/ref">Ouvrir</button>
          </div>
          <div class="card">
            <h2>Référence+</h2>
            <p class="muted">Tableaux, listes, synthèses</p>
            <button class="btn" data-go="/ref-plus">Ouvrir</button>
          </div>
        </div>
      </div>
    `);

    this.mount.querySelectorAll("[data-go]").forEach(btn => {
      btn.addEventListener("click", () => {
        const go = btn.getAttribute("data-go");
        const level = btn.getAttribute("data-level");
        if (go === "/level") Router.go("/level", { level });
        else Router.go(go, {});
      });
    });
  },

  // ===== LEVEL =====
  viewLevel(params) {
    const levelKey = params?.level || "A1";
    const L = this.levels[levelKey];

    if (!L) {
      this.setView(`
        <div class="card error">
          <h2>Niveau introuvable</h2>
          <button class="btn" id="homeBtn">Accueil</button>
        </div>
      `);
      document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));
      return;
    }

    const modulesHtml = (L.modules || []).map(m => {
      const lessons = (m.lessons || []).map(ls => {
        const key = `${levelKey}:${ls.id}`;
        const done = AppStorage.isDone(key);

        return `
          <div class="lesson-row ${done ? "done" : ""}">
            <div class="lesson-info">
              <div class="lesson-title">${this.esc(ls.title)}</div>
              <div class="muted">${this.esc(ls.type || "")}</div>
            </div>
            <div class="lesson-actions">
              ${done ? `<span class="badge ok">Terminé</span>` : `<span class="badge">À faire</span>`}
              <button class="btn" data-go="/lesson" data-level="${this.esc(levelKey)}" data-lesson="${this.esc(ls.id)}">Ouvrir</button>
            </div>
          </div>
        `;
      }).join("");

      return `
        <div class="card">
          <h2>${this.esc(m.title || "")}</h2>
          <div class="stack">${lessons || `<p class="muted">Aucune leçon.</p>`}</div>
        </div>
      `;
    }).join("");

    this.setView(`
      <div class="stack">
        <div class="card">
          <div class="row between">
            <div>
              <h1>${this.esc(levelKey)} — ${this.esc(L.title || "")}</h1>
              <p class="muted">${this.esc(L.description || "")}</p>
            </div>
            <button class="btn" id="backBtn">← Retour</button>
          </div>
        </div>
        ${modulesHtml}
      </div>
    `);

    document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/"));

    this.mount.querySelectorAll("[data-go='/lesson']").forEach(btn => {
      btn.addEventListener("click", () => {
        Router.go("/lesson", {
          level: btn.getAttribute("data-level"),
          lesson: btn.getAttribute("data-lesson")
        });
      });
    });
  },

  // ===== LESSON =====
  viewLesson(params) {
    const levelKey = params?.level;
    const lessonId = params?.lesson;

    const L = this.levels[levelKey];
    if (!L) { this.setView(`<div class="card error"><h2>Erreur</h2><p class="muted">Niveau introuvable.</p></div>`); return; }

    let lesson = null;
    let moduleTitle = "";
    for (const m of (L.modules || [])) {
      const found = (m.lessons || []).find(ls => String(ls.id) === String(lessonId));
      if (found) { lesson = found; moduleTitle = m.title || ""; break; }
    }
    if (!lesson) { this.setView(`<div class="card error"><h2>Erreur</h2><p class="muted">Leçon introuvable.</p></div>`); return; }

    const key = `${levelKey}:${lesson.id}`;

    this.setView(`
      <div class="stack">
        <div class="card">
          <div class="row between">
            <div>
              <h1>${this.esc(lesson.title || "")}</h1>
              <p class="muted">${this.esc(levelKey)} • ${this.esc(moduleTitle)} • ${this.esc(lesson.type || "")}</p>
            </div>
            <div class="row">
              <button class="btn" id="backBtn">← Retour</button>
              <button class="btn ghost" id="homeBtn">Accueil</button>
              <button class="btn primary" id="doneBtn">Marquer terminé</button>
            </div>
          </div>
        </div>

        ${this.renderContent(lesson.content)}
        ${this.renderExamples(lesson.examples)}
        ${this.renderVocab(lesson.vocab)}
        ${this.renderMiniDrills(lesson.mini_drills)}
        ${this.renderQuiz(lesson.quiz)}
      </div>
    `);

    document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/"));
    document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));
    document.getElementById("doneBtn")?.addEventListener("click", () => {
      AppStorage.markDone(key);
      alert("✅ Leçon marquée comme terminée !");
      Router.go("/level", { level: levelKey });
    });

    this.mount.querySelectorAll("[data-reveal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-reveal");
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = (el.style.display === "none" ? "block" : "none");
      });
    });
  },

  // ===== CONTENT RENDERER (Dialogue + Décomposition) =====
renderContent(lines) {
  if (!Array.isArray(lines)) return "";

  const raw = lines
    .map(x => String(x ?? "").trimEnd())
    .filter(Boolean)
    .filter(x => !/^[=\-_*]{6,}$/.test(x)); // enlève "====="

  if (!raw.length) return "";

  const norm = (s) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const isHeading = (s) => {
    const t = String(s ?? "").trim();
    if (!t) return false;
    if (t.endsWith(":")) return true;
    const letters = t.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
    const upperRatio = letters
      ? (letters.replace(/[^A-ZÀ-ÖØ-Þ]/g, "").length / letters.length)
      : 0;
    return (t.length <= 52 && upperRatio >= 0.72);
  };

  const isListItem = (s) => /^[-•]\s+/.test(s);

  const isCallout = (s) => {
    const n = norm(s);
    return (
      n.startsWith("astuce") ||
      n.startsWith("note") ||
      n.startsWith("a retenir") ||
      n.startsWith("à retenir") ||
      n.startsWith("attention") ||
      s.includes("→") ||
      s.includes("=>")
    );
  };

  const isObjective = (s) => norm(s).startsWith("objectif");

  // Marqueurs de sections (si ça arrive "dans" le dialogue, on coupe net)
  const isSectionMarkerInline = (s) => {
    const n = norm(s);
    return (
      n.startsWith("decomposition") ||
      n.startsWith("dÉcomposition") ||
      n.startsWith("explication du prof") ||
      n.startsWith("prononciation utile") ||
      n.startsWith("structures cles") ||
      n.startsWith("structures clés") ||
      n.startsWith("ordre des mots") ||
      n.startsWith("drills") ||
      n.startsWith("mini-story") ||
      n.startsWith("production guidee") ||
      n.startsWith("production guidée") ||
      n.startsWith("vocabulaire") ||
      n.startsWith("quiz")
    );
  };

  // Décomposition: "SV = FR"
  const splitBreakdown = (s) => {
    const idx = s.indexOf("=");
    if (idx === -1) return null;
    const left = s.slice(0, idx).trim();
    const right = s.slice(idx + 1).trim();
    if (!left || !right) return null;
    return { left, right };
  };

  // ===== DIALOGUE PARSER (SV + pron + fr) =====
  // On construit des "turns" : { speaker: "A"/"B"/"•", sv, pron, fr }
  const dialogueTurns = [];
  let pendingTurn = null;

  const flushPendingTurn = () => {
    if (!pendingTurn) return;
    // si rien de significatif, on ignore
    if (
      !String(pendingTurn.sv || "").trim() &&
      !String(pendingTurn.pron || "").trim() &&
      !String(pendingTurn.fr || "").trim()
    ) {
      pendingTurn = null;
      return;
    }
    dialogueTurns.push(pendingTurn);
    pendingTurn = null;
  };

  const parseSpeakerLine = (line) => {
    // A: bla
    const m = line.match(/^([A-ZÅÄÖ])\s*:\s*(.+)$/);
    if (!m) return null;
    return { speaker: m[1], text: m[2].trim() };
  };

  const parsePronLine = (line) => {
    // ( ... )
    const m = line.match(/^\(([^)]+)\)\s*$/);
    return m ? m[1].trim() : null;
  };

  const parseFrLine = (line) => {
    // formats FR possibles:
    // → bla
    // 🇫🇷 bla
    // FR: bla
    // - bla (si tu veux mais on évite ici)
    let t = line.trim();
    if (!t) return null;

    // flèche
    if (/^→\s+/.test(t)) return t.replace(/^→\s+/, "").trim();

    // drapeau FR
    if (/^🇫🇷\s+/.test(t)) return t.replace(/^🇫🇷\s+/, "").trim();

    // "FR:"
    const m = t.match(/^fr\s*:\s*(.+)$/i);
    if (m) return m[1].trim();

    return null;
  };

  // Si une ligne contient " ... DÉCOMPOSITION ..." collée, on split
  const splitIfInlineSection = (line) => {
    const markers = [
      "DÉCOMPOSITION",
      "DECOMPOSITION",
      "EXPLICATION DU PROF",
      "PRONONCIATION UTILE",
      "STRUCTURES CLÉS",
      "STRUCTURES CLES",
      "ORDRE DES MOTS",
      "DRILLS",
      "MINI-STORY",
      "PRODUCTION GUIDÉE",
      "PRODUCTION GUIDEE",
      "VOCABULAIRE",
      "QUIZ"
    ];

    const upper = line.toUpperCase();
    let bestIdx = -1;
    let bestMarker = "";

    for (const mk of markers) {
      const idx = upper.indexOf(mk);
      if (idx > 0 && (bestIdx === -1 || idx < bestIdx)) {
        bestIdx = idx;
        bestMarker = mk;
      }
    }

    if (bestIdx === -1) return null;

    const left = line.slice(0, bestIdx).trim();
    const right = line.slice(bestIdx).trim();
    if (!right) return null;

    return { left, right };
  };

  // ===== BLOCK BUILDER =====
  const blocks = [];
  let paragraph = [];
  let list = [];
  let mode = "normal"; // normal | dialogue | breakdown
  let breakdownRows = [];
  let dialogueLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push({ type: "ul", items: list.slice() });
    list = [];
  };

  const flushBreakdown = () => {
    if (!breakdownRows.length) return;
    blocks.push({ type: "breakdown", rows: breakdownRows.slice() });
    breakdownRows = [];
  };

  const flushDialogue = () => {
    if (!dialogueLines.length) return;

    // Convertit dialogueLines => dialogueTurns (SV + pron + FR)
    dialogueTurns.length = 0;
    pendingTurn = null;

    for (const rawLine of dialogueLines) {
      const line = String(rawLine ?? "").trim();

      // Cas: marker collé à une phrase => split
      const split = splitIfInlineSection(line);
      if (split) {
        // on traite la partie gauche comme une ligne normale du dialogue
        const left = split.left;
        const right = split.right;

        if (left) {
          const sp = parseSpeakerLine(left);
          const pr = parsePronLine(left);
          const fr = parseFrLine(left);

          if (sp) {
            flushPendingTurn();
            pendingTurn = { speaker: sp.speaker, sv: sp.text, pron: "", fr: "" };
          } else if (pr) {
            if (!pendingTurn) pendingTurn = { speaker: "•", sv: "", pron: "", fr: "" };
            pendingTurn.pron = pr;
          } else if (fr) {
            if (!pendingTurn) pendingTurn = { speaker: "•", sv: "", pron: "", fr: "" };
            pendingTurn.fr = fr;
          } else {
            // sinon on colle dans sv (fallback)
            if (!pendingTurn) pendingTurn = { speaker: "•", sv: "", pron: "", fr: "" };
            pendingTurn.sv = (pendingTurn.sv ? (pendingTurn.sv + " ") : "") + left;
          }
        }

        // on clôt la dernière bulle proprement
        flushPendingTurn();

        // et on pousse un "marker line" en dehors du dialogue
        blocks.push({ type: "h", text: right.replace(/:$/, "") });

        // on repasse en normal/breakdown selon marker
        if (norm(right).includes("decomposition")) mode = "breakdown";
        else mode = "normal";

        // puis on continue (le reste du dialogue sera traité hors ici)
        continue;
      }

      // Si une section arrive en plein dialogue, on coupe net
      if (isSectionMarkerInline(line)) {
        flushPendingTurn();
        blocks.push({ type: "dialogue", turns: dialogueTurns.slice() });
        dialogueLines = [];
        blocks.push({ type: "h", text: line.replace(/:$/, "") });
        mode = norm(line).includes("decomposition") ? "breakdown" : "normal";
        continue;
      }

      const sp = parseSpeakerLine(line);
      const pr = parsePronLine(line);
      const fr = parseFrLine(line);

      if (sp) {
        flushPendingTurn();
        pendingTurn = { speaker: sp.speaker, sv: sp.text, pron: "", fr: "" };
        continue;
      }

      if (pr) {
        if (!pendingTurn) pendingTurn = { speaker: "•", sv: "", pron: "", fr: "" };
        pendingTurn.pron = pr;
        continue;
      }

      if (fr) {
        if (!pendingTurn) pendingTurn = { speaker: "•", sv: "", pron: "", fr: "" };
        pendingTurn.fr = fr;
        continue;
      }

      // fallback: ligne brute
      if (!pendingTurn) pendingTurn = { speaker: "•", sv: "", pron: "", fr: "" };
      pendingTurn.sv = (pendingTurn.sv ? (pendingTurn.sv + " ") : "") + line;
    }

    flushPendingTurn();

    if (dialogueTurns.length) {
      blocks.push({ type: "dialogue", turns: dialogueTurns.slice() });
    }

    dialogueLines = [];
  };

  // ===== MAIN LOOP =====
  for (const line0 of raw) {
    const line = String(line0 ?? "").trim();
    const n = norm(line);

    // Titres
    if (isHeading(line)) {
      flushList();
      flushParagraph();
      flushDialogue();
      flushBreakdown();

      blocks.push({ type: "h", text: line.replace(/:$/, "") });

      if (n.includes("dialogue")) mode = "dialogue";
      else if (n.includes("decomposition")) mode = "breakdown";
      else mode = "normal";

      continue;
    }

    // Mode dialogue: on stocke les lignes, flushDialogue fera la logique SV/PRON/FR
    if (mode === "dialogue") {
      dialogueLines.push(line);
      continue;
    }

    // Mode breakdown
    if (mode === "breakdown") {
      const row = splitBreakdown(line);
      if (row) breakdownRows.push(row);
      else {
        flushBreakdown();
        paragraph.push(line);
      }
      continue;
    }

    // Objectif
    if (isObjective(line)) {
      flushList();
      flushParagraph();
      blocks.push({ type: "lead", text: line });
      continue;
    }

    // Listes
    if (isListItem(line)) {
      flushParagraph();
      list.push(line.replace(/^[-•]\s+/, ""));
      continue;
    }

    // Callouts
    if (isCallout(line)) {
      flushList();
      flushParagraph();
      blocks.push({ type: "callout", text: line });
      continue;
    }

    // Paragraphe normal
    flushList();
    paragraph.push(line);
  }

  // Flush final
  flushList();
  flushParagraph();
  flushDialogue();
  flushBreakdown();

  // ===== RENDER =====
  const renderBlocks = blocks.map(b => {
    if (b.type === "h") {
      return `<h3><span class="hl">${this.esc(b.text)}</span></h3>`;
    }

    if (b.type === "lead") {
      const t = b.text.replace(/^\s*Objectif\s*:\s*/i, "").trim();
      return `<div class="lead"><div class="k">Objectif</div><p>${this.esc(t)}</p></div>`;
    }

    if (b.type === "ul") {
      return `<div class="sheet"><ul>${b.items.map(it => `<li>${this.esc(it)}</li>`).join("")}</ul></div>`;
    }

    if (b.type === "callout") {
      const cleaned = b.text.replace(/^\s*(Astuce|Note|À retenir|A retenir|Attention)\s*[:\-]\s*/i, "").trim();
      const label = (/^\s*attention/i.test(norm(b.text))) ? "Attention" : "À retenir";
      return `<div class="callout"><div class="label">${this.esc(label)}</div><p>${this.esc(cleaned)}</p></div>`;
    }

    if (b.type === "dialogue") {
      const bubbles = (b.turns || []).map(t => {
        const speaker = (t.speaker || "").trim();
        const cls = (speaker === "B") ? "b" : "a";

        return `
          <div class="bubble ${cls}">
            <div class="meta"><span class="tag">${this.esc(speaker || "•")}</span> ${this.esc(speaker ? `Locuteur ${speaker}` : "Dialogue")}</div>
            ${t.sv ? `<div class="sv">${this.esc(t.sv)}</div>` : ""}
            ${t.pron ? `<div class="pron">🔊 ${this.esc(t.pron)}</div>` : ""}
            ${t.fr ? `<div class="fr">🇫🇷 ${this.esc(t.fr)}</div>` : ""}
          </div>
        `;
      }).join("");

      return `<div class="dialogue">${bubbles}</div>`;
    }

    if (b.type === "breakdown") {
      const rows = b.rows.map(r => `
        <div class="break-row">
          <div class="break-sv">${this.esc(r.left)}</div>
          <div class="break-fr">${this.esc(r.right)}</div>
        </div>
      `).join("");
      return `<div class="breakdown">${rows}</div>`;
    }

    if (b.type === "p") return `<div class="sheet"><p>${this.esc(b.text)}</p></div>`;

    return "";
  }).join("\n");

  return `
    <div class="card">
      <div class="section-title"><span class="chip"></span><h2>Contenu</h2></div>
      <div class="article">${renderBlocks}</div>
    </div>
  `;
},

  // ===== Exemples =====
  renderExamples(examples) {
    if (!Array.isArray(examples) || !examples.length) return "";
    return `
      <div class="card">
        <div class="section-title"><span class="chip"></span><h2>Exemples</h2></div>
        <div class="examples">
          ${examples.map(ex => `
            <div class="example">
              <div class="sv">${this.esc(ex.sv || "")}</div>
              ${ex.pron ? `<div class="pron">${this.esc(ex.pron)}</div>` : ""}
              ${ex.fr ? `<div class="fr">${this.esc(ex.fr)}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  renderVocab(vocab) {
    if (!Array.isArray(vocab) || !vocab.length) return "";
    return `
      <div class="card">
        <div class="section-title"><span class="chip"></span><h2>Vocabulaire</h2></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>SV</th><th>FR</th><th>Pron</th><th>Note</th></tr></thead>
            <tbody>
              ${vocab.map(v => `
                <tr>
                  <td style="font-weight:850;">${this.esc(v.sv || "")}</td>
                  <td>${this.esc(v.fr || "")}</td>
                  <td class="muted" style="font-family: var(--mono);">${this.esc(v.pron || "")}</td>
                  <td class="muted">${this.esc(v.note || "")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderMiniDrills(drills) {
    if (!Array.isArray(drills) || !drills.length) return "";
    return `
      <div class="card">
        <div class="section-title"><span class="chip"></span><h2>Mini-drills</h2></div>
        <div class="stack">
          ${drills.map(d => `
            <div class="card" style="box-shadow:none; padding:14px;">
              <div style="font-weight:850;">${this.esc(d.instruction || "")}</div>
              ${Array.isArray(d.items) && d.items.length
                ? `<ul style="margin-top:10px;">${d.items.map(it => `<li>${this.esc(it)}</li>`).join("")}</ul>`
                : `<div class="muted" style="margin-top:10px;">Aucun item.</div>`}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  renderQuiz(quiz) {
    if (!Array.isArray(quiz) || !quiz.length) return "";
    return `
      <div class="card">
        <div class="section-title"><span class="chip"></span><h2>Quiz</h2></div>
        <div class="stack">
          ${quiz.map((q, i) => {
            const id = `ans_${Math.random().toString(16).slice(2)}_${i}`;
            return `
              <div class="card" style="box-shadow:none; padding:14px;">
                <div style="font-weight:850;">${this.esc(q.q || "")}</div>
                <button class="btn" style="margin-top:10px;" data-reveal="${id}">Afficher la réponse</button>
                <div id="${id}" class="muted" style="display:none; margin-top:10px;">
                  ✅ ${this.esc(q.answer || "")}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  // ===== REF =====
  viewRef() {
    const mods = (this.ref.modules || []).map(m => {
      const lessons = (m.lessons || []).map(ls => `
        <div class="lesson-row">
          <div class="lesson-info">
            <div class="lesson-title">${this.esc(ls.title || "")}</div>
            <div class="muted">${this.esc(ls.type || "")}</div>
          </div>
          <div class="lesson-actions">
            <button class="btn" data-go="/ref-lesson" data-module="${this.esc(m.id)}" data-lesson="${this.esc(ls.id)}">Ouvrir</button>
          </div>
        </div>
      `).join("");

      return `
        <div class="card">
          <h2>${this.esc(m.title || "")}</h2>
          <div class="stack">${lessons || `<p class="muted">Aucune leçon.</p>`}</div>
        </div>
      `;
    }).join("");

    this.setView(`
      <div class="stack">
        <div class="card">
          <div class="row between">
            <div>
              <h1>${this.esc(this.ref.title || "Références")}</h1>
              <p class="muted">Bescherelles, verbes, particules…</p>
            </div>
            <div class="row">
              <button class="btn" id="backBtn">← Retour</button>
              <button class="btn ghost" id="homeBtn">Accueil</button>
            </div>
          </div>
        </div>
        ${mods || `<div class="card"><p class="muted">Aucune référence.</p></div>`}
      </div>
    `);

    document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));
    document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/"));

    this.mount.querySelectorAll("[data-go='/ref-lesson']").forEach(btn => {
      btn.addEventListener("click", () => {
        Router.go("/ref-lesson", {
          module: btn.getAttribute("data-module"),
          lesson: btn.getAttribute("data-lesson")
        });
      });
    });
  },

  viewRefLesson(params) {
    const moduleId = params?.module;
    const lessonId = params?.lesson;

    const mod = (this.ref.modules || []).find(m => String(m.id) === String(moduleId));
    if (!mod) { this.setView(`<div class="card error"><h2>Erreur</h2><p class="muted">Module introuvable.</p></div>`); return; }

    const lesson = (mod.lessons || []).find(ls => String(ls.id) === String(lessonId));
    if (!lesson) { this.setView(`<div class="card error"><h2>Erreur</h2><p class="muted">Leçon introuvable.</p></div>`); return; }

    this.setView(`
      <div class="stack">
        <div class="card">
          <div class="row between">
            <div>
              <h1>${this.esc(lesson.title || "")}</h1>
              <p class="muted">Référence • ${this.esc(mod.title || "")}</p>
            </div>
            <div class="row">
              <button class="btn" id="backBtn">← Retour</button>
              <button class="btn ghost" id="homeBtn">Accueil</button>
            </div>
          </div>
        </div>

        ${this.renderContent(lesson.content)}
        ${this.renderExamples(lesson.examples)}
        ${this.renderVocab(lesson.vocab)}
      </div>
    `);

    document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));
    document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/ref"));
  },

  // ===== REF+ =====
  viewRefPlus() {
    const fp = this.refPlus || {};

    const renderAutoTable = (items) => {
      if (!Array.isArray(items) || !items.length) return `<p class="muted">Aucun contenu.</p>`;
      if (typeof items[0] !== "object") return `<ul>${items.map(x => `<li>${this.esc(x)}</li>`).join("")}</ul>`;
      const keys = Array.from(new Set(items.flatMap(o => Object.keys(o || {})))).slice(0, 10);
      return `
        <div class="table-wrap">
          <table>
            <thead><tr>${keys.map(k => `<th>${this.esc(k)}</th>`).join("")}</tr></thead>
            <tbody>
              ${items.map(o => `<tr>${keys.map(k => `<td class="muted">${this.esc(o?.[k] ?? "")}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
      `;
    };

    this.setView(`
      <div class="stack">
        <div class="card">
          <div class="row between">
            <div>
              <h1>${this.esc(fp.title || "Référence+")}</h1>
              <p class="muted">Tableaux & listes</p>
            </div>
            <div class="row">
              <button class="btn" id="backBtn">← Retour</button>
              <button class="btn ghost" id="homeBtn">Accueil</button>
            </div>
          </div>
        </div>

        <div class="card"><h2>Thèmes</h2>${renderAutoTable(fp.themes)}</div>
        <div class="card"><h2>Verbes</h2>${renderAutoTable(fp.verbs)}</div>
        <div class="card"><h2>Vocabulaire</h2>${renderAutoTable(fp.vocab)}</div>
        <div class="card"><h2>Particules</h2>${renderAutoTable(fp.particles)}</div>
        <div class="card"><h2>Articles</h2>${renderAutoTable(fp.articles)}</div>
        <div class="card"><h2>Guide des articles</h2>${renderAutoTable(fp.articles_guide)}</div>
      </div>
    `);

    document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));
    document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/"));
  },

  // ===== REVIEW (SRS) =====
  viewReview() {
    const makeSession = ({ mode }) => {
      const state = AppStorage.load();
      const all = Object.values(state.srs?.cards || {});
      const now = Date.now();

      const due = all.filter(c => (c.nextDue || 0) <= now);
      const fresh = all.filter(c => (c.reps || 0) === 0);
      const randomPool = all.filter(c => (c.reps || 0) > 0);

      if (mode === "due") return due.slice(0, 30);
      if (mode === "new") return fresh.slice(0, 20);
      if (mode === "random") {
        for (let i = randomPool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [randomPool[i], randomPool[j]] = [randomPool[j], randomPool[i]];
        }
        return randomPool.slice(0, 20);
      }
      return [];
    };

    let session = makeSession({ mode: "due" });

    if (!session.length) {
      const state = AppStorage.load();
      const all = Object.values(state.srs?.cards || {});
      const freshCount = all.filter(c => (c.reps || 0) === 0).length;

      this.setView(`
        <div class="stack">
          <div class="card">
            <div class="row between">
              <div>
                <h1>Révision SRS</h1>
                <p class="muted">Tu es à jour ✅</p>
              </div>
              <div class="row">
                <button class="btn" id="backBtn">← Retour</button>
                <button class="btn ghost" id="homeBtn">Accueil</button>
              </div>
            </div>
          </div>

          <div class="card">
            <h2>Démarrer quand même</h2>
            <p class="muted">Nouvelles cartes ou session aléatoire.</p>
            <div class="row">
              <button class="btn primary" id="startNewBtn">Nouvelles (${freshCount})</button>
              <button class="btn" id="startRandomBtn">Aléatoire</button>
            </div>
          </div>
        </div>
      `);

      document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));
      document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/"));
      document.getElementById("startNewBtn")?.addEventListener("click", () => {
        session = makeSession({ mode: "new" });
        if (!session.length) return alert("Aucune nouvelle carte disponible.");
        this._runReviewSession(session);
      });
      document.getElementById("startRandomBtn")?.addEventListener("click", () => {
        session = makeSession({ mode: "random" });
        if (!session.length) return alert("Pas assez de cartes pour une révision aléatoire.");
        this._runReviewSession(session);
      });

      return;
    }

    this._runReviewSession(session);
  },

  _runReviewSession(session) {
    let idx = 0;
    let showBack = false;

    const render = () => {
      const c = session[idx];

      this.setView(`
        <div class="stack">
          <div class="card">
            <div class="row between">
              <div>
                <h1>Révision SRS</h1>
                <p class="muted">Carte ${idx + 1}/${session.length}</p>
              </div>
              <div class="row">
                <button class="btn" id="backBtn">← Retour</button>
                <button class="btn ghost" id="homeBtn">Accueil</button>
              </div>
            </div>
          </div>

          <div class="card">
            <div style="font-weight:850; letter-spacing:.2px;">${this.esc(c.front || "")}</div>
            ${showBack ? `<div style="margin-top:10px;">${this.esc(c.back || "")}</div>` : `<div class="muted" style="margin-top:10px;">Clique sur “Afficher”</div>`}
            <div class="row" style="margin-top:14px;">
              <button class="btn" id="toggleBtn">${showBack ? "Cacher" : "Afficher"}</button>
            </div>
          </div>

          ${showBack ? `
            <div class="card">
              <h2>Auto-évaluation</h2>
              <div class="row" style="gap:10px;">
                <button class="btn danger" data-grade="0">0 — Oublié</button>
                <button class="btn" data-grade="1" style="border-color: rgba(245,158,11,0.35); background: rgba(245,158,11,0.10);">1 — Difficile</button>
                <button class="btn" data-grade="2">2 — OK</button>
                <button class="btn" data-grade="3" style="border-color: rgba(22,163,74,0.30); background: rgba(22,163,74,0.10);">3 — Facile</button>
              </div>
            </div>
          ` : ""}
        </div>
      `);

      document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));
      document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/"));
      document.getElementById("toggleBtn")?.addEventListener("click", () => { showBack = !showBack; render(); });

      this.mount.querySelectorAll("[data-grade]").forEach(btn => {
        btn.addEventListener("click", () => {
          const grade = Number(btn.getAttribute("data-grade"));
          AppStorage.gradeCard(c.id, grade);
          AppStorage.addResult(grade >= 2);
          idx++;
          showBack = false;
          if (idx >= session.length) Router.go("/stats");
          else render();
        });
      });
    };

    render();
  },

  // ===== STATS =====
  viewStats() {
    const s = AppStorage.load();
    const st = s.stats || { correct: 0, wrong: 0, streak: 0, lastStudyDate: null };
    const srs = AppStorage.getSrsStats();

    this.setView(`
      <div class="stack">
        <div class="card">
          <div class="row between">
            <div>
              <h1>Statistiques</h1>
              <p class="muted">Progression & SRS</p>
            </div>
            <div class="row">
              <button class="btn" id="backBtn">← Retour</button>
              <button class="btn ghost" id="homeBtn">Accueil</button>
            </div>
          </div>
        </div>

        <div class="grid grid-2">
          <div class="card">
            <h2>Résultats</h2>
            <p>✅ Bonnes réponses : <b>${st.correct || 0}</b></p>
            <p>❌ Mauvaises réponses : <b>${st.wrong || 0}</b></p>
            <p>🔥 Streak : <b>${st.streak || 0}</b> jour(s)</p>
            <p class="muted">Dernière étude : ${this.esc(st.lastStudyDate || "—")}</p>
          </div>

          <div class="card">
            <h2>SRS</h2>
            <p>Total cartes : <b>${srs.total}</b></p>
            <p>À réviser : <b>${srs.due}</b></p>
            <p>Nouvelles : <b>${srs.newCards}</b></p>
            <p>En apprentissage : <b>${srs.learning}</b></p>
            <p>Matures : <b>${srs.mature}</b></p>
          </div>
        </div>

        <div class="card">
          <h2>Actions</h2>
          <div class="row" style="gap:10px;">
            <button class="btn primary" id="reviewBtn">Réviser maintenant</button>
            <button class="btn danger" id="resetBtn">Réinitialiser</button>
          </div>
          <p class="muted">⚠️ La réinitialisation efface toutes les données (progression + SRS).</p>
        </div>
      </div>
    `);

    document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));
    document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/"));
    document.getElementById("reviewBtn")?.addEventListener("click", () => Router.go("/review"));
    document.getElementById("resetBtn")?.addEventListener("click", () => AppStorage.reset());
  }
};

// Boot
window.addEventListener("DOMContentLoaded", () => App.init());
