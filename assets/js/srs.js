// assets/js/srs.js - VERSION CORRIGÉE

const SRS = {
  /**
   * ✅ Construit des flashcards depuis tous les niveaux
   * Extrait : vocab, examples, ET quiz
   * @param {Object} levels - { A1: {...}, A2: {...}, B1: {...}, B2: {...} }
   * @returns {Array} Liste de cartes {id, front, back, level, type}
   */
  buildCardsFromLevels(levels) {
    if (!levels || typeof levels !== 'object') {
      console.warn('[SRS] Aucun niveau fourni');
      return [];
    }

    const cards = [];
    const seen = new Set();

    const addCard = (id, front, back, level, type = 'vocab') => {
      if (!id || !front || !back || seen.has(id)) return;
      
      seen.add(id);
      cards.push({
        id,
        front: front.trim(),
        back: back.trim(),
        level,
        type
      });
    };

    // ✅ Parcourir tous les niveaux
    for (const lvl of Object.keys(levels)) {
      const L = levels[lvl];
      if (!L || !L.modules) continue;

      // Extraire toutes les leçons de tous les modules
      const lessons = (L.modules || []).flatMap(m => m.lessons || []);

      for (const les of lessons) {
        if (!les.id) continue;

        // 1) ✅ VOCABULAIRE : sv → fr (avec pron si disponible)
        for (const w of (les.vocab || [])) {
          const sv = (w.sv || "").trim();
          const fr = (w.fr || "").trim();
          const pron = (w.pron || "").trim();

          if (sv && fr) {
            const front = pron ? `${sv}\n${pron}` : sv;
            addCard(
              `${lvl}:${les.id}:vocab:${sv}`,
              front,
              fr,
              lvl,
              'vocab'
            );
          }
        }

        // 2) ✅ EXEMPLES : phrase sv → phrase fr
        for (const e of (les.examples || [])) {
          const sv = (e.sv || "").trim();
          const fr = (e.fr || "").trim();
          const pron = (e.pron || "").trim();

          if (sv && fr) {
            // Limiter l'ID pour éviter clés trop longues
            const shortSv = sv.slice(0, 80).replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, '_');
            const front = pron ? `${sv}\n${pron}` : sv;
            
            addCard(
              `${lvl}:${les.id}:ex:${shortSv}`,
              front,
              fr,
              lvl,
              'example'
            );
          }
        }

        // 3) ✅ QUIZ : questions → réponses (NOUVEAU)
        if (les.quiz && Array.isArray(les.quiz)) {
          for (let i = 0; i < les.quiz.length; i++) {
            const q = les.quiz[i];
            
            if (q.type === 'mcq' && q.q && q.choices && q.answerIndex != null) {
              const question = q.q.trim();
              const answer = q.choices[q.answerIndex]?.trim();
              
              if (question && answer) {
                addCard(
                  `${lvl}:${les.id}:quiz:mcq:${i}`,
                  question,
                  answer,
                  lvl,
                  'quiz'
                );
              }
            } else if (q.type === 'gap' && q.q && q.answer) {
              const question = q.q.trim();
              const answer = q.answer.trim();
              
              if (question && answer) {
                addCard(
                  `${lvl}:${les.id}:quiz:gap:${i}`,
                  question,
                  answer,
                  lvl,
                  'quiz'
                );
              }
            }
          }
        }
      }
    }

    console.log(`[SRS] ${cards.length} cartes générées depuis ${Object.keys(levels).length} niveaux`);
    
    // ✅ Afficher statistiques par type
    const byType = {};
    for (const c of cards) {
      byType[c.type] = (byType[c.type] || 0) + 1;
    }
    console.log('[SRS] Répartition:', byType);
    
    return cards;
  },

  /**
   * ✅ Filtre les cartes par niveau
   * @param {Array} cards - Liste de cartes
   * @param {String} level - Niveau (A1, A2, B1, B2, etc.)
   * @returns {Array} Cartes filtrées
   */
  filterByLevel(cards, level) {
    if (!Array.isArray(cards)) return [];
    if (!level) return cards;
    
    return cards.filter(c => c.level === level);
  },

  /**
   * ✅ Filtre les cartes par type
   * @param {Array} cards - Liste de cartes
   * @param {String} type - Type (vocab, example, quiz)
   * @returns {Array} Cartes filtrées
   */
  filterByType(cards, type) {
    if (!Array.isArray(cards)) return [];
    if (!type) return cards;
    
    return cards.filter(c => c.type === type);
  },

  /**
   * ✅ Mélange aléatoirement un tableau (Fisher-Yates)
   * @param {Array} array - Tableau à mélanger
   * @returns {Array} Tableau mélangé
   */
  shuffle(array) {
    if (!Array.isArray(array)) return [];
    
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * ✅ Sélectionne N cartes aléatoires
   * @param {Array} cards - Liste de cartes
   * @param {Number} count - Nombre de cartes à sélectionner
   * @returns {Array} Cartes sélectionnées
   */
  pickRandom(cards, count) {
    if (!Array.isArray(cards) || cards.length === 0) return [];
    
    const shuffled = this.shuffle(cards);
    return shuffled.slice(0, count);
  },

  /**
   * ✅ Statistiques détaillées sur les cartes
   * @param {Array} cards - Liste de cartes
   * @returns {Object} Stats par niveau et type
   */
  getStats(cards) {
    if (!Array.isArray(cards)) return {};

    const stats = {
      total: cards.length,
      byLevel: {},
      byType: {}
    };

    for (const card of cards) {
      // Par niveau
      if (card.level) {
        stats.byLevel[card.level] = (stats.byLevel[card.level] || 0) + 1;
      }
      
      // Par type
      if (card.type) {
        stats.byType[card.type] = (stats.byType[card.type] || 0) + 1;
      }
    }

    return stats;
  },

  /**
   * ✅ Trouve les cartes d'une leçon spécifique
   * @param {Array} cards - Liste de cartes
   * @param {String} level - Niveau (A1, A2, etc.)
   * @param {String} lessonId - ID de la leçon
   * @returns {Array} Cartes de cette leçon
   */
  getCardsForLesson(cards, level, lessonId) {
    if (!Array.isArray(cards)) return [];
    
    const prefix = `${level}:${lessonId}:`;
    return cards.filter(c => c.id && c.id.startsWith(prefix));
  }
};
