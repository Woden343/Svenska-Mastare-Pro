// assets/js/router.js - VERSION COMPLÈTE (COMPAT + BACK)

const Router = {
  routes: {},
  currentPath: "/",
  currentParams: {},

  // === API principale ===
  on(path, handler) {
    if (typeof path !== "string" || typeof handler !== "function") {
      console.error("[Router] Route invalide:", path);
      return;
    }
    this.routes[path] = handler;
  },

  // ✅ Compat : certains fichiers utilisent Router.add(...)
  add(path, handler) {
    this.on(path, handler);
  },

  go(path, params = {}) {
    if (typeof path !== "string") {
      console.error("[Router] Chemin invalide:", path);
      return;
    }

    const qs = new URLSearchParams(params).toString();
    const hash = "#" + path + (qs ? "?" + qs : "");

    // Évite de déclencher hashchange inutilement
    if (location.hash === hash) {
      this.dispatch();
      return;
    }

    location.hash = hash;
  },

  // ✅ Bouton "retour" utilisable partout
  back(fallbackPath = "/") {
    // Si on a un historique (au moins une entrée précédente), on revient
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.go(fallbackPath);
    }
  },

  // === Internes ===
  parseHash() {
    // hash attendu : "#/route?x=y"
    const raw = (location.hash || "#/").trim();

    // Retire le "#"
    const withoutHash = raw.startsWith("#") ? raw.slice(1) : raw;

    // Split route / query
    const [rawPath, rawQuery] = withoutHash.split("?");

    const path = (rawPath && rawPath.length) ? rawPath : "/";
    const params = Object.fromEntries(new URLSearchParams(rawQuery || ""));

    return { path, params };
  },

  dispatch() {
    const { path, params } = this.parseHash();

    this.currentPath = path;
    this.currentParams = params;

    const handler = this.routes[path];

    // Scroll top (optionnel mais agréable)
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (_) {}

    if (handler) {
      try {
        handler(params);
      } catch (e) {
        console.error(`[Router] Erreur handler "${path}":`, e);
        const app = document.getElementById("app");
        if (app) {
          app.innerHTML = `
            <section class="card" style="border-color: var(--accent-red, #ff6a6a);">
              <h2>❌ Erreur</h2>
              <p class="muted">Une erreur s'est produite lors de l'affichage de cette page.</p>
              <pre style="background:rgba(255,0,0,0.1); padding:12px; border-radius:8px; overflow:auto;">${(e && e.stack) ? e.stack : (e && e.message) ? e.message : String(e)}</pre>
              <div class="row gap" style="margin-top:12px;">
                <button class="btn" onclick="Router.back('/')">← Retour</button>
                <button class="btn" onclick="Router.go('/')">🏠 Accueil</button>
              </div>
            </section>
          `;
        }
      }
    } else {
      console.warn(`[Router] Route inconnue: ${path}`);
      // Redirige vers "/" si possible
      if (this.routes["/"]) this.go("/");
    }
  },

  start(defaultPath = "/") {
    // Si aucun hash au chargement, on place la route par défaut
    if (!location.hash) {
      location.hash = "#" + defaultPath;
    }

    window.addEventListener("hashchange", () => this.dispatch());

    // Dispatch initial
    this.dispatch();
  },

  reload() {
    this.dispatch();
  }
};
