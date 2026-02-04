/* ============================================
   SVENSKA MÄSTARE PRO — DATA (A1→C2)
   Format: LESSONS[level] = [{ id, title, contentBlocks:[...] }]
   contentBlocks types: dialogue, vocab, pronunciation, grammar, examples, exercises, checklist
   Prononciation: simplifiée francophone (entre parenthèses)
============================================ */

/* -----------------------------
   LESSONS
----------------------------- */

const LESSONS = {
  A1: [
    {
      id: "a1_01",
      title: "Alphabet & sons : Å Ä Ö + voyelles longues/courtes",
      category: "Prononciation",
      icon: "🔤",
      duration: "60–90 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "dialogue",
          title: "Mini-dialogue (pour s’habituer au son)",
          lines: [
            { sv: "Hej!", pron: "héï", fr: "Salut / Bonjour !" },
            { sv: "Hej! Hur mår du?", pron: "héï ! hour mor dou", fr: "Salut ! Comment ça va ?" },
            { sv: "Bra, tack!", pron: "bra, tak", fr: "Bien, merci !" }
          ]
        },
        {
          type: "pronunciation",
          title: "Prononciation (fondations très importantes)",
          html: `
            <div class="rule-box">
              <strong>🎯 Règle n°1 : voyelle longue vs courte</strong><br/>
              En suédois, la <strong>durée</strong> de la voyelle change le mot. <br/>
              <strong>tak</strong> (tôk) = toit / <strong>tack</strong> (tak) = merci.
            </div>

            <h4>Les 29 lettres</h4>
            <p>26 lettres latines + <strong>Å, Ä, Ö</strong> (toujours à la fin de l’alphabet).</p>

            <h4>Å Ä Ö (à mémoriser)</h4>
            <ul>
              <li><strong>Å</strong> ≈ (ô) : <em>åtta</em> (ô-ta) = 8</li>
              <li><strong>Ä</strong> ≈ (è) : <em>här</em> (hèr) = ici</li>
              <li><strong>Ö</strong> ≈ (eu) : <em>öl</em> (eul) = bière</li>
            </ul>

            <h4>Deux sons célèbres (version francophone)</h4>
            <ul>
              <li><strong>sj / stj / skj</strong> : “ch” très soufflé, plus “h” que “ch”. Ex: <em>sju</em> (chuu) = 7</li>
              <li><strong>tj</strong> et <strong>k</strong> devant e/i/y/ä/ö : “tch” doux. Ex: <em>tjugo</em> (tchu-go) = 20</li>
            </ul>

            <div class="example">
              <strong>Astuce</strong> : exagère d’abord les sons (lentement), puis accélère. L’objectif = être compris.
            </div>
          `
        },
        {
          type: "vocab",
          title: "Vocabulaire (avec prononciation)",
          items: [
            { sv: "hej", pron: "héï", fr: "salut / bonjour" },
            { sv: "tack", pron: "tak", fr: "merci" },
            { sv: "bra", pron: "bra", fr: "bien" },
            { sv: "hur", pron: "hour", fr: "comment" },
            { sv: "mår", pron: "mor", fr: "va (aller, se porter)" },
            { sv: "åtta", pron: "ô-ta", fr: "huit" },
            { sv: "här", pron: "hèr", fr: "ici" },
            { sv: "öl", pron: "eul", fr: "bière" }
          ]
        },
        {
          type: "examples",
          title: "Paires minimales (à lire + écouter)",
          items: [
            { sv: "tak / tack", pron: "tôk / tak", fr: "toit / merci" },
            { sv: "ful / full", pron: "foul / foul(l)", fr: "moche / plein (ou “saoul” selon contexte)" },
            { sv: "vit / vitt", pron: "viit / vitt", fr: "blanc (commun) / blanc (neutre)" }
          ]
        },
        {
          type: "exercises",
          title: "Exercices (prononciation)",
          items: [
            "Lis 5 fois : tak – tack – tak – tack (en marquant la voyelle).",
            "Répète : åtta / här / öl (en exagérant la voyelle).",
            "Répète : sju (chuu), sjö (chœ), sjuk (chouk).",
            "Enregistre-toi : 'Hej! Hur mår du? Bra, tack!'"
          ]
        },
        {
          type: "checklist",
          title: "Checklist",
          items: [
            "Je reconnais Å / Ä / Ö.",
            "Je comprends l’idée voyelle longue vs courte.",
            "Je peux dire : Hej! Hur mår du? Bra, tack!"
          ]
        }
      ]
    },

    {
      id: "a1_02",
      title: "Se présenter : nom, origine, langue, lieu",
      category: "Communication",
      icon: "👋",
      duration: "60–90 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "dialogue",
          title: "Dialogue (présentation)",
          lines: [
            { sv: "Hej! Jag heter Alex.", pron: "héï ! ya gué-tèr a-lèks", fr: "Salut ! Je m'appelle Alex." },
            { sv: "Trevligt att träffas!", pron: "tré-vligt att trèf-as", fr: "Enchanté !" },
            { sv: "Varifrån kommer du?", pron: "var-if-ron kom-mèr dou", fr: "Tu viens d’où ?" },
            { sv: "Jag kommer från Frankrike.", pron: "ya kom-mèr fron frank-ri-kè", fr: "Je viens de France." },
            { sv: "Var bor du?", pron: "var bour dou", fr: "Tu habites où ?" },
            { sv: "Jag bor nära Paris.", pron: "ya bour né-ra pa-riss", fr: "J’habite près de Paris." }
          ]
        },
        {
          type: "vocab",
          title: "Vocabulaire",
          items: [
            { sv: "jag", pron: "ya", fr: "je" },
            { sv: "du", pron: "dou", fr: "tu" },
            { sv: "heta", pron: "hé-ta", fr: "s’appeler" },
            { sv: "trevligt", pron: "tré-vligt", fr: "agréable (Enchanté !)" },
            { sv: "träffas", pron: "trèf-as", fr: "se rencontrer" },
            { sv: "varifrån", pron: "var-if-ron", fr: "d’où" },
            { sv: "komma", pron: "kom-ma", fr: "venir" },
            { sv: "från", pron: "fron", fr: "de (origine)" },
            { sv: "var", pron: "var", fr: "où" },
            { sv: "bo", pron: "bou", fr: "habiter" },
            { sv: "nära", pron: "né-ra", fr: "près de" }
          ]
        },
        {
          type: "grammar",
          title: "Grammaire : phrase simple + présent (ultra simple)",
          html: `
            <div class="rule-box">
              <strong>🎯 Présent : 1 seule forme</strong><br/>
              Le verbe ne change pas selon la personne : <em>jag bor</em>, <em>du bor</em>, <em>vi bor</em>…
            </div>

            <h4>3 phrases “automatiques”</h4>
            <ul>
              <li><strong>Jag heter …</strong> = Je m’appelle…</li>
              <li><strong>Jag kommer från …</strong> = Je viens de…</li>
              <li><strong>Jag bor i …</strong> = J’habite à…</li>
            </ul>

            <div class="example">
              <strong>Astuce</strong> : apprends ces 3 phrases par cœur, c’est ton “starter pack”.
            </div>
          `
        },
        {
          type: "examples",
          title: "Exemples (SV → FR)",
          items: [
            { sv: "Jag talar lite svenska.", pron: "ya ta-lar li-tè svèn-ska", fr: "Je parle un peu suédois." },
            { sv: "Jag studerar svenska.", pron: "ya stou-dé-rar svèn-ska", fr: "J’étudie le suédois." },
            { sv: "Jag bor i Frankrike.", pron: "ya bour i frank-ri-kè", fr: "J’habite en France." }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Écris ta présentation (5 phrases) : jag heter / jag kommer från / jag bor i / jag talar / trevligt att träffas.",
            "Lis-la à voix haute 3 fois avec 🔊.",
            "Écris 3 questions : Vad heter du? Var bor du? Varifrån kommer du?"
          ]
        },
        {
          type: "checklist",
          title: "Checklist",
          items: [
            "Je peux me présenter en 4–5 phrases.",
            "Je sais poser 3 questions de base.",
            "Je peux dire d’où je viens et où j’habite."
          ]
        }
      ]
    },

    {
      id: "a1_03",
      title: "EN / ETT : genres + article indéfini",
      category: "Grammaire",
      icon: "📦",
      duration: "75–120 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "grammar",
          title: "Deux genres : en-ord / ett-ord",
          html: `
            <div class="rule-box">
              <strong>🎯 Le suédois a 2 genres</strong><br/>
              <strong>en</strong> (commun, ~75%) et <strong>ett</strong> (neutre, ~25%).
            </div>

            <h4>Article indéfini</h4>
            <ul>
              <li><strong>en</strong> + nom : <em>en bok</em> = un livre</li>
              <li><strong>ett</strong> + nom : <em>ett hus</em> = une maison</li>
            </ul>

            <h4>Important</h4>
            <p>Il faut souvent mémoriser le genre : apprends le nom avec son article (comme un “pack”).</p>

            <div class="example">
              <strong>Exemple</strong> : ne mémorise pas “bok”, mémorise “<em>en bok</em>”.
            </div>
          `
        },
        {
          type: "vocab",
          title: "Vocabulaire (apprends avec l’article)",
          items: [
            { sv: "en bok", pron: "(èn bouk)", fr: "un livre" },
            { sv: "en stol", pron: "(èn stoul)", fr: "une chaise" },
            { sv: "en dag", pron: "(èn dag)", fr: "un jour" },
            { sv: "en vän", pron: "(èn vèn)", fr: "un ami" },
            { sv: "ett hus", pron: "(èt houss)", fr: "une maison" },
            { sv: "ett barn", pron: "(èt barn)", fr: "un enfant" },
            { sv: "ett land", pron: "(èt land)", fr: "un pays" },
            { sv: "ett språk", pron: "(èt sprok)", fr: "une langue" }
          ]
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Det är en bok.", pron: "(dè èr èn bouk)", fr: "C’est un livre." },
            { sv: "Det är ett hus.", pron: "(dè èr èt houss)", fr: "C’est une maison." },
            { sv: "Jag har en vän.", pron: "(ya har èn vèn)", fr: "J’ai un ami." }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Classe : bok, hus, stol, barn, dag, språk (en ou ett).",
            "Crée 6 phrases : Det är en… / Det är ett…",
            "Apprends 8 mots avec article (liste ci-dessus) et récite-les."
          ]
        },
        {
          type: "checklist",
          title: "Checklist",
          items: [
            "Je sais ce que signifie en-ord vs ett-ord.",
            "Je peux dire : Det är en… / Det är ett…",
            "J’apprends mes noms avec l’article."
          ]
        }
      ]
    },

    {
      id: "a1_04",
      title: "Verbes au présent : forme unique + verbes essentiels",
      category: "Grammaire",
      icon: "⚙️",
      duration: "60–90 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "grammar",
          title: "Présent (très simple)",
          html: `
            <div class="rule-box">
              <strong>🎯 Une seule forme au présent</strong><br/>
              <em>jag talar</em>, <em>du talar</em>, <em>vi talar</em>… = même verbe
            </div>

            <h4>Infinitif avec att</h4>
            <p>Les dictionnaires indiquent souvent : <strong>att tala</strong> (= parler).<br/>
            En phrase, on utilise la forme conjuguée : <strong>Jag talar</strong>.</p>

            <h4>3 verbes indispensables</h4>
            <ul>
              <li><strong>att vara</strong> (être) → <strong>är</strong> au présent</li>
              <li><strong>att ha</strong> (avoir) → <strong>har</strong></li>
              <li><strong>att göra</strong> (faire) → <strong>gör</strong></li>
            </ul>
          `
        },
        {
          type: "vocab",
          title: "Verbes A1 (avec pron.)",
          items: [
            { sv: "att vara → är", pron: "(att va-ra → èr)", fr: "être" },
            { sv: "att ha → har", pron: "(att ho → har)", fr: "avoir" },
            { sv: "att göra → gör", pron: "(att yô-ra → yeur)", fr: "faire" },
            { sv: "att tala → talar", pron: "(att ta-la → ta-lar)", fr: "parler" },
            { sv: "att bo → bor", pron: "(att bou → bour)", fr: "habiter" },
            { sv: "att komma → kommer", pron: "(att kom-ma → kom-mèr)", fr: "venir" },
            { sv: "att läsa → läser", pron: "(att lè-sa → lè-sèr)", fr: "lire / étudier" },
            { sv: "att arbeta → arbetar", pron: "(att ar-bè-ta → ar-bè-tar)", fr: "travailler" }
          ]
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Jag är trött.", pron: "(ya èr trœtt)", fr: "Je suis fatigué." },
            { sv: "Jag har en bok.", pron: "(ya har èn bouk)", fr: "J’ai un livre." },
            { sv: "Vi talar svenska.", pron: "(vi ta-lar svèn-ska)", fr: "Nous parlons suédois." },
            { sv: "Han arbetar i Stockholm.", pron: "(han ar-bè-tar i stok-holm)", fr: "Il travaille à Stockholm." }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Conjugue au présent (même forme) : tala, bo, komma, läsa, arbeta.",
            "Traduis : Je suis ici / Tu as un livre / Nous parlons suédois.",
            "Écris 5 phrases : jag + verbe + complément."
          ]
        }
      ]
    },

    {
      id: "a1_05",
      title: "Ordre des mots : règle V2 (verbe en 2e position)",
      category: "Syntaxe",
      icon: "🧠",
      duration: "90–120 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "grammar",
          title: "Règle V2 (la règle reine)",
          html: `
            <div class="rule-box">
              <strong>🎯 En phrase principale : V2</strong><br/>
              Le verbe conjugué est en <strong>2e position</strong> (2e “bloc”, pas forcément 2e mot).
            </div>

            <h4>Cas 1 : phrase normale</h4>
            <p><strong>Sujet + verbe + …</strong></p>
            <ul>
              <li>Jag bor i Paris.</li>
              <li>Du talar svenska.</li>
            </ul>

            <h4>Cas 2 : on met un autre élément au début</h4>
            <p>Si tu commences par “aujourd’hui / ici / en Suède…”, le verbe reste 2e → le sujet se met après le verbe.</p>
            <ul>
              <li><strong>Idag</strong> bor jag i Paris.</li>
              <li><strong>I Sverige</strong> talar de svenska.</li>
            </ul>

            <div class="example">
              ❌ Idag jag bor… → ✅ Idag <strong>bor</strong> jag…
            </div>
          `
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Idag bor jag hemma.", pron: "(i-dag bour ya hèm-ma)", fr: "Aujourd’hui, j’habite à la maison." },
            { sv: "I Sverige talar man svenska.", pron: "(i své-ri-yè ta-lar man svèn-ska)", fr: "En Suède, on parle suédois." },
            { sv: "Nu kommer han.", pron: "(nou kom-mèr han)", fr: "Maintenant, il arrive." }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Transforme en commençant par 'Idag' : Jag arbetar hemma.",
            "Transforme en commençant par 'I Stockholm' : Jag bor här.",
            "Corrige : Nu jag går. (indice : V2)"
          ]
        },
        {
          type: "checklist",
          title: "Checklist",
          items: [
            "Je sais : si je commence par un complément, le verbe reste 2e.",
            "Je peux faire l’inversion verbe + sujet."
          ]
        }
      ]
    },

    {
      id: "a1_06",
      title: "Négation : inte + adverbes fréquents",
      category: "Grammaire",
      icon: "🚫",
      duration: "60–90 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "grammar",
          title: "Négation : inte",
          html: `
            <div class="rule-box">
              <strong>🎯 Règle simple</strong><br/>
              <strong>inte</strong> se place en général <strong>après le verbe conjugué</strong>.
            </div>
            <ul>
              <li>Jag bor <strong>inte</strong> här.</li>
              <li>Idag bor jag <strong>inte</strong> här. (V2 + inte)</li>
            </ul>

            <h4>Adverbes utiles (A1)</h4>
            <ul>
              <li><strong>också</strong> = aussi</li>
              <li><strong>alltid</strong> = toujours</li>
              <li><strong>ofta</strong> = souvent</li>
              <li><strong>ibland</strong> = parfois</li>
              <li><strong>aldrig</strong> = jamais</li>
            </ul>
          `
        },
        {
          type: "vocab",
          title: "Vocabulaire",
          items: [
            { sv: "inte", pron: "(in-tè)", fr: "ne… pas" },
            { sv: "också", pron: "(ok-so)", fr: "aussi" },
            { sv: "alltid", pron: "(al-tid)", fr: "toujours" },
            { sv: "ofta", pron: "(of-ta)", fr: "souvent" },
            { sv: "ibland", pron: "(i-bland)", fr: "parfois" },
            { sv: "aldrig", pron: "(al-dri)", fr: "jamais" }
          ]
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Jag är inte trött.", pron: "(ya èr in-tè trœtt)", fr: "Je ne suis pas fatigué." },
            { sv: "Hon arbetar inte idag.", pron: "(hon ar-bè-tar in-tè i-dag)", fr: "Elle ne travaille pas aujourd’hui." },
            { sv: "Jag bor också här.", pron: "(ya bour ok-so hèr)", fr: "J’habite aussi ici." },
            { sv: "Jag är aldrig sen.", pron: "(ya èr al-dri sèn)", fr: "Je ne suis jamais en retard." }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Ajoute inte : Jag talar svenska. / Han bor här. / Vi arbetar idag.",
            "Traduis : Je ne travaille pas aujourd’hui. / Je suis aussi ici.",
            "Écris 5 phrases avec alltid / ofta / ibland / aldrig."
          ]
        }
      ]
    },

    {
      id: "a1_07",
      title: "Questions : oui/non + mots interrogatifs (vad/var/när/vem)",
      category: "Communication",
      icon: "❓",
      duration: "60–90 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "grammar",
          title: "Questions oui/non (inversion)",
          html: `
            <div class="rule-box">
              <strong>🎯 Question oui/non</strong><br/>
              Souvent : <strong>verbe + sujet</strong> (inversion)
            </div>
            <ul>
              <li>Bor du här?</li>
              <li>Talar du svenska?</li>
              <li>Har du en bil?</li>
            </ul>

            <h4>Mots interrogatifs</h4>
            <ul>
              <li><strong>vad</strong> = quoi</li>
              <li><strong>var</strong> = où</li>
              <li><strong>när</strong> = quand</li>
              <li><strong>vem</strong> = qui</li>
              <li><strong>hur</strong> = comment</li>
            </ul>
          `
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Vad heter du?", pron: "(va gué-tèr dou)", fr: "Comment tu t’appelles ?" },
            { sv: "Var bor du?", pron: "(var bour dou)", fr: "Tu habites où ?" },
            { sv: "När kommer du?", pron: "(nèr kom-mèr dou)", fr: "Tu viens quand ?" },
            { sv: "Vem är han?", pron: "(vèm èr han)", fr: "Qui est-il ?" },
            { sv: "Hur mår du?", pron: "(hour mor dou)", fr: "Comment ça va ?" }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Transforme en questions : Du bor här. / Du talar svenska. / Du har en bok.",
            "Écris 5 questions avec vad/var/när/vem/hur.",
            "Réponds à voix haute : Jag heter… / Jag bor… / Jag kommer från…"
          ]
        }
      ]
    },

    {
      id: "a1_08",
      title: "Nombres, heures, dates (A1 solide)",
      category: "Vocabulaire",
      icon: "🕒",
      duration: "60–90 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "vocab",
          title: "Nombres (0–20) (à écouter)",
          items: [
            { sv: "noll", pron: "(nol)", fr: "0" },
            { sv: "ett", pron: "(èt)", fr: "1" },
            { sv: "två", pron: "(tvo)", fr: "2" },
            { sv: "tre", pron: "(tré)", fr: "3" },
            { sv: "fyra", pron: "(fi-ra)", fr: "4" },
            { sv: "fem", pron: "(fèm)", fr: "5" },
            { sv: "sex", pron: "(sèks)", fr: "6" },
            { sv: "sju", pron: "(chuu)", fr: "7" },
            { sv: "åtta", pron: "(ô-ta)", fr: "8" },
            { sv: "nio", pron: "(ni-o)", fr: "9" },
            { sv: "tio", pron: "(ti-o)", fr: "10" },
            { sv: "elva", pron: "(èl-va)", fr: "11" },
            { sv: "tolv", pron: "(tolv)", fr: "12" },
            { sv: "tretton", pron: "(trèt-ton)", fr: "13" },
            { sv: "fjorton", pron: "(fyor-ton)", fr: "14" },
            { sv: "femton", pron: "(fèm-ton)", fr: "15" },
            { sv: "sexton", pron: "(sèks-ton)", fr: "16" },
            { sv: "sjutton", pron: "(chut-ton)", fr: "17" },
            { sv: "arton", pron: "(ar-ton)", fr: "18" },
            { sv: "nitton", pron: "(nit-ton)", fr: "19" },
            { sv: "tjugo", pron: "(tchu-go)", fr: "20" }
          ]
        },
        {
          type: "grammar",
          title: "Heure et date (modèles A1)",
          html: `
            <h4>Dire l’heure</h4>
            <ul>
              <li><strong>Klockan är tre.</strong> = Il est 3h.</li>
              <li><strong>Klockan är halv fyra.</strong> = Il est 3h30 (la moitié vers 4).</li>
              <li><strong>Klockan är kvart i fyra.</strong> = Il est 3h45 (un quart avant 4).</li>
              <li><strong>Klockan är kvart över tre.</strong> = Il est 3h15 (un quart après 3).</li>
            </ul>

            <h4>Date (simple)</h4>
            <ul>
              <li><strong>Idag är det den 4 februari.</strong> = Aujourd’hui on est le 4 février.</li>
              <li><strong>Jag är född 1997.</strong> = Je suis né en 1997.</li>
            </ul>

            <div class="example">
              <strong>Astuce</strong> : “halv fyra” = 3h30 (pas 4h30).
            </div>
          `
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Klockan är tio.", pron: "(klo-kan èr ti-o)", fr: "Il est 10h." },
            { sv: "Klockan är halv åtta.", pron: "(klo-kan èr halv ô-ta)", fr: "Il est 7h30." },
            { sv: "Idag är det måndag.", pron: "(i-dag èr dè mon-dag)", fr: "Aujourd’hui c’est lundi." }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Dis 5 heures au hasard à voix haute : klockan är…",
            "Traduis : Il est 9h15 / Il est 18h45 / Il est 7h30.",
            "Compter de 1 à 20 sans regarder."
          ]
        }
      ]
    }
  ],

  A2: [
    {
      id: "a2_01",
      title: "Passé simple (preteritum) : raconter hier",
      category: "Grammaire",
      icon: "⏳",
      duration: "90–140 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "dialogue",
          title: "Dialogue (hier / week-end)",
          lines: [
            { sv: "Vad gjorde du igår?", pron: "va you-rè dou i-gor", fr: "Qu’est-ce que tu as fait hier ?" },
            { sv: "Jag jobbade och sen vilade jag.", pron: "ya yo-bba-dé ok sèn vi-la-dé ya", fr: "J’ai travaillé puis je me suis reposé." },
            { sv: "Jag tittade på en film.", pron: "ya tit-ta-dé po èn film", fr: "J’ai regardé un film." }
          ]
        },
        {
          type: "grammar",
          title: "Preteritum (passé) — base A2",
          html: `
            <div class="rule-box">
              <strong>🎯 Pour raconter une action terminée</strong><br/>
              On utilise souvent le <strong>preteritum</strong> (passé simple) : <em>jag jobbade</em> = j’ai travaillé.
            </div>

            <h4>Deux modèles faciles</h4>
            <ul>
              <li>Verbes en -ar au présent → souvent <strong>-ade</strong> au passé : <em>jobbar → jobbade</em></li>
              <li>Verbes en -er → souvent <strong>-de</strong> : <em>tittar → tittade</em> (cas très courant aussi)</li>
            </ul>

            <h4>Verbes irréguliers (à apprendre)</h4>
            <ul>
              <li><strong>är</strong> (est) → <strong>var</strong> (était)</li>
              <li><strong>har</strong> (a) → <strong>hade</strong> (avait)</li>
              <li><strong>gör</strong> (fait) → <strong>gjorde</strong> (a fait)</li>
              <li><strong>kommer</strong> → <strong>kom</strong></li>
              <li><strong>går</strong> → <strong>gick</strong></li>
            </ul>
          `
        },
        {
          type: "vocab",
          title: "Vocabulaire du récit (A2)",
          items: [
            { sv: "igår", pron: "(i-gor)", fr: "hier" },
            { sv: "förra veckan", pron: "(fœ-ra vè-kan)", fr: "la semaine dernière" },
            { sv: "i helgen", pron: "(i hèl-guèn)", fr: "ce week-end" },
            { sv: "sen", pron: "(sèn)", fr: "ensuite / puis" },
            { sv: "jobba", pron: "(yo-bba)", fr: "travailler" },
            { sv: "vila", pron: "(vi-la)", fr: "se reposer" },
            { sv: "titta på", pron: "(tit-ta po)", fr: "regarder (un film, etc.)" }
          ]
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Igår jobbade jag hemma.", pron: "(i-gor yo-bba-dé ya hèm-ma)", fr: "Hier, j’ai travaillé à la maison." },
            { sv: "I helgen var jag i Stockholm.", pron: "(i hèl-guèn var ya i stok-holm)", fr: "Ce week-end, j’étais à Stockholm." },
            { sv: "Jag hade en bra dag.", pron: "(ya ha-dé èn bra dag)", fr: "J’ai eu une bonne journée." }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Écris 5 phrases sur hier (igår) au passé.",
            "Transforme au passé : jag jobbar / jag tittar / jag bor / jag har / jag är.",
            "Raconte ton week-end en 6 phrases (simple)."
          ]
        }
      ]
    },

    {
      id: "a2_02",
      title: "Parfait (har + supinum) : j’ai déjà / j’ai fait",
      category: "Grammaire",
      icon: "✅",
      duration: "90–140 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "grammar",
          title: "Le parfait (A2)",
          html: `
            <div class="rule-box">
              <strong>🎯 Parfait = har + supinum</strong><br/>
              <em>Jag har ätit</em> = J’ai mangé (souvent avec “déjà”, “souvent”, “jamais”…)
            </div>

            <h4>Quand l’utiliser (simplifié)</h4>
            <ul>
              <li>Expérience : “j’ai déjà…”</li>
              <li>Action récente : “je viens de…”</li>
              <li>Résultat : “j’ai fini…”</li>
            </ul>

            <h4>Exemples de supinum fréquents</h4>
            <ul>
              <li>äta → <strong>ätit</strong> (manger → mangé)</li>
              <li>göra → <strong>gjort</strong> (faire → fait)</li>
              <li>läsa → <strong>läst</strong> (lire → lu)</li>
              <li>se → <strong>sett</strong> (voir → vu)</li>
            </ul>
          `
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Jag har redan ätit.", pron: "(ya har ré-dan è-tit)", fr: "J’ai déjà mangé." },
            { sv: "Har du varit i Sverige?", pron: "(har dou va-rit i své-ri-yè)", fr: "Tu es déjà allé en Suède ?" },
            { sv: "Jag har sett den filmen.", pron: "(ya har sèt dèn film-en)", fr: "J’ai vu ce film." }
          ]
        },
        {
          type: "vocab",
          title: "Mots très utiles",
          items: [
            { sv: "redan", pron: "(ré-dan)", fr: "déjà" },
            { sv: "ännu", pron: "(èn-nou)", fr: "encore (pas encore / encore)" },
            { sv: "aldrig", pron: "(al-dri)", fr: "jamais" },
            { sv: "ofta", pron: "(of-ta)", fr: "souvent" }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Crée 5 phrases au parfait avec redan / aldrig / ofta.",
            "Transforme : jag gör → jag har gjort ; jag ser → jag har sett ; jag läser → jag har läst.",
            "Question/réponse : Har du varit i Sverige? (réponds en suédois)."
          ]
        }
      ]
    },

    {
      id: "a2_03",
      title: "Modaux : kan / vill / måste (pouvoir, vouloir, devoir)",
      category: "Grammaire",
      icon: "🧩",
      duration: "75–120 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "grammar",
          title: "Les verbes modaux (A2)",
          html: `
            <div class="rule-box">
              <strong>🎯 Modal + infinitif sans “att”</strong><br/>
              <em>Jag kan tala svenska</em> (pas “att tala”).
            </div>

            <h4>3 modaux essentiels</h4>
            <ul>
              <li><strong>kan</strong> = pouvoir / savoir</li>
              <li><strong>vill</strong> = vouloir</li>
              <li><strong>måste</strong> = devoir (obligation)</li>
            </ul>
          `
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Jag kan prata svenska.", pron: "(ya kan pra-ta svèn-ska)", fr: "Je peux parler suédois." },
            { sv: "Jag vill ha kaffe.", pron: "(ya vill ha ka-fè)", fr: "Je voudrais du café." },
            { sv: "Jag måste jobba idag.", pron: "(ya mœs-tè yo-bba i-dag)", fr: "Je dois travailler aujourd’hui." }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Écris 5 phrases avec kan / vill / måste.",
            "Transforme : Jag talar svenska → Jag kan tala svenska.",
            "Crée 3 phrases : Je veux / Je peux / Je dois."
          ]
        }
      ]
    },

    {
      id: "a2_04",
      title: "Prépositions de lieu : i / på / hos + directions",
      category: "Vocabulaire",
      icon: "🗺️",
      duration: "75–120 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "grammar",
          title: "Prépositions (A2 simple)",
          html: `
            <div class="rule-box">
              <strong>🎯 i / på / hos</strong><br/>
              <strong>i</strong> = dans (pays/ville) ; <strong>på</strong> = sur / à (certains lieux) ; <strong>hos</strong> = chez (personne/soignant)
            </div>

            <ul>
              <li>Jag bor <strong>i</strong> Paris.</li>
              <li>Jag jobbar <strong>på</strong> ett hotell.</li>
              <li>Jag är <strong>hos</strong> min vän.</li>
            </ul>
          `
        },
        {
          type: "vocab",
          title: "Direction / ville",
          items: [
            { sv: "här", pron: "(hèr)", fr: "ici" },
            { sv: "där", pron: "(dèr)", fr: "là-bas" },
            { sv: "vänster", pron: "(vèn-stèr)", fr: "gauche" },
            { sv: "höger", pron: "(hœ-gèr)", fr: "droite" },
            { sv: "rakt fram", pron: "(rakt fram)", fr: "tout droit" },
            { sv: "station", pron: "(sta-chon)", fr: "gare / station" }
          ]
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Var är stationen?", pron: "(var èr sta-chon-en)", fr: "Où est la gare/la station ?" },
            { sv: "Gå rakt fram!", pron: "(go rakt fram)", fr: "Allez tout droit !" },
            { sv: "Sväng vänster.", pron: "(svèng vèn-stèr)", fr: "Tourne à gauche." }
          ]
        },
        {
          type: "exercises",
          title: "Exercices",
          items: [
            "Écris 6 phrases avec i / på / hos.",
            "Donne un itinéraire simple (3 phrases) : rakt fram, vänster, höger.",
            "Pose 3 questions avec var."
          ]
        }
      ]
    }
  ],

  // B1→C2 : présents pour que tout fonctionne.
  // Tu pourras me demander ensuite : “Pack B1 complet ultra détaillé” etc.
  B1: [
    {
      id: "b1_01",
      title: "B1 – Révision V2 + subordonnées (intro)",
      category: "Syntaxe",
      icon: "📚",
      duration: "45–75 min",
      audioAvailable: true,
      contentBlocks: [
        {
          type: "grammar",
          title: "Idée B1",
          html: `
            <p>À B1, on consolide V2 et on commence les structures plus longues (subordonnées, connecteurs).</p>
            <div class="rule-box"><strong>Point clé</strong> : dans une subordonnée, l’ordre change souvent (inte se place différemment).</div>
          `
        },
        {
          type: "examples",
          title: "Exemples",
          items: [
            { sv: "Jag tror att han kommer.", pron: "(ya trour att han kom-mèr)", fr: "Je pense qu’il vient." },
            { sv: "Jag vet att hon inte bor här.", pron: "(ya vét att hon in-tè bour hèr)", fr: "Je sais qu’elle n’habite pas ici." }
          ]
        }
      ]
    }
  ],

  B2: [
    {
      id: "b2_01",
      title: "B2 – Discours rapporté (intro)",
      category: "Communication",
      icon: "🗣️",
      duration: "45–75 min",
      audioAvailable: true,
      contentBlocks: [
        { type: "grammar", title: "Idée B2", html: `<p>À B2, on nuance : discours indirect, style, précision.</p>` }
      ]
    }
  ],

  C1: [
    {
      id: "c1_01",
      title: "C1 – Style & registres (intro)",
      category: "Style",
      icon: "📝",
      duration: "45–75 min",
      audioAvailable: true,
      contentBlocks: [
        { type: "grammar", title: "Idée C1", html: `<p>À C1, on travaille la précision, la fluidité, l’idiomatique.</p>` }
      ]
    }
  ],

  C2: [
    {
      id: "c2_01",
      title: "C2 – Nuances & idiomes (intro)",
      category: "Style",
      icon: "👑",
      duration: "45–75 min",
      audioAvailable: true,
      contentBlocks: [
        { type: "grammar", title: "Idée C2", html: `<p>À C2, on vise la maîtrise : idiomes, sous-entendus, style natif.</p>` }
      ]
    }
  ]
};

