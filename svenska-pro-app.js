// ============================================
// SVENSKA MÄSTARE PRO - APPLICATION FINALE
// Version fusionnée optimisée
// ============================================

// ==================== STATE MANAGEMENT ====================

const STORAGE_KEY = "svenska-mastare-pro";

const appState = {
  currentTab: "learn",
  currentLevel: "A1",
  user: {
    xp: 0,
    streak: 0,
    lastStudyDate: null
  },
  progress: {
    lessonsCompleted: [],
    quiz: {
      answered: 0,
      correct: 0
    },
    flashcards: {
      learned: []
    }
  },
  settings: {
    sound: true,
    autoNext: false,
    dailyGoal: 20
  },
  session: {
    questions: [],
    currentIndex: 0,
    score: 0,
    correct: 0
  },
  dialogue: {
    messages: [],
    scenario: null
  }
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(appState, parsed);
      updateStreak();
    } catch (e) {
      console.error("Error loading state:", e);
    }
  }
}

function updateStreak() {
  const today = new Date().toDateString();
  const lastDate = appState.user.lastStudyDate;
  
  if (lastDate === today) return;
  
  if (lastDate) {
    const last = new Date(lastDate);
    const now = new Date();
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      appState.user.streak++;
    } else if (diffDays > 1) {
      appState.user.streak = 1;
    }
  } else {
    appState.user.streak = 1;
  }
  
  appState.user.lastStudyDate = today;
  saveState();
}

// ==================== UI UPDATES ====================

function updateHeaderUI() {
  document.getElementById("ui-xp").textContent = appState.user.xp;
  document.getElementById("ui-level").textContent = appState.currentLevel;
  document.getElementById("ui-streak").textContent = `${appState.user.streak} j`;
  
  const lessons = LESSONS[appState.currentLevel] || [];
  const completed = lessons.filter(l => appState.progress.lessonsCompleted.includes(l.id)).length;
  const progress = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
  document.getElementById("ui-progress").textContent = `${progress}%`;
  
  const wordsLearned = appState.progress.flashcards.learned.length;
  document.getElementById("ui-words").textContent = wordsLearned;
}

function toast(message) {
  const toastEl = document.getElementById("toast");
  const textEl = document.getElementById("toast-text");
  textEl.textContent = message;
  toastEl.classList.remove("hidden");
  setTimeout(() => toastEl.classList.add("hidden"), 2000);
}

// ==================== TAB NAVIGATION ====================

function setActiveTab(tabName) {
  // Update tab buttons
  ['learn', 'practice', 'flashcards', 'dialogue', 'progress'].forEach(tab => {
    const btn = document.getElementById(`tab-${tab}`);
    const content = document.getElementById(`content-${tab}`);
    
    if (tab === tabName) {
      btn.classList.remove('tab-inactive');
      btn.classList.add('tab-active');
      content.classList.remove('hidden');
    } else {
      btn.classList.remove('tab-active');
      btn.classList.add('tab-inactive');
      content.classList.add('hidden');
    }
  });
  
  appState.currentTab = tabName;
  saveState();
  
  // Render content
  if (tabName === 'learn') renderLearn();
  if (tabName === 'practice') renderPractice();
  if (tabName === 'flashcards') renderFlashcards();
  if (tabName === 'dialogue') renderDialogue();
  if (tabName === 'progress') renderProgress();
}

// ==================== LEARN TAB ====================

