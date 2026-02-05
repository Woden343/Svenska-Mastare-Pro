// assets/js/srs.js

const SRS = {
  buildCardsFromLevels(levelsMap) {
    const out = [];
    const seen = new Set();

    const add = (c) => {
      if (!c?.id) return;
      if (seen.has(c.id)) return;
      seen.add(c.id);
      out.push(c);
    };

    const t = (x) => String(x || "").trim();

    for (const [levelKey, L] of Object.entries(levelsMap || {})) {
      const modules = Array.isArray(L.modules) ? L.modules : [];

      for (const m of modules) {
        const moduleId = t(m.id) || t(m.title) || "module";
        const lessons = Array.isArray(m.lessons) ? m.lessons : [];

        for (const les of lessons) {
          const lessonId = t(les.id) || t(les.title) || "lesson";

          // vocab -> 2 sens
          const vocab = Array.isArray(les.vocab) ? les.vocab : [];
          for (const w of vocab) {
            const sv = t(w.sv);
            const fr = t(w.fr);
            const pron = t(w.pron);

            if (sv && fr) {
              add({
                id: `v:${levelKey}:${moduleId}:${lessonId}:${sv}`,
                type: "VOCAB_SV_FR",
                level: levelKey,
                moduleId,
                lessonId,
                front: `${sv}${pron ? ` [${pron}]` : ""}`,
                back: fr
              });
              add({
                id: `v2:${levelKey}:${moduleId}:${lessonId}:${fr}=>${sv}`,
                type: "VOCAB_FR_SV",
                level: levelKey,
                moduleId,
                lessonId,
                front: fr,
                back: `${sv}${pron ? ` [${pron}]` : ""}`
              });
            }
          }

          // examples -> 1 sens
          const examples = Array.isArray(les.examples) ? les.examples : [];
          for (let i = 0; i < examples.length; i++) {
            const e = examples[i] || {};
            const sv = t(e.sv);
            const fr = t(e.fr);
            const pron = t(e.pron);
            if (!sv || !fr) continue;

            add({
              id: `ex:${levelKey}:${moduleId}:${lessonId}:${i}`,
              type: "EX_SV_FR",
              level: levelKey,
              moduleId,
              lessonId,
              front: `${sv}${pron ? ` [${pron}]` : ""}`,
              back: fr
            });
          }
        }
      }
    }

    return out;
  },

  escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
};