/* -----------------------------
   QUESTION BANK (Quiz)
----------------------------- */

const QUESTION_BANK = {
  A1: {
    grammar: [
      {
        id: "a1_g_01",
        type: "multiple-choice",
        category: "EN/ETT",
        question: "Quel article pour 'hus' (maison) ?",
        options: ["en", "ett", "den", "det"],
        correct: 1,
        explanation: "'hus' est un ett-ord : ett hus.",
        hint: "Beaucoup de mots neutres courts sont ett (mais pas tous).",
        points: 10
      },
      {
        id: "a1_g_02",
        type: "multiple-choice",
        category: "V2",
        question: "Choisis la phrase correcte :",
        options: [
          "Idag jag bor i Paris.",
          "Idag bor jag i Paris.",
          "Idag bor i Paris jag.",
          "Idag jag i Paris bor."
        ],
        correct: 1,
        explanation: "Règle V2 : verbe en 2e position → Idag bor jag…",
        hint: "Après 'Idag', le verbe doit venir.",
        points: 12
      },
      {
        id: "a1_g_03",
        type: "multiple-choice",
        category: "Négation",
        question: "Où se place souvent 'inte' ?",
        options: [
          "Avant le verbe",
          "Après le verbe conjugué",
          "Toujours en fin de phrase",
          "Avant le sujet"
        ],
        correct: 1,
        explanation: "En règle générale, 'inte' vient après le verbe conjugué.",
        points: 10
      },
      {
        id: "a1_g_04",
        type: "text",
        category: "Questions",
        question: "Traduis : 'Tu t'appelles comment ?' (forme simple)",
        correctAnswers: ["vad heter du", "vad heter du?"],
        explanation: "La forme naturelle est : Vad heter du?",
        points: 12
      }
    ],
    vocabulary: [
      {
        id: "a1_v_01",
        type: "multiple-choice",
        category: "Vocabulaire",
        question: "Que signifie 'tack' ?",
        options: ["Bonjour", "Merci", "Au revoir", "S'il te plaît"],
        correct: 1,
        explanation: "'tack' = merci.",
        points: 8
      },
      {
        id: "a1_v_02",
        type: "multiple-choice",
        category: "Vocabulaire",
        question: "Que signifie 'var' ?",
        options: ["quoi", "où", "quand", "qui"],
        correct: 1,
        explanation: "'var' = où.",
        points: 8
      }
    ]
  },

  A2: {
    grammar: [
      {
        id: "a2_g_01",
        type: "multiple-choice",
        category: "Passé",
        question: "Quel est le passé de 'är' (être) ?",
        options: ["var", "hade", "gjorde", "kom"],
        correct: 0,
        explanation: "är → var (était).",
        points: 12
      },
      {
        id: "a2_g_02",
        type: "multiple-choice",
        category: "Parfait",
        question: "Complète : Jag har ___ (mangé).",
        options: ["äter", "åt", "ätit", "äta"],
        correct: 2,
        explanation: "Parfait = har + supinum → ätit.",
        points: 12
      },
      {
        id: "a2_g_03",
        type: "multiple-choice",
        category: "Modaux",
        question: "Choisis la phrase correcte :",
        options: [
          "Jag kan att tala svenska.",
          "Jag kan tala svenska.",
          "Jag kan talar svenska.",
          "Jag kan att talar svenska."
        ],
        correct: 1,
        explanation: "Modal + infinitif sans 'att' : Jag kan tala svenska.",
        points: 12
      }
    ],
    vocabulary: [
      {
        id: "a2_v_01",
        type: "multiple-choice",
        category: "Temps",
        question: "Que signifie 'igår' ?",
        options: ["demain", "hier", "aujourd'hui", "ce soir"],
        correct: 1,
        explanation: "igår = hier.",
        points: 8
      }
    ]
  },

  B1: { grammar: [], vocabulary: [] },
  B2: { grammar: [], vocabulary: [] },
  C1: { grammar: [], vocabulary: [] },
  C2: { grammar: [], vocabulary: [] }
};

