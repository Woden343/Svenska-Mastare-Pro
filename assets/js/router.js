// assets/js/router.js

const Router = {
  routes: {},
  currentPath: null,
  currentParams: {},

  on(path, handler) {
    if (typeof path !== "string" || typeof handler !== "function") {
      console.error("[Router] Route invalide:", path);
      return;
    }
    this.routes[path] = handler;
  },

  go(path, params = {}) {
    if (typeof path !== "string") {
      console.error("[Router] Chemin invalide:", path);
      return;
    }

    const qs = new URLSearchParams(params).toString();

    // ✅ IMPORTANT : location.hash ajoute déjà le "#"
    // Donc on lui donne "/route?x=y" (sans "#")
    const next = path + (qs ? `?${qs}` : "");
    location.hash = next;
  },

  parseHash() {
    // Hash normal attendu: "#/route?x=y"
    // On tolère aussi d'anciens formats "##/route?x=y" en nettoyant.
    let hash = location.hash || "#/";
    while (hash.startsWith("##")) hash = hash.slice(1);

    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    const [rawPath, rawQuery] = raw.split("?");
    const path = rawPath || "/";
    const params = Object.fromEntries(new URLSearchParams(rawQuery || ""));
    return { path, params };
  },

  dispatch() {
    const { path, params } = this.parseHash();
    this.currentPath = path;
    this.currentParams = params;

    const handler = this.routes[path];

    if (handler) {
      try {
        handler(params);
      } catch (e) {
        console.error(`[Router] Erreur handler "${path}":`, e);
        this.showError(e);
      }
      return;
    }

    console.warn("[Router] Route inconnue:", path);
    if (path !== "/" && this.routes["/"]) {
      this.go("/");
    } else {
      this.showNotFound(path);
    }
  },

  showError(error) {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = `
      <div class="card" style="border-color: var(--accent-red, #ff6a6a);">
        <h2>❌ Erreur</h2>
        <p class="muted">Une erreur s'est produite.</p>
        <pre style="background: rgba(255,106,106,0.1); padding: 12px; border-radius: 8px; overflow:auto; font-size: 13px;">${this.escapeHtml(error?.message || String(error))}</pre>
        <button class="btn btn-primary" onclick="Router.go('/')" style="margin-top:12px;">← Retour à l'accueil</button>
      </div>
    `;
  },

  showNotFound(path) {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = `
      <div class="card">
        <h2>🔍 Page introuvable</h2>
        <p class="muted">La route <code>${this.escapeHtml(path)}</code> n'existe pas.</p>
        <button class="btn btn-primary" onclick="Router.go('/')" style="margin-top:12px;">← Retour à l'accueil</button>
      </div>
    `;
  },

  escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  },

  start(defaultPath = "/") {
    if (!location.hash) {
      // ✅ Met juste "#/..."
      location.hash = defaultPath;
    }

    window.addEventListener("hashchange", () => this.dispatch());
    this.dispatch();
  },

  reload() {
    this.dispatch();
  }
};