function renderLearn() {
  const container = document.getElementById("content-learn");
  const lessons = LESSONS[appState.currentLevel] || [];
  
  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h3 class="text-2xl font-extrabold text-slate-800">Leçons académiques</h3>
        <p class="text-slate-600">Contenu théorique complet avec exemples</p>
      </div>
      <div class="min-w-[200px]">
        <select id="level-selector" class="w-full p-3 border-2 border-slate-300 rounded-xl focus-ring">
          <option value="A1" ${appState.currentLevel === 'A1' ? 'selected' : ''}>A1 - Débutant</option>
          <option value="A2" ${appState.currentLevel === 'A2' ? 'selected' : ''}>A2 - Élémentaire</option>
          <option value="B1" ${appState.currentLevel === 'B1' ? 'selected' : ''}>B1 - Intermédiaire</option>
          <option value="B2" ${appState.currentLevel === 'B2' ? 'selected' : ''}>B2 - Intermédiaire Avancé</option>
          <option value="C1" ${appState.currentLevel === 'C1' ? 'selected' : ''}>C1 - Avancé</option>
          <option value="C2" ${appState.currentLevel === 'C2' ? 'selected' : ''}>C2 - Maîtrise</option>
        </select>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="lessons-grid">
      ${lessons.map(lesson => {
        const isCompleted = appState.progress.lessonsCompleted.includes(lesson.id);
        return `
          <button onclick="openLesson('${lesson.id}')" class="card text-left bg-white border-2 border-slate-200 rounded-xl p-5 hover:border-blue-400 transition">
            <div class="flex items-start justify-between mb-2">
              <div class="text-3xl">${lesson.icon}</div>
              <div class="text-xl">${isCompleted ? '✅' : '⬜'}</div>
            </div>
            <div class="text-xs text-blue-600 font-semibold mb-1">${lesson.category}</div>
            <h4 class="font-bold text-slate-800 mb-2">${lesson.title}</h4>
            <div class="text-xs text-slate-500">⏱️ ${lesson.duration}</div>
          </button>
        `;
      }).join('')}
    </div>
  `;
  
  // Bind level selector
  document.getElementById("level-selector").addEventListener("change", (e) => {
    appState.currentLevel = e.target.value;
    saveState();
    updateHeaderUI();
    renderLearn();
  });
}

function openLesson(lessonId) {
  const lessons = LESSONS[appState.currentLevel] || [];
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) return;
  
  const isCompleted = appState.progress.lessonsCompleted.includes(lessonId);
  
  const modal = document.createElement('div');
  modal.id = 'lesson-modal';
  modal.className = 'fixed inset-0 z-50 overflow-y-auto';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeLessonModal()"></div>
    <div class="relative max-w-4xl mx-auto mt-10 mb-10 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
        <div>
          <div class="text-xs text-blue-100">${appState.currentLevel} • ${lesson.category}</div>
          <h3 class="font-extrabold text-xl">${lesson.title}</h3>
        </div>
        <button onclick="closeLessonModal()" class="p-2 hover:bg-white/15 rounded-lg">✕</button>
      </div>
      
      <div class="p-6 space-y-4">
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <div class="text-sm text-slate-600">⏱️ ${lesson.duration}</div>
          <div class="flex gap-2">
            <button onclick="playLessonAudio('${lesson.title}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              🔊 Audio
            </button>
            <button onclick="toggleLessonComplete('${lessonId}')" class="px-4 py-2 ${isCompleted ? 'bg-slate-700' : 'bg-green-600'} text-white rounded-lg hover:opacity-90 transition">
              ${isCompleted ? '↩️ Non terminée' : '✅ Terminée'}
            </button>
          </div>
        </div>
        
        <div class="lesson-content prose max-w-none">
          ${lesson.content}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function closeLessonModal() {
  const modal = document.getElementById('lesson-modal');
  if (modal) modal.remove();
  renderLearn();
}

function toggleLessonComplete(lessonId) {
  const index = appState.progress.lessonsCompleted.indexOf(lessonId);
  if (index > -1) {
    appState.progress.lessonsCompleted.splice(index, 1);
  } else {
    appState.progress.lessonsCompleted.push(lessonId);
    appState.user.xp += 50;
    toast("🎉 +50 XP pour la leçon complétée !");
  }
  saveState();
  updateHeaderUI();
  closeLessonModal();
}

function playLessonAudio(text) {
  if (!appState.settings.sound) {
    toast("Audio désactivé dans les paramètres");
    return;
  }
  
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } catch (e) {
    toast("Audio non disponible sur ce navigateur");
  }
}

// ==================== PRACTICE TAB ====================

function renderPractice() {
  const container = document.getElementById("content-practice");
  
  if (appState.session.questions.length === 0) {
    container.innerHTML = `
      <div>
        <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Modes d'entraînement</h3>
        <p class="text-slate-600 mb-6">Testez vos connaissances avec différents types d'exercices</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button onclick="startPractice('quick')" class="card p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition">
          <div class="text-3xl mb-2">⚡</div>
          <h4 class="font-bold text-slate-800 mb-1">Session Rapide</h4>
          <p class="text-xs text-slate-600">10 questions mixtes</p>
        </button>
        
        <button onclick="startPractice('grammar')" class="card p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition">
          <div class="text-3xl mb-2">📖</div>
          <h4 class="font-bold text-slate-800 mb-1">Grammaire</h4>
          <p class="text-xs text-slate-600">Focus grammaire</p>
        </button>
        
        <button onclick="startPractice('vocabulary')" class="card p-5 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:border-green-400 transition">
          <div class="text-3xl mb-2">💬</div>
          <h4 class="font-bold text-slate-800 mb-1">Vocabulaire</h4>
          <p class="text-xs text-slate-600">Enrichissement</p>
        </button>
        
        <button onclick="startPractice('review')" class="card p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl hover:border-orange-400 transition">
          <div class="text-3xl mb-2">🔄</div>
          <h4 class="font-bold text-slate-800 mb-1">Révision</h4>
          <p class="text-xs text-slate-600">Répétition espacée</p>
        </button>
      </div>
    `;
  } else {
    renderQuestion();
  }
}

function startPractice(mode) {
  const levelData = QUESTION_BANK[appState.currentLevel];
  if (!levelData) {
    toast("Pas de questions pour ce niveau");
    return;
  }
  
  let questions = [];
  if (mode === 'quick') {
    questions = [...(levelData.grammar || []), ...(levelData.vocabulary || [])];
  } else if (mode === 'grammar') {
    questions = levelData.grammar || [];
  } else if (mode === 'vocabulary') {
    questions = levelData.vocabulary || [];
  }
  
  // Shuffle and take 10
  const shuffled = questions.sort(() => Math.random() - 0.5);
  appState.session.questions = shuffled.slice(0, 10);
  appState.session.currentIndex = 0;
  appState.session.score = 0;
  appState.session.correct = 0;
  
  renderQuestion();
}

function renderQuestion() {
  const container = document.getElementById("content-practice");
  const q = appState.session.questions[appState.session.currentIndex];
  const total = appState.session.questions.length;
  const current = appState.session.currentIndex + 1;
  const progress = (current / total) * 100;
  
  container.innerHTML = `
    <div class="bg-white rounded-xl p-4 border border-slate-200 mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-semibold">Question ${current}/${total}</span>
        <span class="text-sm font-bold text-blue-600">${appState.session.score} points</span>
      </div>
      <div class="bg-slate-200 h-3 rounded-full overflow-hidden">
        <div class="progress-bar bg-blue-600 h-full" style="width: ${progress}%"></div>
      </div>
    </div>
    
    <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
        <div class="flex justify-between items-center">
          <span class="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">${q.category}</span>
          <span class="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">${q.difficulty === 'easy' ? 'Facile' : q.difficulty === 'medium' ? 'Moyen' : 'Difficile'}</span>
        </div>
      </div>
      
      <div class="p-8">
        <h3 class="text-2xl font-semibold text-slate-800 mb-6">${q.question}</h3>
        
        ${q.hint ? `
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
            <p class="text-sm text-blue-800"><strong>💡 Astuce :</strong> ${q.hint}</p>
          </div>
        ` : ''}
        
        <div id="answer-area" class="space-y-3">
          ${q.type === 'multiple-choice' ? renderMCQ(q) : renderTextInput(q)}
        </div>
        
        <div id="feedback-area" class="mt-6 hidden"></div>
      </div>
    </div>
    
    <div class="flex gap-3 mt-4">
      <button onclick="backToPracticeMenu()" class="flex-1 bg-white border-2 border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:border-slate-400 transition">
        ← Retour
      </button>
      <button onclick="skipQuestion()" class="px-6 bg-white border-2 border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:border-slate-400 transition">
        Passer
      </button>
    </div>
  `;
}

function renderMCQ(q) {
  return q.options.map((option, index) => `
    <button onclick="checkAnswer(${index})" class="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 font-medium transition">
      ${option}
    </button>
  `).join('');
}

function renderTextInput(q) {
  return `
    <input type="text" id="text-answer" class="w-full p-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg" placeholder="Votre réponse..." onkeypress="if(event.key==='Enter') checkTextAnswer()">
    <button onclick="checkTextAnswer()" class="mt-4 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
      Valider
    </button>
  `;
}

function checkAnswer(selectedIndex) {
  const q = appState.session.questions[appState.session.currentIndex];
  const isCorrect = selectedIndex === q.correct;
  
  showFeedback(isCorrect, q.explanation, q.points);
}

function checkTextAnswer() {
  const q = appState.session.questions[appState.session.currentIndex];
  const userAnswer = document.getElementById('text-answer').value.trim().toLowerCase();
  const isCorrect = q.correctAnswers.some(ans => ans.toLowerCase() === userAnswer);
  
  showFeedback(isCorrect, q.explanation, q.points);
}

function showFeedback(isCorrect, explanation, points) {
  const feedbackArea = document.getElementById('feedback-area');
  
  if (isCorrect) {
    appState.session.correct++;
    appState.session.score += points;
    appState.user.xp += points;
    appState.progress.quiz.correct++;
  }
  appState.progress.quiz.answered++;
  
  feedbackArea.className = isCorrect 
    ? 'mt-6 p-5 rounded-xl bg-green-100 text-green-800 border-l-4 border-green-500'
    : 'mt-6 p-5 rounded-xl bg-red-100 text-red-800 border-l-4 border-red-500';
  
  feedbackArea.innerHTML = `
    <strong>${isCorrect ? '✅ Correct !' : '❌ Incorrect'}</strong><br>${explanation}
    <button onclick="nextQuestion()" class="mt-4 w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition">
      Question suivante →
    </button>
  `;
  feedbackArea.classList.remove('hidden');
  
  saveState();
  updateHeaderUI();
}

function nextQuestion() {
  appState.session.currentIndex++;
  
  if (appState.session.currentIndex >= appState.session.questions.length) {
    showCompletion();
  } else {
    renderQuestion();
  }
}

function skipQuestion() {
  if (confirm('Passer cette question ?')) {
    nextQuestion();
  }
}

function showCompletion() {
  const container = document.getElementById("content-practice");
  const accuracy = Math.round((appState.session.correct / appState.session.questions.length) * 100);
  
  container.innerHTML = `
    <div class="bg-white rounded-2xl p-12 shadow-lg text-center">
      <div class="text-7xl mb-4">🎉</div>
      <h2 class="text-4xl font-bold text-slate-800 mb-2">Fantastiskt!</h2>
      <p class="text-xl text-slate-600 mb-8">Session terminée</p>
      
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <div class="text-3xl font-bold text-blue-600">${appState.session.correct}/${appState.session.questions.length}</div>
            <div class="text-xs text-slate-600 mt-1">Score</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-600">${accuracy}%</div>
            <div class="text-xs text-slate-600 mt-1">Précision</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-orange-600">+${appState.session.score} XP</div>
            <div class="text-xs text-slate-600 mt-1">Gagné</div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <button onclick="backToPracticeMenu()" class="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition">
          ▶️ Continuer
        </button>
        <button onclick="setActiveTab('learn')" class="flex-1 bg-slate-700 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition">
          🏠 Tableau de bord
        </button>
      </div>
    </div>
  `;
  
  appState.session.questions = [];
  saveState();
  updateHeaderUI();
}

function backToPracticeMenu() {
  appState.session.questions = [];
  renderPractice();
}

// ==================== FLASHCARDS TAB ====================

let flashcardState = {
  category: 'Bases',
  index: 0,
  flipped: false
};

function renderFlashcards() {
  const container = document.getElementById("content-flashcards");
  const categories = Object.keys(FLASHCARDS);
  
  container.innerHTML = `
    <div class="mb-6">
      <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Flashcards de vocabulaire</h3>
      <p class="text-slate-600">Mémorisez avec des cartes interactives</p>
    </div>
    
    <div class="mb-6">
      <select id="flash-category" class="w-full p-3 border-2 border-slate-300 rounded-xl focus-ring">
        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      </select>
    </div>
    
    <div class="max-w-md mx-auto mb-6">
      <div id="flashcard" class="flip-card" onclick="flipCard()">
        <div class="flip-card-inner">
          <div class="flip-card-front bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <div class="text-center">
              <div class="text-sm opacity-75 mb-2">Suédois</div>
              <div class="text-4xl font-bold" id="flash-front"></div>
              <div class="text-sm mt-4 opacity-75">Cliquez pour révéler</div>
            </div>
          </div>
          <div class="flip-card-back bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <div class="text-center">
              <div class="text-sm opacity-75 mb-2">Français</div>
              <div class="text-4xl font-bold" id="flash-back"></div>
              <div class="text-sm mt-4 opacity-75">Cliquez pour retourner</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-center gap-4 mb-4">
      <button onclick="previousFlashcard()" class="px-6 py-3 bg-slate-200 rounded-lg hover:bg-slate-300 transition font-semibold">
        ← Précédente
      </button>
      <button onclick="nextFlashcard()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
        Suivante →
      </button>
    </div>
    
    <div class="text-center">
      <div id="flash-counter" class="text-slate-600 mb-2"></div>
      <div id="flash-stats" class="text-sm text-slate-500"></div>
    </div>
  `;
  
  updateFlashcard();
  
  document.getElementById('flash-category').addEventListener('change', (e) => {
    flashcardState.category = e.target.value;
    flashcardState.index = 0;
    flashcardState.flipped = false;
    updateFlashcard();
  });
}

function updateFlashcard() {
  const cards = FLASHCARDS[flashcardState.category] || [];
  if (cards.length === 0) return;
  
  const card = cards[flashcardState.index];
  document.getElementById('flash-front').textContent = card.swedish;
  document.getElementById('flash-back').textContent = card.french;
  document.getElementById('flash-counter').textContent = `${flashcardState.index + 1} / ${cards.length}`;
  
  const total = Object.values(FLASHCARDS).flat().length;
  const learned = appState.progress.flashcards.learned.length;
  document.getElementById('flash-stats').textContent = `Mots appris : ${learned} / ${total}`;
  
  // Reset flip
  const flashcard = document.getElementById('flashcard');
  flashcard.classList.remove('flipped');
  flashcardState.flipped = false;
}

function flipCard() {
  const flashcard = document.getElementById('flashcard');
  flashcard.classList.toggle('flipped');
  flashcardState.flipped = !flashcardState.flipped;
  
  if (flashcardState.flipped) {
    const cards = FLASHCARDS[flashcardState.category] || [];
    const card = cards[flashcardState.index];
    const key = `${flashcardState.category}:${card.swedish}`;
    
    if (!appState.progress.flashcards.learned.includes(key)) {
      appState.progress.flashcards.learned.push(key);
      saveState();
      updateHeaderUI();
      updateFlashcard();
    }
  }
}

function nextFlashcard() {
  const cards = FLASHCARDS[flashcardState.category] || [];
  flashcardState.index = (flashcardState.index + 1) % cards.length;
  flashcardState.flipped = false;
  updateFlashcard();
}

function previousFlashcard() {
  const cards = FLASHCARDS[flashcardState.category] || [];
  flashcardState.index = (flashcardState.index - 1 + cards.length) % cards.length;
  flashcardState.flipped = false;
  updateFlashcard();
}

// ==================== DIALOGUE TAB ====================

function renderDialogue() {
  const container = document.getElementById("content-dialogue");
  
  if (appState.dialogue.scenario === null) {
    container.innerHTML = `
      <div class="mb-6">
        <h3 class="text-2xl font-extrabold text-slate-800 mb-2">Pratique de conversation</h3>
        <p class="text-slate-600">Entraînez-vous à dialoguer en suédois</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onclick="startDialogue('casual')" class="card p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-xl hover:border-green-400 transition">
          <div class="text-3xl mb-2">👋</div>
          <h4 class="font-bold text-slate-800 mb-1">Conversation Informelle</h4>
          <p class="text-xs text-slate-600">Discussions quotidiennes</p>
        </button>
        
        <button onclick="startDialogue('restaurant')" class="card p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl hover:border-orange-400 transition">
          <div class="text-3xl mb-2">🍽️</div>
          <h4 class="font-bold text-slate-800 mb-1">Au Restaurant</h4>
          <p class="text-xs text-slate-600">Commander un repas</p>
        </button>
        
        <button onclick="startDialogue('shopping')" class="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition">
          <div class="text-3xl mb-2">🛍️</div>
          <h4 class="font-bold text-slate-800 mb-1">Shopping</h4>
          <p class="text-xs text-slate-600">Achats en magasin</p>
        </button>
      </div>
    `;
  } else {
    renderDialogueChat();
  }
}

function startDialogue(scenario) {
  appState.dialogue.scenario = scenario;
  appState.dialogue.messages = [
    { role: 'ai', text: 'Hej! Vad heter du?' }
  ];
  renderDialogueChat();
}

function renderDialogueChat() {
  const container = document.getElementById("content-dialogue");
  
  container.innerHTML = `
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-xl font-bold">Conversation en cours</h3>
      <button onclick="endDialogue()" class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition">
        Terminer
      </button>
    </div>
    
    <div class="bg-slate-50 rounded-xl p-4 mb-4" style="height: 400px; overflow-y: auto;" id="dialogue-messages">
      ${appState.dialogue.messages.map(msg => `
        <div class="message-bubble message-${msg.role}">
          ${msg.text}
        </div>
      `).join('')}
    </div>
    
    <div class="flex gap-2">
      <input type="text" id="dialogue-input" class="flex-1 p-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Écrivez en suédois..." onkeypress="if(event.key==='Enter') sendDialogueMessage()">
      <button onclick="sendDialogueMessage()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
        Envoyer
      </button>
    </div>
    
    <div class="mt-4 text-center">
      <button onclick="dialogueHint()" class="text-sm text-blue-600 hover:text-blue-700">
        💡 Besoin d'aide ?
      </button>
    </div>
  `;
  
  const messagesDiv = document.getElementById('dialogue-messages');
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendDialogueMessage() {
  const input = document.getElementById('dialogue-input');
  const message = input.value.trim();
  if (!message) return;
  
  appState.dialogue.messages.push({ role: 'user', text: message });
  input.value = '';
  
  // Simple response (in production, would use Claude API)
  setTimeout(() => {
    const response = generateSimpleResponse(message);
    appState.dialogue.messages.push({ role: 'ai', text: response });
    renderDialogueChat();
  }, 1000);
  
  renderDialogueChat();
}

function generateSimpleResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('hej')) return 'Hej! Hur mår du?';
  if (lower.includes('jag heter')) return 'Trevligt att träffas!';
  if (lower.includes('tack')) return 'Varsågod!';
  if (lower.includes('jag mår')) return 'Vad bra! Vad gör du idag?';
  
  return 'Intressant! Berätta mer.';
}

function dialogueHint() {
  const hints = [
    'Essayez : "Jag heter [votre nom]"',
    'Dites : "Jag mår bra, tack"',
    'Utilisez : "Jag vill..."',
    'Posez une question avec : "Vad...?"'
  ];
  const hint = hints[Math.floor(Math.random() * hints.length)];
  toast('💡 ' + hint);
}

function endDialogue() {
  if (confirm('Terminer la conversation ?')) {
    appState.dialogue.scenario = null;
    appState.dialogue.messages = [];
    appState.user.xp += 25;
    saveState();
    updateHeaderUI();
    renderDialogue();
    toast('🎉 +25 XP pour la conversation !');
  }
}

// ==================== PROGRESS TAB ====================

function renderProgress() {
  const container = document.getElementById("content-progress");
  
  const totalLessons = Object.values(LESSONS).flat().length;
  const completedLessons = appState.progress.lessonsCompleted.length;
  const lessonsProgress = Math.round((completedLessons / totalLessons) * 100);
  
  const quizAccuracy = appState.progress.quiz.answered > 0 
    ? Math.round((appState.progress.quiz.correct / appState.progress.quiz.answered) * 100)
    : 0;
  
  const wordsLearned = appState.progress.flashcards.learned.length;
  const totalWords = Object.values(FLASHCARDS).flat().length;
  
  container.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-2xl font-extrabold text-slate-800">Votre progression</h3>
        <p class="text-slate-600">Statistiques et exportation</p>
      </div>
      <button onclick="exportPDF()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
        📄 Export PDF
      </button>
    </div>
    
    <div class="grid sm:grid-cols-3 gap-4 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div class="text-sm text-slate-500">XP Total</div>
        <div class="text-4xl font-extrabold text-blue-600 mt-2">${appState.user.xp}</div>
      </div>
      
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div class="text-sm text-slate-500">Série actuelle</div>
        <div class="text-4xl font-extrabold text-orange-600 mt-2">${appState.user.streak} j</div>
      </div>
      
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div class="text-sm text-slate-500">Niveau</div>
        <div class="text-4xl font-extrabold text-green-600 mt-2">${appState.currentLevel}</div>
      </div>
    </div>
    
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
      <h4 class="font-bold text-slate-800 mb-4">Leçons complétées</h4>
      <div class="flex items-center justify-between mb-2">
        <span>${completedLessons} / ${totalLessons} leçons</span>
        <span class="font-bold">${lessonsProgress}%</span>
      </div>
      <div class="bg-slate-200 h-3 rounded-full overflow-hidden">
        <div class="bg-blue-600 h-full transition-all" style="width: ${lessonsProgress}%"></div>
      </div>
    </div>
    
    <div class="grid sm:grid-cols-2 gap-6">
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h4 class="font-bold text-slate-800 mb-4">Quiz</h4>
        <p class="text-slate-700">Réponses : <strong>${appState.progress.quiz.answered}</strong></p>
        <p class="text-slate-700">Correctes : <strong>${appState.progress.quiz.correct}</strong></p>
        <p class="text-slate-700">Précision : <strong class="text-green-600">${quizAccuracy}%</strong></p>
      </div>
      
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h4 class="font-bold text-slate-800 mb-4">Flashcards</h4>
        <p class="text-slate-700">Mots appris : <strong>${wordsLearned} / ${totalWords}</strong></p>
        <div class="mt-3 bg-slate-200 h-3 rounded-full overflow-hidden">
          <div class="bg-green-600 h-full" style="width: ${Math.round((wordsLearned/totalWords)*100)}%"></div>
        </div>
      </div>
    </div>
  `;
}