/* -----------------------------
   FLASHCARDS
----------------------------- */

const FLASHCARDS = {
  basics: [
    { swedish: "hej", french: "salut / bonjour", category: "Bases" },
    { swedish: "tack", french: "merci", category: "Bases" },
    { swedish: "snälla", french: "s'il te plaît", category: "Bases" },
    { swedish: "ja", french: "oui", category: "Bases" },
    { swedish: "nej", french: "non", category: "Bases" },
    { swedish: "ursäkta", french: "excusez-moi", category: "Bases" }
  ],
  numbers: [
    { swedish: "ett", french: "un", category: "Nombres" },
    { swedish: "två", french: "deux", category: "Nombres" },
    { swedish: "tre", french: "trois", category: "Nombres" },
    { swedish: "fyra", french: "quatre", category: "Nombres" },
    { swedish: "fem", french: "cinq", category: "Nombres" }
  ],
  family: [
    { swedish: "mamma", french: "maman", category: "Famille" },
    { swedish: "pappa", french: "papa", category: "Famille" },
    { swedish: "bror", french: "frère", category: "Famille" },
    { swedish: "syster", french: "sœur", category: "Famille" }
  ],
  time: [
    { swedish: "idag", french: "aujourd'hui", category: "Temps" },
    { swedish: "igår", french: "hier", category: "Temps" },
    { swedish: "imorgon", french: "demain", category: "Temps" },
    { swedish: "nu", french: "maintenant", category: "Temps" }
  ]
};

/* -----------------------------
   DIALOGUE SCENARIOS (simulés)
----------------------------- */

const DIALOGUE_SCENARIOS = {
  "Conversation": {
    messages: [
      { role: "ai", text: "Hej! Hur mår du?" },
      { role: "ai", text: "Skriv ett kort svar på svenska 😊" }
    ]
  },
  "Restaurant": {
    messages: [
      { role: "ai", text: "Hej! Vad vill du äta?" },
      { role: "ai", text: "Du kan säga: Jag vill ha..." }
    ]
  },
  "Shopping": {
    messages: [
      { role: "ai", text: "Hej! Kan jag hjälpa dig?" },
      { role: "ai", text: "Du kan säga: Jag letar efter..." }
    ]
  }
};

// Expose globals (au cas où)
window.LESSONS = LESSONS;
window.QUESTION_BANK = QUESTION_BANK;
window.FLASHCARDS = FLASHCARDS;
window.DIALOGUE_SCENARIOS = DIALOGUE_SCENARIOS;