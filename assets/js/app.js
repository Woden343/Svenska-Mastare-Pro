// assets/js/app.js — NORDIC MINIMAL (stable + clean layout)

const App = {
  mount: null,

  // Theme (persisted)
  applyTheme() {
    const saved = localStorage.getItem("sm_theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  },
  toggleTheme() {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("sm_theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
  },

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
    this.applyTheme();
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


    // Theme toggles (sidebar + mobile)
    const themeToggle = document.getElementById("themeToggle");
    const themeToggleMobile = document.getElementById("themeToggleMobile");
    if (themeToggle) themeToggle.addEventListener("click", () => this.toggleTheme());
    if (themeToggleMobile) themeToggleMobile.addEventListener("click", () => this.toggleTheme());

    // Mobile menu
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const openMenu = () => { sidebar?.classList.add("open"); overlay?.classList.add("show"); };
    const closeMenu = () => { sidebar?.classList.remove("open"); overlay?.classList.remove("show"); };
    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    // Mobile brand = home
    document.getElementById("nav-home-mobile")?.addEventListener("click", () => Router.go("/"));

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

// ===== Lesson organization helpers (safe, fallback-friendly) =====
parseLessonSections(lines) {
  const src = Array.isArray(lines) ? lines.map(x => String(x ?? "")) : [];
  const isHeader = (t) => {
    const s = t.trim();
    if (!s) return false;
    return /^(🎯|💬|🧑‍🏫|👨‍🏫|✍️|📝|📚|🧠|✅|🏁)\s|^(OBJECTIF|DIALOGUE|PRODUCTION|VOCABULAIRE|EXPLICATION|PROF)/i.test(s);
  };
  const normKey = (t) => {
    const s = t.trim().toUpperCase();
    if (s.includes("DIALOGUE") || s.startsWith("💬")) return "dialogue";
    if (s.includes("PRODUCTION") || s.startsWith("✍️") || s.startsWith("📝")) return "production";
    if (s.includes("VOCAB") || s.startsWith("📚")) return "vocab";
    if (s.includes("PROF") || s.includes("EXPLICATION") || s.startsWith("🧑‍🏫") || s.startsWith("👨‍🏫")) return "prof";
    if (s.includes("OBJECTIF") || s.startsWith("🎯")) return "objective";
    return "other";
  };

  const sections = {};
  let cur = "other";
  sections[cur] = [];

  for (const line of src) {
    if (isHeader(line)) {
      cur = normKey(line);
      if (!sections[cur]) sections[cur] = [];
      continue;
    }
    sections[cur].push(line);
  }

  for (const k of Object.keys(sections)) {
    sections[k] = sections[k].map(x => x.trim()).filter(Boolean);
  }
  return sections;
},

extractDialogueItems(dialogueLines) {
  const lines = Array.isArray(dialogueLines) ? dialogueLines.map(x => String(x ?? "").trim()).filter(Boolean) : [];
  const items = [];
  let cur = { sv: "", fr: "", pron: "", idx: "" };

  const flush = () => {
    if (cur.sv || cur.fr || cur.pron) items.push({ ...cur });
    cur = { sv: "", fr: "", pron: "", idx: "" };
  };

  for (const t of lines) {
    // Number line (01, 02, ...)
    if (/^\d{2}$/.test(t)) { cur.idx = t; continue; }

    // Common prefixes in your lessons: "SE ..." / "FR ..." / "PRON ..."
    if (/^(SE|SV)\s+/i.test(t)) { cur.sv = t.replace(/^(SE|SV)\s+/i, ""); continue; }
    if (/^FR\s+/i.test(t)) { cur.fr = t.replace(/^FR\s+/i, ""); flush(); continue; }
    if (/^PRON\s*:/i.test(t)) { cur.pron = t.replace(/^PRON\s*:\s*/i, ""); continue; }

    // IPA-like or phonetic line (heuristic)
    if (!cur.pron && (t.startsWith("/") || t.includes("hé") || t.includes("ya") || t.includes("-") || t.includes("ː"))) {
      // If we already have SV but no PRON yet, treat as PRON
      if (cur.sv && !cur.pron) { cur.pron = t; continue; }
    }

    // Fallback cascade
    if (!cur.sv) cur.sv = t;
    else if (!cur.pron) cur.pron = t;
    else if (!cur.fr) cur.fr = t;
    else cur.fr += " " + t;
  }
  flush();
  return items;
},

renderDialogueDecomposition(items) {
  const safe = (s) => this.esc(String(s ?? ""));
  const cards = items.map((it, i) => `
    <div class="pill-card">
      <div class="top">
        <span class="sv">${safe(it.sv)}</span>
        <span class="idx">${safe(it.idx || String(i+1).padStart(2, "0"))}</span>
      </div>
      ${it.pron ? `<div class="pron">${safe(it.pron)}</div>` : ``}
      ${it.fr ? `<div class="fr">${safe(it.fr)}</div>` : ``}
    </div>
  `).join("");
  return `<div class="pill-grid">${cards}</div>`;
},

renderProductionBlock(lines) {
  const safe = (s) => this.esc(String(s ?? ""));
  const text = Array.isArray(lines) ? lines.join(" ") : "";
  const hintLine = (Array.isArray(lines) ? lines.find(x => String(x).includes("Jag heter")) : "") || `"Jag heter ... Jag kommer från ... Jag bor i ..."`;
  return `
    <div class="production">
      <div class="row" style="align-items:flex-start; gap:12px;">
        <div class="lesson-icon" aria-hidden="true">✍️</div>
        <div style="flex:1;">
          <h2 style="margin:0 0 6px;">Production guidée</h2>
          <p class="muted" style="margin:0; line-height:1.65;">${safe(text || "Présente-toi en 3 phrases en utilisant les structures vues.")}</p>
          <div style="height:12px"></div>
          <div class="hint">${safe(hintLine)}</div>
        </div>
      </div>
    </div>
  `;
},

renderProfNotes(lines) {
  const src = Array.isArray(lines) ? lines.map(x => String(x ?? "").trim()).filter(Boolean) : [];
  const notes = [];
  let cur = null;
  const flush = () => { if (cur) notes.push(cur); cur = null; };

  for (const t of src) {
    const m = t.match(/^(ASTUCE|PI[EÈ]GE|PRONONCIATION|NOTE)\s*:\s*(.+)$/i);
    if (m) {
      flush();
      cur = { kind: m[1].toUpperCase(), text: m[2] };
      continue;
    }
    if (!cur) cur = { kind: "NOTE", text: t };
    else cur.text += " " + t;
  }
  flush();

  const kindToDot = (k) => {
    if (k === "ASTUCE") return ["dot-amber", "Astuce"];
    if (k.startsWith("PI")) return ["dot-rose", "Piège"];
    if (k === "PRONONCIATION") return ["dot-emerald", "Prononciation"];
    return ["dot-blue", "Note"];
  };

  const cards = notes.map(n => {
    const [dotCls, label] = kindToDot(n.kind);
    return `
      <div class="prof-note">
        <div class="tag"><span class="dot ${dotCls}"></span>${this.esc(label)}</div>
        <p>${this.esc(n.text)}</p>
      </div>
    `;
  }).join("");

  return `<div class="prof-grid-2">${cards}</div>`;
},

  viewLesson(params) {
    const levelKey = params?.level;
    const lessonId = params?.lesson;

    const L = this.levels[levelKey];
    if (!L) {
      this.setView(`
        <div class="card error">
          <h2>Niveau introuvable</h2>
          <p class="muted">Le niveau demandé n'existe pas ou n'est pas chargé.</p>
          <button class="btn" id="homeBtn">Accueil</button>
        </div>
      `);
      document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));
      return;
    }

    // Find lesson + module title
    let lesson = null;
    let moduleTitle = "";
    for (const m of (L.modules || [])) {
      const found = (m.lessons || []).find(ls => String(ls.id) === String(lessonId));
      if (found) {
        lesson = found;
        moduleTitle = m.title || "";
        break;
      }
    }

    if (!lesson) {
      this.setView(`
        <div class="card error">
          <h2>Leçon introuvable</h2>
          <p class="muted">Impossible de trouver cette leçon dans ${this.esc(levelKey)}.</p>
          <button class="btn" id="backBtn">← Retour</button>
        </div>
      `);
      document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/level"));
      return;
    }

    const key = `${levelKey}:${lesson.id}`;
    const done = AppStorage.isDone(key);

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
              <button class="btn primary" id="doneBtn">${done ? "✅ Terminé" : "Marquer terminé"}</button>
            </div>
          </div>
        </div>

        ${(() => {
          const sections = this.parseLessonSections(lesson.content);

          // 1) Dialogue décomposition (pill cards) si possible
          let out = "";
          if (sections.dialogue && sections.dialogue.length) {
            const items = this.extractDialogueItems(sections.dialogue);
            if (items && items.length) {
              out += `
                <div class="card">
                  <div class="row" style="align-items:baseline; gap:12px; margin-bottom:10px;">
                    <span class="section-pill">Dialogue</span>
                    <h2 class="lesson-h2">Décomposition</h2>
                  </div>
                  ${this.renderDialogueDecomposition(items)}
                </div>
              `;
            }
          }

          // 2) Production guidée
          if (sections.production && sections.production.length) {
            out += `
              <div class="card">
                ${this.renderProductionBlock(sections.production)}
              </div>
            `;
          }

          // 3) Prof
          if (sections.prof && sections.prof.length) {
            out += `
              <div class="card">
                <div class="row" style="align-items:baseline; gap:12px; margin-bottom:10px;">
                  <span class="section-pill section-pill-prof">Prof</span>
                  <h2 class="lesson-h2">Explication du Prof</h2>
                </div>
                ${this.renderProfNotes(sections.prof)}
              </div>
            `;
          }

          // Fallback si rien n'a été reconnu
          if (!out) out = this.renderContent(lesson.content);

          return out;
        })()}

        ${this.renderExamples(lesson.examples)}
        ${this.renderVocab(lesson.vocab)}
        ${this.renderMiniDrills(lesson.mini_drills)}
        ${this.renderQuiz(lesson.quiz)}

        <div class="card">
          <div class="lesson-cta-row">
            <button class="btn ghost" id="skipPartBtn">Passer cette partie</button>
            <button class="btn next" id="nextStepBtn">Étape suivante : Exercice pratique →</button>
          </div>
        </div>

      </div>
    `);

    document.getElementById("backBtn")?.addEventListener("click", () => Router.back("/level"));
    document.getElementById("homeBtn")?.addEventListener("click", () => Router.go("/"));

    document.getElementById("doneBtn")?.addEventListener("click", () => {
      AppStorage.markDone(key);
      Router.go("/level", { level: levelKey });
    });

    document.getElementById("skipPartBtn")?.addEventListener("click", () => {
      const target =
        document.querySelector(".quiz") ||
        document.querySelector("[data-quiz]") ||
        document.querySelector(".vocab") ||
        document.querySelector("table");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("nextStepBtn")?.addEventListener("click", () => {
      const target = document.querySelector(".quiz") || document.querySelector("[data-quiz]");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else alert("✅ Passe à la section suivante (exercices) dès qu'elle est disponible.");
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

  // --- 0) explode "compact" lines (LESSON 1 case) into logical lines ---
  const explodeCompactLine = (s) => {
    if (!s) return [];
    let t = String(s);

    // Force breaks before common section markers if they appear inline
    // (adds structure even if JSON is a single big paragraph)
    t = t.replace(/\s*(SITUATION\s*[—-]\s*)/gi, "\n$1");
    t = t.replace(/\s*(DIALOGUE\b)/gi, "\n$1");
    t = t.replace(/\s*(DÉCOMPOSITION\b|DECOMPOSITION\b)/gi, "\nDÉCOMPOSITION");
    t = t.replace(/\s*(EXPLICATION DU PROF\b)/gi, "\nEXPLICATION DU PROF");
    t = t.replace(/\s*(PRONONCIATION UTILE\b)/gi, "\nPRONONCIATION UTILE");
    t = t.replace(/\s*(STRUCTURES CLÉS\b|STRUCTURES CLES\b)/gi, "\nSTRUCTURES CLÉS");
    t = t.replace(/\s*(ORDRE DES MOTS\b)/gi, "\nORDRE DES MOTS");

    // Force breaks for dialogue markers found inline
    t = t.replace(/\s+([A-ZÅÄÖ])\s*:\s*/g, "\n$1: "); // " A: " / " B: "
    t = t.replace(/\s*→\s*/g, "\n→ ");               // FR line
    t = t.replace(/\s*🔊\s*/g, "\n🔊 ");             // Pron line

    // Cleanup extra newlines
    return t
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean);
  };

  // Build raw lines + auto explode
  const raw = (lines || [])
    .flatMap(x => explodeCompactLine(String(x ?? "").trim()))
    .map(x => String(x ?? "").trim())
    .filter(Boolean)
    .filter(x => !/^[=\-_*]{6,}$/.test(x))
    .filter(x => !/^(👩‍🏫|🧑‍🏫)$/.test(x.trim()));

  if (!raw.length) return "";

  const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  // --- détecte une section pédagogique même si elle est collée à une phrase ---
const isInlineSection = (line) => {
  const n = norm(line);
  return (
    n.includes("decomposition") ||
    n.includes("explication du prof") ||
    n.includes("prononciation utile") ||
    n.includes("structures cles") ||
    n.includes("structures clés") ||
    n.includes("ordre des mots") ||
    n.includes("vocabulaire") ||
    n.includes("question") ||
    n.includes("quiz")
  );
};

  const isHeading = (s) => {
    const t = s.trim();
    if (t.endsWith(":")) return true;
    const letters = t.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
    const upperRatio = letters ? (letters.replace(/[^A-ZÀ-ÖØ-Þ]/g, "").length / letters.length) : 0;
    return (t.length <= 44 && upperRatio >= 0.75);
  };

  const isListItem = (s) => /^[-•]\s+/.test(s);

  const isCallout = (s) => {
  const low = norm(s);
  return (
    low.startsWith("astuce") ||
    low.startsWith("note") ||
    low.startsWith("attention") ||
    low.startsWith("a retenir") ||
    low.includes("a retenir") ||
    s.includes("=>") ||
    /^\s*[👉⚠️✅❗💡]/.test(s.trim())
  );
};

  const isObjective = (s) => norm(s).startsWith("objectif");

  // --- Dialogue parsing (STANDARD GLOBAL) ---
  // Regroupe A/B + pron + FR(→) dans UNE bulle
  const parseDialogueLines = (lines) => {
    const turns = [];
    const speakerRe = /^([A-ZÅÄÖ])\s*:\s*(.+)$/;     // "A: ..."
    const onlyPronRe = /^\(([^)]+)\)\s*$/;          // "(pron ...)"
    const arrowFrRe = /^→\s*(.+)$/;                 // "→ FR ..."
    const speakerInlineRe = /(^|\s)([A-ZÅÄÖ])\s*:\s*/g; // safety

    const cleanFr = (s) => s.replace(/^→\s*/, "").replace(/^🇫🇷\s*/i, "").trim();
    const cleanSv = (s) => s.replace(/^🇸🇪\s*/i, "").trim();

    let cur = null;

    const pushCur = () => {
      if (!cur) return;
      cur.sv = cleanSv(cur.sv || "");
      cur.fr = cleanFr(cur.fr || "");
      cur.pron = (cur.pron || "").trim();
      if (cur.sv) turns.push(cur);
      cur = null;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = String(lines[i] ?? "").trim();
      if (!line) continue;

      // Safety: if a line still contains inline "A: ... B: ...", split it
      if (speakerInlineRe.test(line) && !speakerRe.test(line)) {
        const tmp = line.replace(/\s+([A-ZÅÄÖ])\s*:\s*/g, "\n$1: ").split("\n").map(x=>x.trim()).filter(Boolean);
        tmp.forEach(part => lines.splice(i + 1, 0, part));
        continue;
      }

      const sp = line.match(speakerRe);
      if (sp) {
        pushCur();
        cur = { speaker: sp[1], sv: sp[2].trim(), fr: "", pron: "" };

        // If pron is inline at end: "(...)"
        const pronInline = cur.sv.match(/\(([^)]+)\)\s*$/);
        if (pronInline) {
          cur.pron = pronInline[1].trim();
          cur.sv = cur.sv.replace(/\(([^)]+)\)\s*$/, "").trim();
        }
        continue;
      }

      if (!cur) continue;

      // Pron line format: "🔊 ..."
      if (line.startsWith("🔊")) {
        const p = line.replace(/^🔊\s*/, "").trim();
        if (!cur.pron) cur.pron = p;
        else cur.pron += " • " + p;
        continue;
      }

      // Pron line format: "(...)"
      const pr = line.match(onlyPronRe);
      if (pr) {
        if (!cur.pron) cur.pron = pr[1].trim();
        else cur.pron += " • " + pr[1].trim();
        continue;
      }

      // FR translation: "→ ..."
      const fr = line.match(arrowFrRe);
      if (fr) {
        const piece = cleanFr(fr[1]);
        cur.fr = cur.fr ? (cur.fr + " " + piece) : piece;
        continue;
      }

      // Optional: FR line starting with 🇫🇷
      if (/^🇫🇷\s*/i.test(line)) {
        const piece = cleanFr(line);
        cur.fr = cur.fr ? (cur.fr + " " + piece) : piece;
        continue;
      }

      // Otherwise: continue SV
      cur.sv = (cur.sv ? (cur.sv + " " + line) : line).trim();
    }

    pushCur();
    return turns;
  };

  const splitBreakdown = (s) => {
    const idx = s.indexOf("=");
    if (idx === -1) return null;
    const left = s.slice(0, idx).trim();
    const right = s.slice(idx + 1).trim();
    if (!left || !right) return null;
    return { left, right };
  };

  const blocks = [];
  let paragraph = [];
  let list = [];
  let mode = "normal";
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
    const turns = parseDialogueLines(dialogueLines);
    if (turns.length) blocks.push({ type: "dialogue", turns });
    dialogueLines = [];
  };

  for (const line of raw) {
    const n = norm(line);

    if (isHeading(line)) {
      flushList(); flushParagraph(); flushDialogue(); flushBreakdown();
      blocks.push({ type: "h", text: line.replace(/:$/, "") });

      if (n.includes("dialogue")) mode = "dialogue";
      else if (n.includes("decomposition")) mode = "breakdown";
      else mode = "normal";
      continue;
    }

  if (mode === "dialogue") {

  // 🚨 Si une section pédagogique apparaît inline → on coupe le dialogue
  if (isInlineSection(line)) {
    flushDialogue();
    mode = "normal";

    blocks.push({
      type: "h",
      text: line.replace(/:$/, "")
    });

    if (norm(line).includes("decomposition")) mode = "breakdown";
    continue;
  }

  dialogueLines.push(line);
  continue;
}

    if (mode === "breakdown") {
      const row = splitBreakdown(line);
      if (row) breakdownRows.push(row);
      else { flushBreakdown(); paragraph.push(line); }
      continue;
    }

    if (isObjective(line)) {
      flushList(); flushParagraph();
      blocks.push({ type: "lead", text: line });
      continue;
    }

    if (isListItem(line)) {
      flushParagraph();
      list.push(line.replace(/^[-•]\s+/, ""));
      continue;
    }

    if (isCallout(line)) {
  flushList(); flushParagraph();

  let cleaned = line.trim();

  // retire préfixes texte + emojis
  cleaned = cleaned
    .replace(/^\s*(Astuce|Note|À retenir|A retenir|Attention)\s*[:\-]\s*/i, "")
    .replace(/^\s*[👉💡✅❗]\s*/g, "")
    .trim();

  const label = (/^\s*attention/i.test(norm(line)) || /^\s*⚠️/.test(line.trim()))
    ? "Attention"
    : "À retenir";

  // améliore la lisibilité: coupe les gros blocs “Structure : … Exemple : …”
  cleaned = cleaned
    .replace(/\s*(Structure\s*:\s*)/gi, "\n$1")
    .replace(/\s*(Exemples?\s*:\s*)/gi, "\n$1")
    .replace(/\s*(PRONONCIATION UTILE\s*\(.*?\)\s*)/gi, "\n$1")
    .replace(/\s*(STRUCTURES CL[ÉE]S\s*\(.*?\)\s*)/gi, "\n$1")
    .replace(/\s{2,}/g, " ")
    .trim();

  blocks.push({ type: "callout", label, text: cleaned });
  continue;
}

    flushList();
    paragraph.push(line);
  }

  flushList(); flushParagraph(); flushDialogue(); flushBreakdown();

  const renderBlocks = blocks.map(b => {
    if (b.type === "h") {
  const t = String(b.text || "");
  const n = (t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim());
  const prefix = n.includes("explication du prof") ? "👩‍🏫 " : "";
  return `<h3><span class="hl">${this.esc(prefix + t)}</span></h3>`;
}

    if (b.type === "lead") {
      const t = b.text.replace(/^\s*Objectif\s*:\s*/i, "").trim();
      return `<div class="lead"><div class="k">Objectif</div><p>${this.esc(t)}</p></div>`;
    }

    if (b.type === "ul") {
      return `<div class="sheet"><ul>${b.items.map(it => `<li>${this.esc(it)}</li>`).join("")}</ul></div>`;
    }

    if (b.type === "callout") {
  const html = this.esc(b.text || "").replace(/\n/g, "<br>");
  return `<div class="callout"><div class="label">${this.esc(b.label || "À retenir")}</div><p>${html}</p></div>`;
}

    if (b.type === "dialogue") {
      const bubbles = b.turns.map(t => {
        const speaker = (t.speaker || "").trim();
        const cls = (speaker === "B") ? "b" : "a";

        return `
          <div class="bubble ${cls}">
            <div class="meta">
              <span class="tag">${this.esc(speaker || "•")}</span>
              <span>${this.esc(speaker ? `Locuteur ${speaker}` : "Dialogue")}</span>
            </div>

            <div class="sv">${this.esc(t.sv || "")}</div>

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