function exportPDF() {
  const content = generateProgressReport();
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
    <head>
      <title>Rapport de Progression</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #3b82f6; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #3b82f6; color: white; }
      </style>
    </head>
    <body>
      ${content}
      <script>window.print(); window.close();</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function generateProgressReport() {
  return `
    <h1>🇸🇪 Svenska Mästare Pro - Rapport de Progression</h1>
    <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
    
    <h2>Statistiques Générales</h2>
    <ul>
      <li>XP Total : ${appState.user.xp}</li>
      <li>Niveau : ${appState.currentLevel}</li>
      <li>Série : ${appState.user.streak} jours</li>
      <li>Leçons complétées : ${appState.progress.lessonsCompleted.length}</li>
      <li>Questions répondues : ${appState.progress.quiz.answered}</li>
      <li>Taux de réussite : ${appState.progress.quiz.answered > 0 ? Math.round((appState.progress.quiz.correct / appState.progress.quiz.answered) * 100) : 0}%</li>
      <li>Mots appris : ${appState.progress.flashcards.learned.length}</li>
    </ul>
  `;
}

// ==================== SETTINGS ====================

function initSettings() {
  const modal = document.getElementById("settings-modal");
  if (!modal) return;

  // Support both old and new IDs (robuste)
  const btnOpen = document.getElementById("btn-open-settings") || document.getElementById("btn-settings");
  const btnClose = document.getElementById("btn-close-settings"); // optional (HTML may already close via inline onclick)
  const btnSave = document.getElementById("btn-save-settings");
  const btnReset = document.getElementById("btn-reset-all") || document.getElementById("btn-reset");

  const toggleSound = document.getElementById("toggle-sound");
  const toggleAuto = document.getElementById("toggle-auto-next") || document.getElementById("toggle-auto");
  const selectGoal = document.getElementById("select-goal");

  if (btnOpen) {
    btnOpen.onclick = () => {
      if (toggleSound) toggleSound.checked = !!appState.settings.sound;
      if (toggleAuto) toggleAuto.checked = !!appState.settings.autoNext;
      if (selectGoal) selectGoal.value = String(appState.settings.dailyGoal);
      modal.classList.remove("hidden");
    };
  }

  if (btnClose) btnClose.onclick = () => modal.classList.add("hidden");

  if (btnSave) {
    btnSave.onclick = () => {
      if (toggleSound) appState.settings.sound = toggleSound.checked;
      if (toggleAuto) appState.settings.autoNext = toggleAuto.checked;
      if (selectGoal) appState.settings.dailyGoal = parseInt(selectGoal.value, 10) || 20;
      saveState();
      updateHeaderUI();
      modal.classList.add("hidden");
      toast("✅ Paramètres enregistrés");
    };
  }

  if (btnReset) {
    btnReset.onclick = () => {
      if (confirm("⚠️ Réinitialiser toute la progression ?")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    };
  }
}

// ==================== INIT ====================

window.addEventListener('load', () => {
  loadState();
  updateHeaderUI();
  initSettings();
  
  // Bind tabs
  ['learn', 'practice', 'flashcards', 'dialogue', 'progress'].forEach(tab => {
    document.getElementById(`tab-${tab}`).onclick = () => setActiveTab(tab);
  });
  
  // Load first tab
  setActiveTab(appState.currentTab || 'learn');
});
