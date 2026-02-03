// svenska-data.js
// Données pédagogiques + quiz (Phase 2 + Phase 3)

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

// ==================== LESSONS ====================

const LESSONS = {
  A1: [
    {
      id: "A1-01",
      title: "Salutations",
      tags: ["vocabulaire"],
      sections: [
        {
          type: "theory",
          title: "Bases",
          text: "Voici quelques salutations tres courantes en suedois."
        },
        {
          type: "examples",
          title: "Exemples",
          examples: [
            { sv: "Hej!", fr: "Bonjour / Salut" },
            { sv: "God morgon!", fr: "Bonjour (matin)" },
            { sv: "Tack!", fr: "Merci" },
            { sv: "Varsagod!", fr: "De rien / Je t'en prie" }
          ]
        }
      ]
    },
    {
      id: "A1-02",
      title: "EN / ETT",
      tags: ["grammaire"],
      sections: [
        {
          type: "theory",
          title: "Genres",
          text: "Les noms suedois sont soit EN (genre commun), soit ETT (neutre). Il faut apprendre le genre avec chaque mot."
        },
        {
          type: "examples",
          title: "Exemples",
          examples: [
            { sv: "en bok", fr: "un livre" },
            { sv: "ett hus", fr: "une maison" },
            { sv: "en stol", fr: "une chaise" }
          ]
        }
      ]
    },
    {
      id: "A1-03",
      title: "Verbes au present",
      tags: ["verbes"],
      sections: [
        {
          type: "theory",
          title: "Regle simple",
          text: "Au present, le verbe a la meme forme pour toutes les personnes."
        },
        {
          type: "examples",
          title: "Exemples",
          examples: [
            { sv: "jag pratar", fr: "je parle" },
            { sv: "du pratar", fr: "tu parles" },
            { sv: "vi pratar", fr: "nous parlons" }
          ]
        }
      ]
    }
  ],

  A2: [
    {
      id: "A2-01",
      title: "Exprimer une action",
      tags: ["phrases"],
      sections: [
        {
          type: "theory",
          title: "Structure",
          text: "Sujet + verbe + complement. L'ordre est important."
        }
      ]
    }
  ],

  B1: [],
  B2: [],
  C1: [],
  C2: []
};

// ==================== QUESTIONS QUIZ ====================

const QUESTIONS = [
  {
    id: "Q1",
    level: "A1",
    category: "grammar",
    type: "mcq",
    prompt: "Quel article pour 'hus' ?",
    choices: ["en", "ett"],
    answer: "ett",
    explanation: "On dit 'ett hus'."
  },
  {
    id: "Q2",
    level: "A1",
    category: "grammar",
    type: "mcq",
    prompt: "Quel article pour 'bok' ?",
    choices: ["en", "ett"],
    answer: "en",
    explanation: "On dit 'en bok'."
  },
  {
    id: "Q3",
    level: "A1",
    category: "vocab",
    type: "mcq",
    prompt: "Que signifie 'Tack' ?",
    choices: ["Bonjour", "Merci", "Au revoir"],
    answer: "Merci",
    explanation: "'Tack' signifie merci."
  },
  {
    id: "Q4",
    level: "A1",
    category: "vocab",
    type: "free",
    prompt: "Traduis en suedois : Bonjour",
    answer: "hej",
    acceptable: ["hej", "hej!"],
    explanation: "La traduction simple est 'Hej!'."
  },
  {
    id: "Q5",
    level: "A2",
    category: "grammar",
    type: "mcq",
    prompt: "Combien de formes au present ?",
    choices: ["1", "2", "6"],
    answer: "1",
    explanation: "Une seule forme par verbe."
  }
];
