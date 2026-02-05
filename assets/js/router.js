// assets/js/router.js
// Router hash robuste: "#/path?key=value"
// - Supporte "#", "#/", "#/review", "#/ref", etc.
// - Force le dispatch même si le hash ne change pas

const Router = {
  routes: new Map(),
  started: false,

  on(path, handler) {
    this.routes.set(path, handler);
  },

  go(path, params = {}) {
    const qs = this._toQuery(params);
    const target = `#${path}${qs ? "?" + qs : ""}`;

    // Si même hash, on force quand même le rendu
    if (location.hash === target) {
      this._dispatch();
      return;
    }

    location.hash = target;

    // Certains navigateurs (ou cas limites) ne déclenchent pas hashchange immédiatement
    // => on force un dispatch au prochain tick
    setTimeout(() => this._dispatch(), 0);
  },

  start(fallbackPath = "/") {
    if (this.started) return;
    this.started = true;

    window.addEventListener("hashchange", () => this._dispatch());

    // Si pas de hash, on le met
    if (!location.hash || location.hash === "#") {
      location.hash = `#${fallbackPath}`;
    }

    // Premier rendu
    this._dispatch();
  },

  _dispatch() {
    try {
      const { path, params } = this._parse(location.hash);

      // Normalisation : "" => "/", "#/" => "/"
      const normalizedPath = (path && path !== "#") ? path : "/";

      const handler =
        this.routes.get(normalizedPath) ||
        (normalizedPath === "" ? this.routes.get("/") : null);

      if (!handler) {
        const root = this.routes.get("/");
        if (root) return root({});
        return;
      }

      handler(params);
    } catch (e) {
      console.error("[Router] dispatch error:", e);
      const mount = document.getElementById("app");
      if (mount) {
        mount.innerHTML = `
          <section class="card">
            <h2>Erreur Router</h2>
            <p class="muted">Une erreur JS a empêché l’affichage.</p>
            <pre style="white-space:pre-wrap; word-break:break-word; margin:0;">${String(e?.message || e)}</pre>
          </section>
        `;
      }
    }
  },

  _parse(hash) {
    const raw = (hash || "").replace(/^#/, ""); // enlève "#"
    if (!raw) return { path: "/", params: {} };

    const [pathPart, queryPart] = raw.split("?");
    const path = pathPart || "/"; // "#/": pathPart="/" OK ; "#": raw="" => plus haut
    const params = this._fromQuery(queryPart || "");
    return { path, params };
  },

  _toQuery(params) {
    const sp = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      sp.set(k, String(v));
    });
    return sp.toString();
  },

  _fromQuery(qs) {
    const sp = new URLSearchParams(qs);
    const obj = {};
    for (const [k, v] of sp.entries()) obj[k] = v;
    return obj;
  }
};