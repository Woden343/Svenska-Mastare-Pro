// assets/js/router.js

const Router = {
  routes: {},
  currentPath: null,
  currentParams: {},

  on(path, handler) {
    if (typeof path !== 'string' || typeof handler !== 'function') {
      console.error('[Router] Route invalide:', path);
      return;
    }
    this.routes[path] = handler;
  },

  go(path, params = {}) {
    if (typeof path !== 'string') {
      console.error('[Router] Chemin invalide:', path);
      return;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = "#" + path + (queryString ? "?" + queryString : "");
    location.hash = url;
  },

  parseHash() {
    const hash = location.hash || "#/";
    const [rawPath, rawQuery] = hash.slice(1).split("?");
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
        const app = document.getElementById("app");
        if (app) {
          app.innerHTML = `
            <section class="card" style="border-color: var(--accent-red, #ff6a6a);">
              <h2>❌ Erreur</h2>
              <p class="muted">Une erreur s'est produite.</p>
              <pre style="background:rgba(255,0,0,0.1); padding:12px; border-radius:8px; overflow:auto;">${e.message || e}</pre>
              <button class="btn" onclick="Router.go('/')">← Retour</button>
            </section>
          `;
        }
      }
    } else {
      console.warn(`[Router] Route inconnue: ${path}`);
      if (path !== "/" && this.routes["/"]) {
        this.go("/");
      }
    }
  },

  start(defaultPath = "/") {
    if (!location.hash) {
      location.hash = "#" + defaultPath;
    }

    window.addEventListener("hashchange", () => this.dispatch());
    this.dispatch();
  },

  reload() {
    this.dispatch();
  }
};