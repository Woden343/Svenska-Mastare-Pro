// assets/js/storage.js - VERSION CORRIGÉE

const Storage = {
  key: "svenska_progress_v2",

  _default() {
    return {
      done: {},                     // { "A1:lesson1": true }
      stats: { 
        correct: 0, 
        wrong: 0,
        streak: 0,                  // ✅ Ajouté
        lastStudyDate: null         // ✅ Ajouté
      },
      srs: {
        cards: {},                  // { cardId: { nextDue, intervalDays, ease, reps, ... } }
        dailyLimit: 30,
        learnedToday: 0,
        reviewedToday: 0,           // ✅ Ajouté
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

      // ✅ Merge avec validation complète
      const merged = {
        done: parsed.done || base.done,
        stats: {
          correct: parsed.stats?.correct ?? base.stats.correct,
          wrong: parsed.stats?.wrong ?? base.stats.wrong,
          streak: parsed.stats?.streak ?? base.stats.streak,
          lastStudyDate: parsed.stats?.lastStudyDate ?? base.stats.lastStudyDate
        },
        srs: {
          cards: parsed.srs?.cards || base.srs.cards,
          dailyLimit: parsed.srs?.dailyLimit ?? base.srs.dailyLimit,
          learnedToday: parsed.srs?.learnedToday ?? base.srs.learnedToday,
          reviewedToday: parsed.srs?.reviewedToday ?? base.srs.reviewedToday,
          dayStamp: parsed.srs?.dayStamp || base.srs.dayStamp
        }
      };

      // ✅ Reset compteurs journaliers si nouveau jour
      if (merged.srs.dayStamp !== this._todayStamp()) {
        merged.srs.dayStamp = this._todayStamp();
        merged.srs.learnedToday = 0;
        merged.srs.reviewedToday = 0;
      }

      return merged;
    } catch (e) {
      console.error("[Storage] Erreur de chargement:", e);
      return this._default();
    }
  },

  save(state) {
    try {
      localStorage.setItem(this.key, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error("[Storage] Erreur de sauvegarde:", e);
      return false;
    }
  },

  // ✅ Calcul du streak
  _updateStreak(state) {
    const today = this._todayStamp();
    const last = state.stats.lastStudyDate;
    
    if (!last) {
      state.stats.streak = 1;
      state.stats.lastStudyDate = today;
      return;
    }

    if (last === today) {
      // Déjà étudié aujourd'hui
      return;
    }

    // Calculer différence de jours
    const lastDate = new Date(last);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Jour consécutif → augmenter streak
      state.stats.streak++;
    } else if (diffDays > 1) {
      // Série cassée → recommencer à 1
      state.stats.streak = 1;
    }

    state.stats.lastStudyDate = today;
  },

  markDone(lessonKey) {
    const s = this.load();
    s.done[lessonKey] = true;
    this._updateStreak(s);  // ✅ Mise à jour streak
    this.save(s);
  },

  addResult(isCorrect) {
    const s = this.load();
    if (isCorrect) {
      s.stats.correct++;
    } else {
      s.stats.wrong++;
    }
    this._updateStreak(s);  // ✅ Mise à jour streak
    this.save(s);
  },

  // ==================== SRS ====================

  upsertCards(newCards) {
    if (!Array.isArray(newCards) || newCards.length === 0) return;
    
    const s = this.load();
    const cards = s.srs.cards || {};

    for (const c of newCards) {
      if (!c || !c.id) continue;
      
      if (!cards[c.id]) {
        // ✅ Nouvelle carte
        cards[c.id] = {
          id: c.id,
          front: c.front || "",
          back: c.back || "",
          level: c.level || "",
          type: c.type || "vocab",  // ✅ Ajouté type
          nextDue: Date.now(),      // Due immédiatement
          intervalDays: 0,
          ease: 2.5,                // Facteur d'aisance par défaut
          reps: 0,                  // Nombre de répétitions
          lapses: 0,                // Nombre d'oublis
          created: Date.now()
        };
      } else {
        // ✅ Mise à jour contenu (préserve scheduling)
        cards[c.id].front = c.front || cards[c.id].front;
        cards[c.id].back = c.back || cards[c.id].back;
        cards[c.id].level = c.level || cards[c.id].level;
        cards[c.id].type = c.type || cards[c.id].type;
      }
    }

    s.srs.cards = cards;
    this.save(s);
  },

  getDueCards(limit = 30) {
    const s = this.load();
    const now = Date.now();
    const cards = Object.values(s.srs.cards || {});
    
    // ✅ Filtrer cartes dues
    const due = cards.filter(c => (c.nextDue || 0) <= now);
    
    // ✅ Trier par ancienneté (plus vieilles d'abord)
    due.sort((a, b) => (a.nextDue || 0) - (b.nextDue || 0));
    
    return due.slice(0, limit);
  },

  gradeCard(cardId, grade) {
    // grade: 0=Again (oublié), 1=Hard (difficile), 2=Good (bon), 3=Easy (facile)
    const s = this.load();
    const c = s.srs.cards?.[cardId];
    if (!c) return;

    const now = Date.now();

    // ✅ Ajuster ease factor selon grade
    if (grade === 0) {
      c.ease = Math.max(1.3, c.ease - 0.2);  // Diminuer si oublié
      c.lapses = (c.lapses || 0) + 1;
    } else if (grade === 1) {
      c.ease = Math.max(1.3, c.ease - 0.05); // Diminuer légèrement
    } else if (grade === 2) {
      c.ease = Math.min(3.0, c.ease + 0.02); // Augmenter légèrement
    } else if (grade === 3) {
      c.ease = Math.min(3.0, c.ease + 0.1);  // Augmenter plus
    }

    // ✅ Calculer nouvel intervalle
    if (grade === 0) {
      // Oublié → retour au début
      c.intervalDays = 0;
      c.reps = 0;
      c.nextDue = now + 10 * 60 * 1000; // Revoir dans 10 minutes
    } else {
      // Progression normale
      c.reps = (c.reps || 0) + 1;
      
      if (c.reps === 1) {
        // Première fois
        c.intervalDays = (grade === 1) ? 1 : (grade === 2) ? 2 : 4;
      } else if (c.reps === 2) {
        // Deuxième fois
        c.intervalDays = (grade === 1) ? 3 : (grade === 2) ? 6 : 10;
      } else {
        // ✅ Répétitions suivantes → algorithme SM-2 modifié
        const multiplier = (grade === 1) ? 1.2 : (grade === 2) ? c.ease : c.ease * 1.3;
        c.intervalDays = Math.round(c.intervalDays * multiplier);
      }

      // Limites de sécurité
      c.intervalDays = Math.min(365, Math.max(1, c.intervalDays));
      c.nextDue = now + c.intervalDays * 24 * 60 * 60 * 1000;
    }

    // ✅ Mettre à jour compteur journalier
    if (c.reps === 1) {
      s.srs.learnedToday = (s.srs.learnedToday || 0) + 1;
    } else {
      s.srs.reviewedToday = (s.srs.reviewedToday || 0) + 1;
    }

    s.srs.cards[cardId] = c;
    this.save(s);
  },

  getSrsStats() {
    const s = this.load();
    const cards = Object.values(s.srs.cards || {});
    const now = Date.now();
    
    const due = cards.filter(c => (c.nextDue || 0) <= now).length;
    const newCards = cards.filter(c => (c.reps || 0) === 0).length;
    
    // ✅ Cartes en apprentissage (< 21 jours d'intervalle)
    const learning = cards.filter(c => {
      const reps = c.reps || 0;
      const interval = c.intervalDays || 0;
      return reps > 0 && interval < 21;
    }).length;
    
    // ✅ Cartes matures (>= 21 jours)
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
