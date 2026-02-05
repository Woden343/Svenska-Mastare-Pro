// assets/js/srs.js
const SRS = {
  buildCardsFromLevels(levels) {
    const cards = [];
    const seen = new Set();

    const add = (id, front, back, level) => {
      if (!id || seen.has(id)) return;
      seen.add(id);
      cards.push({ id, front, back, level });
    };

    for (const lvl of Object.keys(levels || {})) {
      const L = levels[lvl];
      if (!L) continue;

      const lessons = (L.modules || []).flatMap(m => (m.lessons || []));
      for (const les of lessons) {
        // vocab cards (sv -> fr + pron)
        for (const w of (les.vocab || [])) {
          const sv = (w.sv || "").trim();
          const fr = (w.fr || "").trim();
          const pron = (w.pron || "").trim();
          if (sv && fr) {
            add(
              `${lvl}:${les.id}:vocab:${sv}`,
              `${sv}${pron ? `\n(${pron})` : ""}`,
              fr,
              lvl
            );
          }
        }

        // example cards (sv sentence -> fr)
        for (const e of (les.examples || [])) {
          const sv = (e.sv || "").trim();
          const fr = (e.fr || "").trim();
          const pron = (e.pron || "").trim();
          if (sv && fr) {
            add(
              `${lvl}:${les.id}:ex:${sv.slice(0, 60)}`,
              `${sv}${pron ? `\n(${pron})` : ""}`,
              fr,
              lvl
            );
          }
        }
      }
    }

    return cards;
  }
};