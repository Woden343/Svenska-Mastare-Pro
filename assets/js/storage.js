// assets/js/storage.js

const Storage = {
  key: "svenska_app_v3",

  defaultState() {
    return {
      done: {}, // { "A1:lessonId": true }
      stats: { correct: 0, wrong: 0 },

      srs: {
        settings: { dailyLimit: 10 },
        cards: {},      // { id: {...} }
        lastBuildAt: 0
      }
    };
  },

  load() {
    try {
      const s = JSON.parse(localStorage.getItem(this.key));
      if (!s) return this.defaultState();

      // safety
      if (!s.done) s.done = {};
      if (!s.stats) s.stats = { correct: 0, wrong: 0 };
      if (!s.srs) s.srs = { settings: { dailyLimit: 10 }, cards: {}, lastBuildAt: 0 };
      if (!s.srs.settings) s.srs.settings = { dailyLimit: 10 };
      if (!s.srs.cards) s.srs.cards = {};
      if (typeof s.srs.settings.dailyLimit !== "number") s.srs.settings.dailyLimit = 10;

      return s;
    } catch {
      return this.defaultState();
    }
  },

  save(state) {
    localStorage.setItem(this.key, JSON.stringify(state));
  },

  markDone(lessonKey) {
    const s = this.load();
    s.done[lessonKey] = true;
    this.save(s);
  },

  addResult(ok) {
    const s = this.load();
    if (ok) s.stats.correct++;
    else s.stats.wrong++;
    this.save(s);
  },

  // -------- SRS ----------
  upsertCards(cards) {
    const s = this.load();
    const now = Date.now();

    for (const c of cards) {
      if (!c || !c.id) continue;
      const ex = s.srs.cards[c.id];
      if (ex) {
        // update content fields, keep learning state
        ex.front = c.front;
        ex.back = c.back;
        ex.level = c.level;
        ex.moduleId = c.moduleId;
        ex.lessonId = c.lessonId;
        ex.type = c.type;
      } else {
        s.srs.cards[c.id] = {
          ...c,
          dueAt: now,
          intervalDays: 0,
          ease: 2.3,
          reps: 0,
          lapses: 0,
          lastResult: null
        };
      }
    }

    s.srs.lastBuildAt = now;
    this.save(s);
  },

  setDailyLimit(n) {
    const s = this.load();
    const val = Number(n);
    s.srs.settings.dailyLimit = Math.max(5, Math.min(50, isFinite(val) ? val : 10));
    this.save(s);
  },

  getSrsStats() {
    const s = this.load();
    const now = Date.now();
    const all = Object.values(s.srs.cards);

    return {
      total: all.length,
      due: all.filter(c => c.dueAt <= now).length,
      dailyLimit: s.srs.settings.dailyLimit
    };
  },

  getDueCards({ level = "ALL", limit = null } = {}) {
    const s = this.load();
    const now = Date.now();
    const L = limit ?? s.srs.settings.dailyLimit ?? 10;

    const due = Object.values(s.srs.cards)
      .filter(c => c.dueAt <= now)
      .filter(c => (level === "ALL" ? true : c.level === level))
      .sort((a, b) => (a.dueAt - b.dueAt) || (a.reps - b.reps));

    return due.slice(0, L);
  },

  gradeCard(cardId, grade) {
    const s = this.load();
    const c = s.srs.cards[cardId];
    if (!c) return;

    const now = Date.now();
    const clamp = (e) => Math.max(1.3, Math.min(3.0, e));

    if (grade === "again") {
      c.lapses += 1;
      c.reps += 1;
      c.ease = clamp(c.ease - 0.2);
      c.intervalDays = 0;
      c.dueAt = now + 10 * 60 * 1000; // 10 min
      c.lastResult = "again";
      this.addResult(false);
    } else if (grade === "hard") {
      c.reps += 1;
      c.ease = clamp(c.ease - 0.05);
      c.intervalDays = c.intervalDays <= 0 ? 1 : Math.max(1, Math.round(c.intervalDays * 1.2));
      c.dueAt = now + c.intervalDays * 86400000;
      c.lastResult = "hard";
      this.addResult(true);
    } else if (grade === "good") {
      c.reps += 1;
      c.ease = clamp(c.ease + 0.02);
      c.intervalDays = c.intervalDays <= 0 ? 1 : Math.max(1, Math.round(c.intervalDays * c.ease));
      c.dueAt = now + c.intervalDays * 86400000;
      c.lastResult = "good";
      this.addResult(true);
    } else if (grade === "easy") {
      c.reps += 1;
      c.ease = clamp(c.ease + 0.15);
      c.intervalDays = c.intervalDays <= 0 ? 2 : Math.max(2, Math.round(c.intervalDays * (c.ease + 0.3)));
      c.dueAt = now + c.intervalDays * 86400000;
      c.lastResult = "easy";
      this.addResult(true);
    }

    this.save(s);
  }
};