const Storage = {
  key: "svenska_progress_v1",

  defaultState() {
    return { done: {}, stats: { correct: 0, wrong: 0 } };
  },

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) ?? this.defaultState();
    } catch {
      return this.defaultState();
    }
  },

  save(state) {
    localStorage.setItem(this.key, JSON.stringify(state));
  },

  markDone(lessonKey) {
    // lessonKey peut être "a1_intro_1" (ancien) OU "A1:a1_intro_1" (nouveau)
    const s = this.load();
    s.done[lessonKey] = true;
    this.save(s);
  },

  isDone(lessonKey) {
    const s = this.load();
    return !!s.done[lessonKey];
  },

  doneCount() {
    const s = this.load();
    return Object.keys(s.done).length;
  },

  addResult(isCorrect) {
    const s = this.load();
    if (isCorrect) s.stats.correct++;
    else s.stats.wrong++;
    this.save(s);
  }
};