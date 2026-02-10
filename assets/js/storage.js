// assets/js/storage.js - VERSION COMPLÈTE (CORRIGÉE: AppStorage)

window.AppStorage = {
  key: "svenska_progress_v2",

  _default() {
    return {
      done: {},
      stats: {
        correct: 0,
        wrong: 0,
        streak: 0,
        lastStudyDate: null
      },
      srs: {
        cards: {},
        dailyLimit: 30,
        learnedToday: 0,
        reviewedToday: 0,
        dayStamp: this._todayStamp()
      }
    };
  },

  _todayStamp() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      const base = this._default();

      if (!raw) return base;

      const parsed = JSON.parse(raw);

      const merged = {
        done: (parsed && parsed.done) ? parsed.done : base.done,
        stats: {
          correct: parsed && parsed.stats && typeof parsed.stats.correct === "number" ? parsed.stats.correct : base.stats.correct,
          wrong: parsed && parsed.stats && typeof parsed.stats.wrong === "number" ? parsed.stats.wrong : base.stats.wrong,
          streak: parsed && parsed.stats && typeof parsed.stats.streak === "number" ? parsed.stats.streak : base.stats.streak,
          lastStudyDate: parsed && parsed.stats && parsed.stats.lastStudyDate ? parsed.stats.lastStudyDate : base.stats.lastStudyDate
        },
        srs: {
          cards: parsed && parsed.srs && parsed.srs.cards ? parsed.srs.cards : base.srs.cards,
          dailyLimit: parsed && parsed.srs && typeof parsed.srs.dailyLimit === "number" ? parsed.srs.dailyLimit : base.srs.dailyLimit,
          learnedToday: parsed && parsed.srs && typeof parsed.srs.learnedToday === "number" ? parsed.srs.learnedToday : base.srs.learnedToday,
          reviewedToday: parsed && parsed.srs && typeof parsed.srs.reviewedToday === "number" ? parsed.srs.reviewedToday : base.srs.reviewedToday,
          dayStamp: parsed && parsed.srs && parsed.srs.dayStamp ? parsed.srs.dayStamp : base.srs.dayStamp
        }
      };

      // Reset compteur jour si changement de date
      if (merged.srs.dayStamp !== this._todayStamp()) {
        merged.srs.dayStamp = this._todayStamp();
        merged.srs.learnedToday = 0;
        merged.srs.reviewedToday = 0;
      }

      return merged;
    } catch (e) {
      console.error("[AppStorage] Erreur de chargement:", e);
      return this._default();
    }
  },

  save(state) {
    try {
      localStorage.setItem(this.key, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error("[AppStorage] Erreur de sauvegarde:", e);
      return false;
    }
  },

  _updateStreak(state) {
    const today = this._todayStamp();
    const last = state.stats.lastStudyDate;

    if (!last) {
      state.stats.streak = 1;
      state.stats.lastStudyDate = today;
      return;
    }

    if (last === today) return;

    const lastDate = new Date(last);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      state.stats.streak++;
    } else if (diffDays > 1) {
      state.stats.streak = 1;
    }

    state.stats.lastStudyDate = today;
  },

  markDone(lessonKey) {
    const s = this.load();
    s.done[lessonKey] = true;
    this._updateStreak(s);
    this.save(s);
  },

  isDone(lessonKey) {
    const s = this.load();
    return !!s.done[lessonKey];
  },

  addResult(isCorrect) {
    const s = this.load();
    if (isCorrect) s.stats.correct++;
    else s.stats.wrong++;
    this._updateStreak(s);
    this.save(s);
  },

  // ==================== SRS ====================

  upsertCards(newCards) {
    if (!Array.isArray(newCards) || newCards.length === 0) {
      console.log("[AppStorage] Aucune carte à insérer");
      return;
    }

    const s = this.load();
    const cards = s.srs.cards || {};

    for (const c of newCards) {
      if (!c || !c.id) continue;

      if (!cards[c.id]) {
        cards[c.id] = {
          id: c.id,
          front: c.front || "",
          back: c.back || "",
          level: c.level || "",
          type: c.type || "vocab",
          nextDue: Date.now(),
          intervalDays: 0,
          ease: 2.5,
          reps: 0,
          lapses: 0,
          created: Date.now()
        };
      } else {
        cards[c.id].front = c.front || cards[c.id].front;
        cards[c.id].back = c.back || cards[c.id].back;
        cards[c.id].level = c.level || cards[c.id].level;
        cards[c.id].type = c.type || cards[c.id].type;
      }
    }

    s.srs.cards = cards;
    this.save(s);
    console.log(`[AppStorage] ${Object.keys(cards).length} cartes SRS enregistrées`);
  },

  getDueCards(limit = 30) {
    const s = this.load();
    const now = Date.now();
    const cards = Object.values(s.srs.cards || {});

    const due = cards.filter(c => (c.nextDue || 0) <= now);
    due.sort((a, b) => (a.nextDue || 0) - (b.nextDue || 0));

    return due.slice(0, limit);
  },

  gradeCard(cardId, grade) {
    const s = this.load();
    const cardsMap = s.srs.cards || {};
    const c = cardsMap[cardId];
    if (!c) return;

    const now = Date.now();

    // Ajuste ease selon la note
    if (grade === 0) {
      c.ease = Math.max(1.3, c.ease - 0.2);
      c.lapses = (c.lapses || 0) + 1;
    } else if (grade === 1) {
      c.ease = Math.max(1.3, c.ease - 0.05);
    } else if (grade === 2) {
      c.ease = Math.min(3.0, c.ease + 0.02);
    } else if (grade === 3) {
      c.ease = Math.min(3.0, c.ease + 0.1);
    }

    // Planification
    if (grade === 0) {
      c.intervalDays = 0;
      c.reps = 0;
      c.nextDue = now + 10 * 60 * 1000; // 10 min
    } else {
      c.reps = (c.reps || 0) + 1;

      if (c.reps === 1) {
        c.intervalDays = (grade === 1) ? 1 : (grade === 2) ? 2 : 4;
      } else if (c.reps === 2) {
        c.intervalDays = (grade === 1) ? 3 : (grade === 2) ? 6 : 10;
      } else {
        const multiplier = (grade === 1) ? 1.2 : (grade === 2) ? c.ease : c.ease * 1.3;
        c.intervalDays = Math.round((c.intervalDays || 1) * multiplier);
      }

      c.intervalDays = Math.min(365, Math.max(1, c.intervalDays));
      c.nextDue = now + c.intervalDays * 24 * 60 * 60 * 1000;
    }

    // Compteurs du jour
    if (c.reps === 1) s.srs.learnedToday = (s.srs.learnedToday || 0) + 1;
    else s.srs.reviewedToday = (s.srs.reviewedToday || 0) + 1;

    cardsMap[cardId] = c;
    s.srs.cards = cardsMap;
    this.save(s);
  },

  getSrsStats() {
    const s = this.load();
    const cards = Object.values(s.srs.cards || {});
    const now = Date.now();

    const due = cards.filter(c => (c.nextDue || 0) <= now).length;
    const newCards = cards.filter(c => (c.reps || 0) === 0).length;
    const learning = cards.filter(c => {
      const reps = c.reps || 0;
      const interval = c.intervalDays || 0;
      return reps > 0 && interval < 21;
    }).length;
    const mature = cards.filter(c => (c.intervalDays || 0) >= 21).length;

    return {
      total: cards.length,
      due,
      newCards,
      learning,
      mature,
      dailyLimit: s.srs.dailyLimit || 30,
      learnedToday: s.srs.learnedToday || 0,
      reviewedToday: s.srs.reviewedToday || 0
    };
  },

  reset() {
    if (confirm("⚠️ Êtes-vous sûr de vouloir réinitialiser TOUTES vos données ?")) {
      localStorage.removeItem(this.key);
      location.reload();
    }
  }
};
