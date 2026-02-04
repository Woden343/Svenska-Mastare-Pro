const Storage = {
  key: "svenska_progress_v1",
  load() {
    try { return JSON.parse(localStorage.getItem(this.key)) ?? { done:{}, stats:{ correct:0, wrong:0 } }; }
    catch { return { done:{}, stats:{ correct:0, wrong:0 } }; }
  },
  save(state){ localStorage.setItem(this.key, JSON.stringify(state)); },
  markDone(lessonId){
    const s = this.load();
    s.done[lessonId] = true;
    this.save(s);
  },
  addResult(isCorrect){
    const s = this.load();
    if(isCorrect) s.stats.correct++;
    else s.stats.wrong++;
    this.save(s);
  }
};
