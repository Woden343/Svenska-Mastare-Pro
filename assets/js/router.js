// assets/js/router.js - VERSION CORRIGÉE

const Router = {
  routes: {},
  currentPath: null,
  currentParams: {},

  /**
   * ✅ Enregistre une route
   * @param {String} path - Chemin (ex: "/", "/lesson")
   * @param {Function} handler - Fonction à exécuter
   */
  on(path, handler) {
    if (typeof path !== 'string' || typeof handler !== 'function') {
      console.error('[Router] Route invalide:', path);
      return;
    }
    this.routes[path] = handler;
  },

  /**
   * ✅ Navigue vers une route
   * @param {String} path - Chemin
   * @param {Object} params - Paramètres optionnels
   */
  go(path, params = {}) {
    if (typeof path !== 'string') {
      console.error('[Router] Chemin invalide:', path);
      return;
    }

    // Construire URL avec paramètres
    const queryString = new URLSearchParams(params).toString();
    const url = "#" + path + (queryString ? "?" + queryString : "");
    
    // Mettre à jour hash (déclenche hashchange)
    location.hash = url;
  },

  /**
   * ✅ Parse le hash actuel
   * @returns {Object} { path, params }
   */
  parseHash() {
    const hash = location.hash || "#/";
    const [rawPath, rawQuery] = hash.slice(1).split("?");
    const path = rawPath || "/";
    const params = Object.fromEntries(new URLSearchParams(rawQuery || ""));
    return { path, params };
  },

  /**
   * ✅ Dispatch la route actuelle
   */
  dispatch() {
    const { path, params } = this.parseHash();
    
    // Stocker état actuel
    this.currentPath = path;
    this.currentParams = params;

    // Trouver et exécuter handler
    const handler = this.routes[path];
    
    if (handler) {
      try {
        handler(params);
      } catch (e) {
        console.error(`[Router] Erreur dans handler "${path}":`, e);
        this.showError(e);
      }
    } else {
      // ✅ Fallback vers accueil si route inconnue
      console.warn(`[Router] Route inconnue: ${path}`);
      if (path !== "/" && this.routes["/"]) {
        this.go("/");
      } else {
        this.showNotFound(path);
      }
    }
  },

  /**
   * ✅ Affiche une erreur
   * @param {Error} error - Erreur à afficher
   */
  showError(error) {
    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = `
        <div class="card" style="border-color: var(--accent-red, #ff6a6a);">
          <h2>❌ Erreur</h2>
          <p class="muted">Une erreur s'est produite lors du chargement de la page.</p>
          <pre style="background: rgba(255,106,106,0.1); padding: 12px; border-radius: 8px; overflow: auto; font-size: 13px;">${this.escapeHtml(error.message || String(error))}</pre>
          <button class="btn btn-primary" onclick="Router.go('/')" style="margin-top:12px;">← Retour à l'accueil</button>
        </div>
      `;
    }
  },

  /**
   * ✅ Affiche une page 404
   * @param {String} path - Chemin non trouvé
   */
  showNotFound(path) {
    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = `
        <div class="card">
          <h2>🔍 Page introuvable</h2>
          <p class="muted">La route <code>${this.escapeHtml(path)}</code> n'existe pas.</p>
          <button class="btn btn-primary" onclick="Router.go('/')" style="margin-top:12px;">← Retour à l'accueil</button>
        </div>
      `;
    }
  },

  /**
   * ✅ Échappe le HTML pour éviter XSS
   * @param {String} str - Chaîne à échapper
   * @returns {String} Chaîne échappée
   */
  escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  },

  /**
   * ✅ Démarre le routeur
   * @param {String} defaultPath - Route par défaut
   */
  start(defaultPath = "/") {
    // Définir route par défaut si aucun hash
    if (!location.hash) {
      location.hash = "#" + defaultPath;
    }

    // ✅ Écouter changements de hash
    window.addEventListener("hashchange", () => this.dispatch());
    
    // Dispatch initial
    this.dispatch();
  },

  /**
   * ✅ Recharge la route actuelle
   */
  reload() {
    this.dispatch();
  }
};
