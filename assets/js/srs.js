// assets/js/srs.js - VERSION CORRIGÉE

const SRS = {
  /**
   * ✅ Construit des flashcards depuis tous les niveaux
   * Extrait : vocab, examples, ET quiz
   * @param {Object} levels - { A1: {...}, A2: {...}, B1: {...}, B2: {...} }
   * @returns {Array} Liste de cartes {id, front, back, level, type}
   */
  buildCardsFromLevels(levels) {
    if (!levels || typeof levels !== "object") {
      console.warn("[SRS] Aucun niveau fourni");
      return [];
    }

    const cards = [];
    const seen = new Set();

    const addCard = (id, front, back, level, type = "vocab") => {
      if (!id || !front || !back || seen.has(id)) return;

      seen.add(id);
      cards.push({
        id,
        front: String(front).trim(),
        back: String(back).trim(),
        level,
        type,
      });
    };

    for (const lvl of Object.keys(levels)) {
      const L = levels[lvl];
      if (!L || !L.modules) continue;

      const lessons = (L.modules || []).flatMap((m) => m.lessons || []);

      for (const les of lessons) {
        if (!les.id) continue;

        // 1) VOCAB : sv -> fr (+ pron optionnel)
        for (const w of les.vocab || []) {
          const sv = (w.sv || "").trim();
          const fr = (w.fr || "").trim();
          const pron = (w.pron || "").trim();

          if (sv && fr) {
            const front = pron ? `${sv}\n${pron}` : sv;
            addCard(`${lvl}:${les.id}:vocab:${sv}`, front, fr, lvl, "vocab");
          }
        }

        // 2) EXEMPLES : phrase sv -> phrase fr (+ pron optionnel)
        for (const e of les.examples || []) {
          const sv = (e.sv || "").trim();
          const fr = (e.fr || "").trim();
          const pron = (e.pron || "").trim();

          if (sv && fr) {
            const shortSv = sv.slice(0, 24).replace(/\s+/g, "_");
            const front = pron ? `${sv}\n${pron}` : sv;
            addCard(`${lvl}:${les.id}:ex:${shortSv}`, front, fr, lvl, "example");
          }
        }

        // 3) QUIZ : question -> answer
        for (const q of les.quiz || []) {
          const qq = (q.q || "").trim();
          const ans = (q.answer || "").trim();
          if (qq && ans) {
            const shortQ = qq.slice(0, 24).replace(/\s+/g, "_");
            addCard(`${lvl}:${les.id}:quiz:${shortQ}`, qq, ans, lvl, "quiz");
          }
        }
      }
    }

    console.log(`[SRS] ${cards.length} cartes générées depuis ${Object.keys(levels).length} niveaux`);
    return cards;
  },

  // Helpers éventuels (si tu les utilises ailleurs)
  shuffle(arr) {
    if (!Array.isArray(arr)) return [];
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  pickRandom(cards, count = 20) {
    if (!Array.isArray(cards) || cards.length === 0) return [];
    const shuffled = this.shuffle(cards);
    return shuffled.slice(0, count);
  },

  getStats(cards) {
    if (!Array.isArray(cards)) return {};
    const stats = { total: cards.length, byLevel: {}, byType: {} };

    for (const card of cards) {
      if (card.level) stats.byLevel[card.level] = (stats.byLevel[card.level] || 0) + 1;
      if (card.type) stats.byType[card.type] = (stats.byType[card.type] || 0) + 1;
    }
    return stats;
  },

  getCardsForLesson(cards, level, lessonId) {
    if (!Array.isArray(cards)) return [];
    const prefix = `${level}:${lessonId}:`;
    return cards.filter((c) => c.id && c.id.startsWith(prefix));
  },
};

// ✅ IMPORTANT : expose SRS au global (sinon window.SRS est undefined)
window.SRS = SRS;
