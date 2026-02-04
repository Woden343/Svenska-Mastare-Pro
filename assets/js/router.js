const Router = {
  routes: new Map(),
  on(path, fn){ this.routes.set(path, fn); },
  go(path, params = {}) {
    history.pushState({ path, params }, "", "#" + path);
    this.render(path, params);
  },
  start(defaultPath="/") {
    window.addEventListener("popstate", (e)=>{
      const st = e.state || { path: defaultPath, params:{} };
      this.render(st.path, st.params);
    });
    const hash = location.hash.replace("#","") || defaultPath;
    this.render(hash, {});
  },
  render(path, params){
    const fn = this.routes.get(path);
    if(!fn) return this.routes.get("/")?.();
    fn(params);
  }
};
