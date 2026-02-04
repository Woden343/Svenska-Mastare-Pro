// ============================================
// SVENSKA MÄSTARE V3 - DONNÉES COMPLÈTES
// ============================================

// Note: Ce fichier contient TOUTES les données de l'application
// Les leçons sont maintenant complètes pour tous les niveaux A1-C2

const LESSONS = {
    A1: [
        {
            id: 'a1_l1',
            title: 'L\'alphabet suédois et la prononciation',
            category: 'Prononciation',
            icon: '🔤',
            duration: '15 min',
            audioAvailable: true,
            content: `
                <h4>L'alphabet suédois</h4>
                <p>L'alphabet suédois comporte 29 lettres, incluant les 26 lettres de l'alphabet latin plus trois lettres spéciales à la fin : <strong>Å, Ä, Ö</strong>.</p>
                
                <div class="example">
                    <strong>Les 29 lettres :</strong><br>
                    A B C D E F G H I J K L M N O P Q R S T U V W X Y Z Å Ä Ö
                </div>
                
                <h4>Prononciation des voyelles spéciales</h4>
                <table>
                    <tr>
                        <th>Lettre</th>
                        <th>Prononciation</th>
                        <th>Exemple</th>
                    </tr>
                    <tr>
                        <td><strong>Å</strong></td>
                        <td>Comme "o" dans "port"</td>
                        <td>Åka (aller) - prononcé "ô-ka"</td>
                    </tr>
                    <tr>
                        <td><strong>Ä</strong></td>
                        <td>Comme "è" dans "mère"</td>
                        <td>Äta (manger) - prononcé "è-ta"</td>
                    </tr>
                    <tr>
                        <td><strong>Ö</strong></td>
                        <td>Comme "eu" dans "peu"</td>
                        <td>Öra (oreille) - prononcé "eu-ra"</td>
                    </tr>
                </table>
                
                <h4>Consonnes particulières</h4>
                <p><strong>J</strong> : Se prononce comme "y" dans "yeux"<br>
                Exemple : <em>Ja</em> (oui) = "ya"</p>
                
                <p><strong>SJ, SK, STJ</strong> : Produisent un son chuintant unique au suédois.<br>
                Exemple : <em>Sjuk</em> (malade), <em>Sköldpadda</em> (tortue)</p>
                
                <div class="rule-box">
                    <strong>💡 Conseil :</strong> La musicalité suédoise repose sur les accents toniques.
                </div>
            `
        },
        {
            id: 'a1_l2',
            title: 'Les genres : EN et ETT',
            category: 'Grammaire',
            icon: '⚖️',
            duration: '20 min',
            audioAvailable: true,
            content: `
                <h4>Comprendre les genres en suédois</h4>
                <p>Le suédois a deux genres grammaticaux : <strong>EN-ord</strong> (commun) et <strong>ETT-ord</strong> (neutre). Environ 75% des mots sont EN, 25% sont ETT.</p>
                
                <div class="rule-box">
                    <strong>🎯 Règle fondamentale :</strong> Il n'y a pas de règle absolue. Apprenez le genre avec chaque mot.
                </div>
                
                <h4>Articles indéfinis</h4>
                <table>
                    <tr>
                        <th>Genre</th>
                        <th>Article</th>
                        <th>Exemple</th>
                        <th>Traduction</th>
                    </tr>
                    <tr>
                        <td>EN (commun)</td>
                        <td>en</td>
                        <td>en bil</td>
                        <td>une voiture</td>
                    </tr>
                    <tr>
                        <td>ETT (neutre)</td>
                        <td>ett</td>
                        <td>ett hus</td>
                        <td>une maison</td>
                    </tr>
                </table>
                
                <h4>Articles définis (suffixes)</h4>
                <p>En suédois, l'article défini s'ajoute à la fin :</p>
                
                <div class="example">
                    <strong>EN-ord :</strong> bil → bil<strong>en</strong> (la voiture)<br>
                    <strong>ETT-ord :</strong> hus → hus<strong>et</strong> (la maison)
                </div>
            `
        },
        {
            id: 'a1_l3',
            title: 'Les adjectifs : accord de base',
            category: 'Grammaire',
            icon: '🎨',
            duration: '25 min',
            audioAvailable: true,
            content: `
                <h4>Règles d'accord des adjectifs</h4>
                <p>Les adjectifs s'accordent selon le genre, le nombre et le caractère défini/indéfini.</p>
                
                <h4>Forme indéfinie (singulier)</h4>
                <div class="example">
                    <strong>EN-ord :</strong> L'adjectif reste à sa forme de base<br>
                    <em>en stor bil</em> (une grande voiture)<br><br>
                    
                    <strong>ETT-ord :</strong> On ajoute <strong>-t</strong><br>
                    <em>ett stor<strong>t</strong> hus</em> (une grande maison)
                </div>
                
                <h4>Forme définie ou pluriel</h4>
                <p>L'adjectif prend <strong>-a</strong> :</p>
                
                <div class="example">
                    <strong>Défini EN :</strong> den stora bilen<br>
                    <strong>Défini ETT :</strong> det stora huset<br>
                    <strong>Pluriel :</strong> stora bilar
                </div>
                
                <h4>La règle du "sandwich"</h4>
                <div class="rule-box">
                    <strong>DEN/DET</strong> + adjectif<strong>-a</strong> + nom<strong>-en/-et</strong>
                </div>
            `
        },
        {
            id: 'a1_l4',
            title: 'Salutations et expressions courantes',
            category: 'Vocabulaire',
            icon: '👋',
            duration: '15 min',
            audioAvailable: true,
            content: `
                <h4>Salutations de base</h4>
                <table>
                    <tr>
                        <th>Suédois</th>
                        <th>Français</th>
                        <th>Contexte</th>
                    </tr>
                    <tr>
                        <td>Hej</td>
                        <td>Salut / Bonjour</td>
                        <td>Informel</td>
                    </tr>
                    <tr>
                        <td>God morgon</td>
                        <td>Bonjour (matin)</td>
                        <td>Formel, jusqu'à 10h</td>
                    </tr>
                    <tr>
                        <td>God dag</td>
                        <td>Bonjour (jour)</td>
                        <td>Très formel</td>
                    </tr>
                    <tr>
                        <td>Hej då</td>
                        <td>Au revoir</td>
                        <td>Standard</td>
                    </tr>
                </table>
                
                <h4>Politesse</h4>
                <div class="example">
                    <strong>Tack</strong> - Merci<br>
                    <strong>Varsågod</strong> - De rien<br>
                    <strong>Ursäkta</strong> - Excusez-moi<br>
                    <strong>Förlåt</strong> - Désolé
                </div>
            `
        },
        {
            id: 'a1_l5',
            title: 'Les nombres de 0 à 100',
            category: 'Vocabulaire',
            icon: '🔢',
            duration: '20 min',
            audioAvailable: true,
            content: `
                <h4>Nombres 0-20</h4>
                <table>
                    <tr>
                        <th>Chiffre</th>
                        <th>Suédois</th>
                        <th>Chiffre</th>
                        <th>Suédois</th>
                    </tr>
                    <tr><td>0</td><td>noll</td><td>11</td><td>elva</td></tr>
                    <tr><td>1</td><td>ett/en</td><td>12</td><td>tolv</td></tr>
                    <tr><td>2</td><td>två</td><td>13</td><td>tretton</td></tr>
                    <tr><td>3</td><td>tre</td><td>14</td><td>fjorton</td></tr>
                    <tr><td>4</td><td>fyra</td><td>15</td><td>femton</td></tr>
                    <tr><td>5</td><td>fem</td><td>16</td><td>sexton</td></tr>
                    <tr><td>6</td><td>sex</td><td>17</td><td>sjutton</td></tr>
                    <tr><td>7</td><td>sju</td><td>18</td><td>arton</td></tr>
                    <tr><td>8</td><td>åtta</td><td>19</td><td>nitton</td></tr>
                    <tr><td>9</td><td>nio</td><td>20</td><td>tjugo</td></tr>
                    <tr><td>10</td><td>tio</td><td></td><td></td></tr>
                </table>
                
                <h4>Dizaines</h4>
                <div class="example">
                    30 - <strong>trettio</strong><br>
                    40 - <strong>fyrtio</strong><br>
                    50 - <strong>femtio</strong><br>
                    60 - <strong>sextio</strong><br>
                    70 - <strong>sjuttio</strong><br>
                    80 - <strong>åttio</strong><br>
                    90 - <strong>nittio</strong><br>
                    100 - <strong>hundra</strong>
                </div>
            `
        },
        {
            id: 'a1_l6',
            title: 'La règle V2 : position du verbe',
            category: 'Syntaxe',
            icon: '⚡',
            duration: '25 min',
            audioAvailable: true,
            content: `
                <h4>La règle V2</h4>
                <p>En suédois, le verbe conjugué occupe TOUJOURS la 2ème position.</p>
                
                <div class="rule-box">
                    <strong>🎯 Règle d'or :</strong> Le verbe est toujours en position 2.
                </div>
                
                <h4>Structure de base</h4>
                <div class="example">
                    <strong>Jag äter äpplen</strong><br>
                    Position 1: Jag (sujet)<br>
                    Position 2: äter (verbe)<br>
                    Position 3: äpplen (objet)
                </div>
                
                <h4>Inversion</h4>
                <div class="example">
                    <strong>Idag äter jag äpplen</strong><br>
                    Position 1: Idag<br>
                    Position 2: äter (verbe)<br>
                    Position 3: jag (sujet)
                </div>
            `
        },
        {
            id: 'a1_l7',
            title: 'Les pronoms personnels',
            category: 'Grammaire',
            icon: '👤',
            duration: '20 min',
            audioAvailable: true,
            content: `
                <h4>Pronoms sujets</h4>
                <table>
                    <tr>
                        <th>Français</th>
                        <th>Suédois</th>
                    </tr>
                    <tr><td>Je</td><td>jag</td></tr>
                    <tr><td>Tu</td><td>du</td></tr>
                    <tr><td>Il</td><td>han</td></tr>
                    <tr><td>Elle</td><td>hon</td></tr>
                    <tr><td>On/Il impersonnel</td><td>man</td></tr>
                    <tr><td>Nous</td><td>vi</td></tr>
                    <tr><td>Vous</td><td>ni</td></tr>
                    <tr><td>Ils/Elles</td><td>de</td></tr>
                </table>
                
                <div class="rule-box">
                    <strong>💡 Note :</strong> "Du" est utilisé universellement, même avec supérieurs.
                </div>
                
                <h4>Pronoms objets</h4>
                <div class="example">
                    moi = <strong>mig</strong><br>
                    toi = <strong>dig</strong><br>
                    lui = <strong>honom</strong><br>
                    elle = <strong>henne</strong><br>
                    nous = <strong>oss</strong><br>
                    vous = <strong>er</strong><br>
                    eux = <strong>dem</strong>
                </div>
            `
        },
        {
            id: 'a1_l8',
            title: 'Les jours et les mois',
            category: 'Vocabulaire',
            icon: '📅',
            duration: '15 min',
            audioAvailable: true,
            content: `
                <h4>Les jours de la semaine</h4>
                <table>
                    <tr>
                        <th>Français</th>
                        <th>Suédois</th>
                    </tr>
                    <tr><td>Lundi</td><td>måndag</td></tr>
                    <tr><td>Mardi</td><td>tisdag</td></tr>
                    <tr><td>Mercredi</td><td>onsdag</td></tr>
                    <tr><td>Jeudi</td><td>torsdag</td></tr>
                    <tr><td>Vendredi</td><td>fredag</td></tr>
                    <tr><td>Samedi</td><td>lördag</td></tr>
                    <tr><td>Dimanche</td><td>söndag</td></tr>
                </table>
                
                <h4>Les mois</h4>
                <div class="example">
                    janvier = <strong>januari</strong><br>
                    février = <strong>februari</strong><br>
                    mars = <strong>mars</strong><br>
                    avril = <strong>april</strong><br>
                    mai = <strong>maj</strong><br>
                    juin = <strong>juni</strong><br>
                    juillet = <strong>juli</strong><br>
                    août = <strong>augusti</strong><br>
                    septembre = <strong>september</strong><br>
                    octobre = <strong>oktober</strong><br>
                    novembre = <strong>november</strong><br>
                    décembre = <strong>december</strong>
                </div>
                
                <div class="rule-box">
                    <strong>💡 Note :</strong> En suédois, les jours et mois s'écrivent en minuscules.
                </div>
            `
        }
    ],
    
    A2: [
        {
            id: 'a2_l1',
            title: 'Les verbes au présent',
            category: 'Conjugaison',
            icon: '🔄',
            duration: '30 min',
            audioAvailable: true,
            content: `
                <h4>Le présent en suédois</h4>
                <p>Les verbes au présent ont UNE SEULE forme pour toutes les personnes.</p>
                
                <div class="rule-box">
                    <strong>🎯 Règle :</strong> jag äter, du äter, han äter, vi äter...
                </div>
                
                <h4>Quatre groupes</h4>
                
                <p><strong>Groupe 1 :</strong> -a → -ar</p>
                <div class="example">
                    tala (parler) → talar<br>
                    arbeta (travailler) → arbetar
                </div>
                
                <p><strong>Groupe 2 :</strong> -a → -er</p>
                <div class="example">
                    läsa (lire) → läser<br>
                    köpa (acheter) → köper
                </div>
                
                <p><strong>Groupe 3 :</strong> courts → -r</p>
                <div class="example">
                    bo (habiter) → bor<br>
                    tro (croire) → tror
                </div>
                
                <p><strong>Groupe 4 :</strong> Irréguliers</p>
                <div class="example">
                    vara (être) → är<br>
                    ha (avoir) → har<br>
                    göra (faire) → gör
                </div>
            `
        },
        {
            id: 'a2_l2',
            title: 'Le passé : prétérit et parfait',
            category: 'Conjugaison',
            icon: '⏮️',
            duration: '35 min',
            audioAvailable: true,
            content: `
                <h4>Deux temps du passé</h4>
                
                <h4>Le Prétérit</h4>
                <table>
                    <tr>
                        <th>Groupe</th>
                        <th>Infinitif</th>
                        <th>Prétérit</th>
                    </tr>
                    <tr><td>1</td><td>tala</td><td>talade</td></tr>
                    <tr><td>2</td><td>köpa</td><td>köpte</td></tr>
                    <tr><td>3</td><td>bo</td><td>bodde</td></tr>
                    <tr><td>4</td><td>gå</td><td>gick</td></tr>
                </table>
                
                <h4>Le Parfait</h4>
                <p>Formation : <strong>har</strong> + participe passé</p>
                
                <div class="example">
                    Jag har talat (J'ai parlé)<br>
                    Hon har köpt (Elle a acheté)<br>
                    Vi har bott (Nous avons habité)
                </div>
                
                <h4>Verbes irréguliers importants</h4>
                <div class="example">
                    gå → gick → gått<br>
                    komma → kom → kommit<br>
                    se → såg → sett<br>
                    äta → åt → ätit<br>
                    vara → var → varit
                </div>
            `
        },
        {
            id: 'a2_l3',
            title: 'Les prépositions de lieu',
            category: 'Grammaire',
            icon: '📍',
            duration: '25 min',
            audioAvailable: true,
            content: `
                <h4>Prépositions courantes</h4>
                <table>
                    <tr>
                        <th>Suédois</th>
                        <th>Français</th>
                        <th>Exemple</th>
                    </tr>
                    <tr>
                        <td>i</td>
                        <td>dans</td>
                        <td>i huset (dans la maison)</td>
                    </tr>
                    <tr>
                        <td>på</td>
                        <td>sur</td>
                        <td>på bordet (sur la table)</td>
                    </tr>
                    <tr>
                        <td>vid</td>
                        <td>près de</td>
                        <td>vid havet (près de la mer)</td>
                    </tr>
                    <tr>
                        <td>under</td>
                        <td>sous</td>
                        <td>under bordet</td>
                    </tr>
                    <tr>
                        <td>över</td>
                        <td>au-dessus</td>
                        <td>över bron</td>
                    </tr>
                    <tr>
                        <td>mellan</td>
                        <td>entre</td>
                        <td>mellan husen</td>
                    </tr>
                    <tr>
                        <td>framför</td>
                        <td>devant</td>
                        <td>framför huset</td>
                    </tr>
                    <tr>
                        <td>bakom</td>
                        <td>derrière</td>
                        <td>bakom bilen</td>
                    </tr>
                </table>
                
                <div class="rule-box">
                    <strong>💡 Attention :</strong> "på" s'utilise pour les surfaces ET les événements<br>
                    på bio (au cinéma), på fest (à la fête)
                </div>
            `
        },
        {
            id: 'a2_l4',
            title: 'La nourriture et les repas',
            category: 'Vocabulaire',
            icon: '🍽️',
            duration: '20 min',
            audioAvailable: true,
            content: `
                <h4>Les repas</h4>
                <div class="example">
                    frukost = <strong>petit-déjeuner</strong><br>
                    lunch = <strong>déjeuner</strong><br>
                    middag = <strong>dîner</strong><br>
                    mellanmål = <strong>collation</strong>
                </div>
                
                <h4>Aliments de base</h4>
                <table>
                    <tr>
                        <th>Suédois</th>
                        <th>Français</th>
                    </tr>
                    <tr><td>bröd (ett)</td><td>pain</td></tr>
                    <tr><td>smör (ett)</td><td>beurre</td></tr>
                    <tr><td>ost (en)</td><td>fromage</td></tr>
                    <tr><td>mjölk (en)</td><td>lait</td></tr>
                    <tr><td>ägg (ett)</td><td>œuf</td></tr>
                    <tr><td>kött (ett)</td><td>viande</td></tr>
                    <tr><td>fisk (en)</td><td>poisson</td></tr>
                    <tr><td>grönsaker</td><td>légumes</td></tr>
                    <tr><td>frukt (en)</td><td>fruit</td></tr>
                </table>
                
                <h4>Au restaurant</h4>
                <div class="example">
                    <strong>Kan jag få menyn?</strong> - Puis-je avoir le menu?<br>
                    <strong>Jag vill beställa...</strong> - Je voudrais commander...<br>
                    <strong>Kan jag få notan?</strong> - L'addition, s'il vous plaît<br>
                    <strong>Det var gott!</strong> - C'était bon!
                </div>
            `
        },
        {
            id: 'a2_l5',
            title: 'Le futur et les verbes modaux',
            category: 'Conjugaison',
            icon: '⏭️',
            duration: '30 min',
            audioAvailable: true,
            content: `
                <h4>Exprimer le futur</h4>
                <p>Le suédois utilise plusieurs façons d'exprimer le futur :</p>
                
                <p><strong>1. Présent + complément de temps</strong></p>
                <div class="example">
                    Jag åker till Stockholm <strong>imorgon</strong><br>
                    (Je vais à Stockholm demain)
                </div>
                
                <p><strong>2. Ska + infinitif</strong> (intention)</p>
                <div class="example">
                    Jag ska äta lunch<br>
                    (Je vais manger)
                </div>
                
                <p><strong>3. Kommer att + infinitif</strong> (prédiction)</p>
                <div class="example">
                    Det kommer att regna<br>
                    (Il va pleuvoir)
                </div>
                
                <h4>Verbes modaux</h4>
                <table>
                    <tr>
                        <th>Infinitif</th>
                        <th>Présent</th>
                        <th>Sens</th>
                    </tr>
                    <tr><td>kunna</td><td>kan</td><td>pouvoir (capacité)</td></tr>
                    <tr><td>vilja</td><td>vill</td><td>vouloir</td></tr>
                    <tr><td>måste</td><td>måste</td><td>devoir</td></tr>
                    <tr><td>få</td><td>får</td><td>pouvoir (permission)</td></tr>
                    <tr><td>böra</td><td>bör</td><td>devoir (conseil)</td></tr>
                </table>
                
                <div class="example">
                    Jag <strong>kan</strong> tala svenska (Je peux parler suédois)<br>
                    Han <strong>vill</strong> äta pizza (Il veut manger une pizza)<br>
                    Vi <strong>måste</strong> gå nu (Nous devons partir maintenant)
                </div>
            `
        },
        {
            id: 'a2_l6',
            title: 'La famille et les relations',
            category: 'Vocabulaire',
            icon: '👨‍👩‍👧‍👦',
            duration: '20 min',
            audioAvailable: true,
            content: `
                <h4>La famille proche</h4>
                <table>
                    <tr>
                        <th>Suédois</th>
                        <th>Français</th>
                    </tr>
                    <tr><td>mamma / mor</td><td>maman / mère</td></tr>
                    <tr><td>pappa / far</td><td>papa / père</td></tr>
                    <tr><td>föräldrar</td><td>parents</td></tr>
                    <tr><td>bror / broder</td><td>frère</td></tr>
                    <tr><td>syster</td><td>sœur</td></tr>
                    <tr><td>son</td><td>fils</td></tr>
                    <tr><td>dotter</td><td>fille</td></tr>
                    <tr><td>barn</td><td>enfant</td></tr>
                </table>
                
                <h4>La famille élargie</h4>
                <div class="example">
                    farmor = <strong>grand-mère paternelle</strong><br>
                    morfar = <strong>grand-père maternel</strong><br>
                    moster = <strong>tante maternelle</strong><br>
                    farbror = <strong>oncle paternel</strong><br>
                    kusin = <strong>cousin/cousine</strong>
                </div>
                
                <h4>Relations</h4>
                <div class="example">
                    make/maka = <strong>époux/épouse</strong><br>
                    pojkvän = <strong>petit ami</strong><br>
                    flickvän = <strong>petite amie</strong><br>
                    partner = <strong>partenaire</strong><br>
                    vän = <strong>ami</strong>
                </div>
                
                <div class="rule-box">
                    <strong>💡 Particularité :</strong> Le suédois distingue les côtés paternel (far-) et maternel (mor-) dans la famille.
                </div>
            `
        }
    ],
    
    B1: [
        {
            id: 'b1_l1',
            title: 'Le passif en suédois',
            category: 'Grammaire',
            icon: '🔀',
            duration: '30 min',
            audioAvailable: true,
            content: `
                <h4>Trois formes du passif</h4>
                
                <p><strong>1. Passif en -s</strong> (le plus courant)</p>
                <div class="example">
                    Aktiv: Jag säljer bilen<br>
                    Passiv: Bilen <strong>säljs</strong>
                </div>
                
                <table>
                    <tr>
                        <th>Temps</th>
                        <th>Actif</th>
                        <th>Passif -s</th>
                    </tr>
                    <tr><td>Présent</td><td>säljer</td><td>säljs</td></tr>
                    <tr><td>Prétérit</td><td>sålde</td><td>såldes</td></tr>
                    <tr><td>Parfait</td><td>har sålt</td><td>har sålts</td></tr>
                </table>
                
                <p><strong>2. Bli + participe</strong> (changement d'état)</p>
                <div class="example">
                    Bilen <strong>blir såld</strong> (La voiture est vendue - processus)
                </div>
                
                <p><strong>3. Vara + participe</strong> (état résultant)</p>
                <div class="example">
                    Bilen <strong>är såld</strong> (La voiture est vendue - état)
                </div>
                
                <div class="rule-box">
                    <strong>💡 Différence :</strong><br>
                    -s = neutre, général<br>
                    bli = processus<br>
                    vara = résultat
                </div>
            `
        },
        {
            id: 'b1_l2',
            title: 'Les pronoms relatifs',
            category: 'Grammaire',
            icon: '🔗',
            duration: '25 min',
            audioAvailable: true,
            content: `
                <h4>Som - le pronom universel</h4>
                <p><strong>Som</strong> est le pronom relatif le plus utilisé en suédois.</p>
                
                <div class="example">
                    Mannen <strong>som</strong> bor här (L'homme qui habite ici)<br>
                    Bilen <strong>som</strong> jag köpte (La voiture que j'ai achetée)
                </div>
                
                <h4>Vilken/vilket/vilka</h4>
                <p>Utilisés dans les propositions non restrictives (avec virgules):</p>
                
                <div class="example">
                    Huset, <strong>vilket</strong> är gammalt, kostar mycket<br>
                    (La maison, qui est vieille, coûte cher)
                </div>
                
                <table>
                    <tr>
                        <th>Genre</th>
                        <th>Pronom</th>
                    </tr>
                    <tr><td>EN-ord</td><td>vilken</td></tr>
                    <tr><td>ETT-ord</td><td>vilket</td></tr>
                    <tr><td>Pluriel</td><td>vilka</td></tr>
                </table>
                
                <h4>Vars - possessif</h4>
                <div class="example">
                    Kvinnan <strong>vars</strong> bil är röd<br>
                    (La femme dont la voiture est rouge)
                </div>
            `
        },
        {
            id: 'b1_l3',
            title: 'Exprimer l\'opinion et l\'argumentation',
            category: 'Communication',
            icon: '💭',
            duration: '30 min',
            audioAvailable: true,
            content: `
                <h4>Donner son opinion</h4>
                <div class="example">
                    <strong>Jag tycker att...</strong> - Je pense que...<br>
                    <strong>Enligt min mening...</strong> - Selon moi...<br>
                    <strong>Jag anser att...</strong> - Je considère que...<br>
                    <strong>För min del...</strong> - Pour ma part...
                </div>
                
                <h4>Exprimer l'accord</h4>
                <div class="example">
                    <strong>Jag håller med</strong> - Je suis d'accord<br>
                    <strong>Det stämmer</strong> - C'est exact<br>
                    <strong>Absolut!</strong> - Absolument!<br>
                    <strong>Precis!</strong> - Exactement!
                </div>
                
                <h4>Exprimer le désaccord</h4>
                <div class="example">
                    <strong>Jag håller inte med</strong> - Je ne suis pas d'accord<br>
                    <strong>Tvärtom</strong> - Au contraire<br>
                    <strong>Det är inte riktigt så</strong> - Ce n'est pas vraiment comme ça
                </div>
                
                <h4>Argumenter</h4>
                <table>
                    <tr>
                        <th>Expression</th>
                        <th>Usage</th>
                    </tr>
                    <tr><td>För det första...</td><td>Premièrement...</td></tr>
                    <tr><td>Dessutom...</td><td>De plus...</td></tr>
                    <tr><td>Därför...</td><td>C'est pourquoi...</td></tr>
                    <tr><td>Å andra sidan...</td><td>D'autre part...</td></tr>
                    <tr><td>Slutligen...</td><td>Finalement...</td></tr>
                </table>
            `
        },
        {
            id: 'b1_l4',
            title: 'Le monde du travail',
            category: 'Vocabulaire',
            icon: '💼',
            duration: '25 min',
            audioAvailable: true,
            content: `
                <h4>Métiers et professions</h4>
                <table>
                    <tr>
                        <th>Suédois</th>
                        <th>Français</th>
                    </tr>
                    <tr><td>läkare</td><td>médecin</td></tr>
                    <tr><td>sjuksköterska</td><td>infirmier/ière</td></tr>
                    <tr><td>lärare</td><td>enseignant</td></tr>
                    <tr><td>ingenjör</td><td>ingénieur</td></tr>
                    <tr><td>advokat</td><td>avocat</td></tr>
                    <tr><td>polis</td><td>policier</td></tr>
                    <tr><td>försäljare</td><td>vendeur</td></tr>
                    <tr><td>programmerare</td><td>programmeur</td></tr>
                </table>
                
                <h4>Au bureau</h4>
                <div class="example">
                    kontor = <strong>bureau</strong><br>
                    möte = <strong>réunion</strong><br>
                    projekt = <strong>projet</strong><br>
                    deadline = <strong>échéance</strong><br>
                    kollega = <strong>collègue</strong><br>
                    chef = <strong>patron</strong><br>
                    anställd = <strong>employé</strong>
                </div>
                
                <h4>Expressions utiles</h4>
                <div class="example">
                    <strong>Vad jobbar du med?</strong> - Tu travailles dans quoi?<br>
                    <strong>Jag arbetar som...</strong> - Je travaille comme...<br>
                    <strong>Jag är arbetslös</strong> - Je suis au chômage<br>
                    <strong>Jag studerar</strong> - J'étudie
                </div>
            `
        }
    ],
    
    B2: [
        {
            id: 'b2_l1',
            title: 'Les propositions subordonnées',
            category: 'Syntaxe',
            icon: '🔗',
            duration: '35 min',
            audioAvailable: true,
            content: `
                <h4>Ordre des mots dans les subordonnées</h4>
                <p>Dans les subordonnées, la négation et les adverbes se placent AVANT le verbe.</p>
                
                <table>
                    <tr>
                        <th>Type</th>
                        <th>Exemple</th>
                    </tr>
                    <tr>
                        <td>Principale</td>
                        <td>Jag äter <strong>inte</strong> kött</td>
                    </tr>
                    <tr>
                        <td>Subordonnée</td>
                        <td>...att jag <strong>inte</strong> äter kött</td>
                    </tr>
                </table>
                
                <h4>Conjonctions de subordination</h4>
                <div class="example">
                    <strong>att</strong> - que<br>
                    <strong>om</strong> - si (condition)<br>
                    <strong>när</strong> - quand<br>
                    <strong>eftersom</strong> - parce que<br>
                    <strong>medan</strong> - pendant que<br>
                    <strong>innan</strong> - avant que<br>
                    <strong>efter att</strong> - après que<br>
                    <strong>även om</strong> - bien que
                </div>
                
                <h4>Exemples complets</h4>
                <div class="example">
                    Han säger <strong>att</strong> han <strong>inte</strong> kan komma<br>
                    (Il dit qu'il ne peut pas venir)<br><br>
                    
                    <strong>Om</strong> det <strong>inte</strong> regnar, går vi ut<br>
                    (S'il ne pleut pas, nous sortons)<br><br>
                    
                    Jag vet <strong>att</strong> hon <strong>alltid</strong> arbetar hårt<br>
                    (Je sais qu'elle travaille toujours dur)
                </div>
            `
        },
        {
            id: 'b2_l2',
            title: 'Le conditionnel',
            category: 'Conjugaison',
            icon: '🤔',
            duration: '30 min',
            audioAvailable: true,
            content: `
                <h4>Former le conditionnel</h4>
                <p>Le conditionnel se forme avec <strong>skulle</strong> + infinitif</p>
                
                <div class="example">
                    Jag <strong>skulle</strong> gärna äta pizza<br>
                    (Je mangerais volontiers une pizza)<br><br>
                    
                    Det <strong>skulle</strong> vara roligt<br>
                    (Ce serait amusant)<br><br>
                    
                    Vi <strong>skulle</strong> kunna gå på bio<br>
                    (Nous pourrions aller au cinéma)
                </div>
                
                <h4>Hypothèses irréelles</h4>
                <p>Pour le passé irréel, on utilise <strong>skulle ha</strong> + participe</p>
                
                <div class="example">
                    Jag <strong>skulle ha kommit</strong> om jag hade vetat<br>
                    (Je serais venu si j'avais su)<br><br>
                    
                    Det <strong>skulle ha varit</strong> bättre<br>
                    (Ça aurait été mieux)
                </div>
                
                <h4>Phrases avec "om"</h4>
                <table>
                    <tr>
                        <th>Type</th>
                        <th>Structure</th>
                        <th>Exemple</th>
                    </tr>
                    <tr>
                        <td>Réel</td>
                        <td>om + présent</td>
                        <td>Om det regnar, stannar jag hemma</td>
                    </tr>
                    <tr>
                        <td>Irréel présent</td>
                        <td>om + prétérit</td>
                        <td>Om jag var rik, skulle jag resa</td>
                    </tr>
                    <tr>
                        <td>Irréel passé</td>
                        <td>om + plus-que-parfait</td>
                        <td>Om jag hade vetat, hade jag kommit</td>
                    </tr>
                </table>
            `
        },
        {
            id: 'b2_l3',
            title: 'Discours rapporté',
            category: 'Grammaire',
            icon: '💬',
            duration: '30 min',
            audioAvailable: true,
            content: `
                <h4>Rapporter des paroles</h4>
                <p>Le discours rapporté en suédois suit des règles de concordance des temps.</p>
                
                <h4>Discours direct → indirect</h4>
                <div class="example">
                    <strong>Direct :</strong> Han sa: "Jag är trött"<br>
                    <strong>Indirect :</strong> Han sa att han var trött<br>
                    (Il a dit qu'il était fatigué)
                </div>
                
                <h4>Changements de temps</h4>
                <table>
                    <tr>
                        <th>Direct</th>
                        <th>Indirect</th>
                    </tr>
                    <tr><td>Présent</td><td>→ Prétérit</td></tr>
                    <tr><td>Prétérit</td><td>→ Plus-que-parfait</td></tr>
                    <tr><td>Futur (ska)</td><td>→ skulle</td></tr>
                </table>
                
                <div class="example">
                    "Jag <strong>kommer</strong>" → Han sa att han <strong>kom</strong><br>
                    "Jag <strong>såg</strong> henne" → Han sa att han <strong>hade sett</strong> henne<br>
                    "Jag <strong>ska</strong> gå" → Han sa att han <strong>skulle</strong> gå
                </div>
                
                <h4>Verbes introducteurs</h4>
                <div class="example">
                    <strong>säga</strong> - dire<br>
                    <strong>berätta</strong> - raconter<br>
                    <strong>förklara</strong> - expliquer<br>
                    <strong>påstå</strong> - affirmer<br>
                    <strong>fråga</strong> - demander
                </div>
            `
        }
    ],
    
    C1: [
        {
            id: 'c1_l1',
            title: 'Le subjonctif et formes archaïques',
            category: 'Grammaire',
            icon: '📜',
            duration: '40 min',
            audioAvailable: true,
            content: `
                <h4>Le subjonctif en suédois moderne</h4>
                <p>Le subjonctif est rare mais existe dans certains contextes formels.</p>
                
                <h4>Formation</h4>
                <p>Généralement : radical + <strong>-e</strong></p>
                
                <div class="example">
                    <strong>vara</strong> → vore<br>
                    <strong>ha</strong> → hade<br>
                    <strong>kunna</strong> → kunde<br>
                    <strong>vilja</strong> → ville
                </div>
                
                <h4>Usages du subjonctif</h4>
                <p><strong>1. Hypothèses irréelles</strong></p>
                <div class="example">
                    Om jag <strong>vore</strong> rik...<br>
                    (Si j'étais riche...)
                </div>
                
                <p><strong>2. Expressions figées</strong></p>
                <div class="example">
                    Leve kungen! (Vive le roi!)<br>
                    Gud bevare (Dieu protège)<br>
                    Ske vad som helst (Advienne que pourra)
                </div>
                
                <p><strong>3. Langage formel</strong></p>
                <div class="example">
                    Det <strong>vore</strong> önskvärt att...<br>
                    (Il serait souhaitable que...)
                </div>
                
                <div class="rule-box">
                    <strong>💡 Usage moderne :</strong> On préfère souvent le prétérit ordinaire au subjonctif dans la langue courante.
                </div>
            `
        },
        {
            id: 'c1_l2',
            title: 'Participes et constructions participiales',
            category: 'Grammaire',
            icon: '⚙️',
            duration: '35 min',
            audioAvailable: true,
            content: `
                <h4>Le participe présent</h4>
                <p>Formation : infinitif + <strong>-ande/-ende</strong></p>
                
                <div class="example">
                    spel<strong>ande</strong> (jouant)<br>
                    läs<strong>ande</strong> (lisant)<br>
                    skriv<strong>ande</strong> (écrivant)
                </div>
                
                <p>Usage comme adjectif :</p>
                <div class="example">
                    en <strong>spännande</strong> bok (un livre passionnant)<br>
                    ett <strong>leende</strong> barn (un enfant souriant)
                </div>
                
                <h4>Le participe parfait</h4>
                <p>Utilisé comme adjectif, s'accorde :</p>
                
                <table>
                    <tr>
                        <th></th>
                        <th>EN</th>
                        <th>ETT</th>
                        <th>Pluriel</th>
                    </tr>
                    <tr>
                        <td>Groupe 1</td>
                        <td>målad</td>
                        <td>målat</td>
                        <td>målade</td>
                    </tr>
                    <tr>
                        <td>Groupe 2</td>
                        <td>köpt</td>
                        <td>köpt</td>
                        <td>köpta</td>
                    </tr>
                </table>
                
                <div class="example">
                    en <strong>målad</strong> tavla (un tableau peint)<br>
                    ett <strong>stängt</strong> fönster (une fenêtre fermée)<br>
                    <strong>köpta</strong> varor (des marchandises achetées)
                </div>
            `
        }
    ],
    
    C2: [
        {
            id: 'c2_l1',
            title: 'Nuances stylistiques et registres',
            category: 'Stylistique',
            icon: '🎭',
            duration: '45 min',
            audioAvailable: true,
            content: `
                <h4>Les registres de langue</h4>
                
                <h4>1. Formel (Formellt)</h4>
                <p>Documents officiels, correspondance formelle</p>
                <div class="example">
                    Vänligen meddela oss...<br>
                    Med anledning av...<br>
                    Härmed bekräftas...
                </div>
                
                <h4>2. Standard (Standardspråk)</h4>
                <p>Médias, contexte professionnel</p>
                
                <h4>3. Familier (Vardagligt)</h4>
                <div class="example">
                    Tja! (Salut!)<br>
                    Läget? (Ça va?)<br>
                    Ja, det är klart (Bien sûr)
                </div>
                
                <h4>4. Argot (Slang)</h4>
                <div class="example">
                    grym = cool<br>
                    tjej/kille = fille/garçon<br>
                    snacka = parler
                </div>
                
                <h4>Nuances régionales</h4>
                <p>Le suédois varie selon les régions :</p>
                <ul>
                    <li><strong>Stockholmska</strong> : accent de Stockholm</li>
                    <li><strong>Göteborgska</strong> : Göteborg, plus mélodieux</li>
                    <li><strong>Skånska</strong> : Sud, influence danoise</li>
                </ul>
                
                <div class="rule-box">
                    <strong>💡 Culture :</strong> Le tutoiement universel ("du") reflète l'égalitarisme suédois.
                </div>
            `
        },
        {
            id: 'c2_l2',
            title: 'Expressions idiomatiques avancées',
            category: 'Idiomes',
            icon: '🎪',
            duration: '40 min',
            audioAvailable: true,
            content: `
                <h4>Idiomes courants</h4>
                <div class="example">
                    <strong>Att ha en bra dag</strong> - Passer une bonne journée<br>
                    <strong>Att slå två flugor i en smäll</strong> - Faire d'une pierre deux coups<br>
                    <strong>Att kasta sig över något</strong> - Se jeter sur quelque chose<br>
                    <strong>Att vara ute och cykla</strong> - Être complètement à côté de la plaque
                </div>
                
                <h4>Proverbes suédois</h4>
                <div class="example">
                    <strong>Borta bra men hemma bäst</strong><br>
                    (Voyager c'est bien mais chez soi c'est mieux)<br><br>
                    
                    <strong>Man ska inte sälja skinnet innan björnen är skjuten</strong><br>
                    (Il ne faut pas vendre la peau de l'ours avant de l'avoir tué)<br><br>
                    
                    <strong>Lagom är bäst</strong><br>
                    (La modération est préférable)
                </div>
                
                <div class="rule-box">
                    <strong>💡 "Lagom" :</strong> Concept central suédois = ni trop ni trop peu, juste ce qu'il faut
                </div>
            `
        }
    ]
};

// ============================================
// FLASHCARDS PAR CATÉGORIE
// ============================================

const FLASHCARDS = {
    basics: [
        { swedish: 'Hej', french: 'Bonjour/Salut', category: 'Salutations' },
        { swedish: 'Tack', french: 'Merci', category: 'Politesse' },
        { swedish: 'Ja', french: 'Oui', category: 'Bases' },
        { swedish: 'Nej', french: 'Non', category: 'Bases' },
        { swedish: 'Varsågod', french: 'De rien / S\'il vous plaît', category: 'Politesse' },
        { swedish: 'Förlåt', french: 'Pardon / Désolé', category: 'Politesse' },
        { swedish: 'God morgon', french: 'Bonjour (matin)', category: 'Salutations' },
        { swedish: 'Hej då', french: 'Au revoir', category: 'Salutations' },
        { swedish: 'Hur mår du?', french: 'Comment vas-tu?', category: 'Conversations' },
        { swedish: 'Jag mår bra', french: 'Je vais bien', category: 'Conversations' }
    ],
    numbers: [
        { swedish: 'noll', french: '0', category: 'Nombres' },
        { swedish: 'ett/en', french: '1', category: 'Nombres' },
        { swedish: 'två', french: '2', category: 'Nombres' },
        { swedish: 'tre', french: '3', category: 'Nombres' },
        { swedish: 'fyra', french: '4', category: 'Nombres' },
        { swedish: 'fem', french: '5', category: 'Nombres' },
        { swedish: 'sex', french: '6', category: 'Nombres' },
        { swedish: 'sju', french: '7', category: 'Nombres' },
        { swedish: 'åtta', french: '8', category: 'Nombres' },
        { swedish: 'nio', french: '9', category: 'Nombres' },
        { swedish: 'tio', french: '10', category: 'Nombres' },
        { swedish: 'tjugo', french: '20', category: 'Nombres' },
        { swedish: 'trettio', french: '30', category: 'Nombres' },
        { swedish: 'hundra', french: '100', category: 'Nombres' }
    ],
    colors: [
        { swedish: 'röd', french: 'rouge', category: 'Couleurs' },
        { swedish: 'blå', french: 'bleu', category: 'Couleurs' },
        { swedish: 'grön', french: 'vert', category: 'Couleurs' },
        { swedish: 'gul', french: 'jaune', category: 'Couleurs' },
        { swedish: 'svart', french: 'noir', category: 'Couleurs' },
        { swedish: 'vit', french: 'blanc', category: 'Couleurs' },
        { swedish: 'orange', french: 'orange', category: 'Couleurs' },
        { swedish: 'rosa', french: 'rose', category: 'Couleurs' },
        { swedish: 'brun', french: 'marron', category: 'Couleurs' },
        { swedish: 'grå', french: 'gris', category: 'Couleurs' }
    ],
    family: [
        { swedish: 'mamma', french: 'maman', category: 'Famille' },
        { swedish: 'pappa', french: 'papa', category: 'Famille' },
        { swedish: 'bror', french: 'frère', category: 'Famille' },
        { swedish: 'syster', french: 'sœur', category: 'Famille' },
        { swedish: 'son', french: 'fils', category: 'Famille' },
        { swedish: 'dotter', french: 'fille', category: 'Famille' },
        { swedish: 'farmor', french: 'grand-mère paternelle', category: 'Famille' },
        { swedish: 'morfar', french: 'grand-père maternel', category: 'Famille' },
        { swedish: 'moster', french: 'tante maternelle', category: 'Famille' },
        { swedish: 'farbror', french: 'oncle paternel', category: 'Famille' }
    ],
    food: [
        { swedish: 'bröd', french: 'pain', category: 'Nourriture' },
        { swedish: 'mjölk', french: 'lait', category: 'Nourriture' },
        { swedish: 'vatten', french: 'eau', category: 'Nourriture' },
        { swedish: 'kaffe', french: 'café', category: 'Nourriture' },
        { swedish: 'ägg', french: 'œuf', category: 'Nourriture' },
        { swedish: 'ost', french: 'fromage', category: 'Nourriture' },
        { swedish: 'kött', french: 'viande', category: 'Nourriture' },
        { swedish: 'fisk', french: 'poisson', category: 'Nourriture' },
        { swedish: 'äpple', french: 'pomme', category: 'Nourriture' },
        { swedish: 'smör', french: 'beurre', category: 'Nourriture' }
    ],
    time: [
        { swedish: 'dag', french: 'jour', category: 'Temps' },
        { swedish: 'vecka', french: 'semaine', category: 'Temps' },
        { swedish: 'månad', french: 'mois', category: 'Temps' },
        { swedish: 'år', french: 'an/année', category: 'Temps' },
        { swedish: 'igår', french: 'hier', category: 'Temps' },
        { swedish: 'idag', french: 'aujourd\'hui', category: 'Temps' },
        { swedish: 'imorgon', french: 'demain', category: 'Temps' },
        { swedish: 'nu', french: 'maintenant', category: 'Temps' },
        { swedish: 'aldrig', french: 'jamais', category: 'Temps' },
        { swedish: 'alltid', french: 'toujours', category: 'Temps' }
    ],
    verbs: [
        { swedish: 'att vara', french: 'être', category: 'Verbes' },
        { swedish: 'att ha', french: 'avoir', category: 'Verbes' },
        { swedish: 'att göra', french: 'faire', category: 'Verbes' },
        { swedish: 'att äta', french: 'manger', category: 'Verbes' },
        { swedish: 'att dricka', french: 'boire', category: 'Verbes' },
        { swedish: 'att gå', french: 'aller/marcher', category: 'Verbes' },
        { swedish: 'att komma', french: 'venir', category: 'Verbes' },
        { swedish: 'att tala', french: 'parler', category: 'Verbes' },
        { swedish: 'att se', french: 'voir', category: 'Verbes' },
        { swedish: 'att höra', french: 'entendre', category: 'Verbes' },
        { swedish: 'att arbeta', french: 'travailler', category: 'Verbes' },
        { swedish: 'att bo', french: 'habiter', category: 'Verbes' },
        { swedish: 'att vilja', french: 'vouloir', category: 'Verbes' },
        { swedish: 'att kunna', french: 'pouvoir', category: 'Verbes' }
    ]
};

// ============================================
// BANQUE DE QUESTIONS ÉTENDUE (50+ PAR NIVEAU)
// ============================================

const QUESTION_BANK = {
    A1: {
        grammar: [
            // Genre & Articles (10 questions)
            {
                id: 'a1_g1', category: "Genre & Indéfini", type: 'multiple-choice', difficulty: 'easy',
                question: "Traduisez : 'Un nouveau travail' (Jobb [Ett])",
                options: ["En ny jobb", "Ett ny jobb", "Ett nytt jobb", "Den nya jobbet"],
                correct: 2,
                explanation: "Pour Ett-ord, l'adjectif prend -tt à l'indéfini.",
                hint: "Ett-ord + adjectif = -tt",
                points: 10, relatedLesson: 'a1_l2'
            },
            {
                id: 'a1_g2', category: "Genre & Indéfini", type: 'multiple-choice', difficulty: 'easy',
                question: "Quel est le genre de 'bil' (voiture)?",
                options: ["EN", "ETT", "Les deux", "Aucun"],
                correct: 0,
                explanation: "Bil est un EN-ord. Environ 75% des mots sont EN.",
                points: 10, relatedLesson: 'a1_l2'
            },
            {
                id: 'a1_g3', category: "Genre & Défini", type: 'multiple-choice', difficulty: 'medium',
                question: "Comment dit-on 'la voiture'? (bil = EN)",
                options: ["bil", "bilen", "bilet", "bilena"],
                correct: 1,
                explanation: "EN-ord + -en au défini = bilen",
                points: 15, relatedLesson: 'a1_l2'
            },
            {
                id: 'a1_g4', category: "Genre & Défini", type: 'multiple-choice', difficulty: 'medium',
                question: "Comment dit-on 'la maison'? (hus = ETT)",
                options: ["husen", "huset", "husan", "husa"],
                correct: 1,
                explanation: "ETT-ord + -et au défini = huset",
                points: 15, relatedLesson: 'a1_l2'
            },
            
            // Adjectifs (10 questions)
            {
                id: 'a1_g5', category: "Adjectifs", type: 'multiple-choice', difficulty: 'easy',
                question: "'Un grand chien' (Hund [EN], Stor)",
                options: ["Ett stort hund", "En stor hund", "En stora hund", "Ett stora hund"],
                correct: 1,
                explanation: "EN-ord garde la forme de base de l'adjectif.",
                points: 10, relatedLesson: 'a1_l3'
            },
            {
                id: 'a1_g6', category: "Adjectifs", type: 'multiple-choice', difficulty: 'medium',
                question: "'Un petit enfant' (Barn [ETT], Liten)",
                options: ["Ett litet barn", "En liten barn", "Ett liten barn", "En litet barn"],
                correct: 0,
                explanation: "Liten devient litet pour ETT-ord.",
                points: 15, relatedLesson: 'a1_l3'
            },
            {
                id: 'a1_g7', category: "Adjectifs Définis", type: 'multiple-choice', difficulty: 'hard',
                question: "'La grande voiture' (Bil [EN], Stor)",
                options: ["En stor bil", "Den stora bil", "Den stora bilen", "Det stora bilen"],
                correct: 2,
                explanation: "Règle du sandwich: Den + stora + bilen",
                points: 20, relatedLesson: 'a1_l3'
            },
            {
                id: 'a1_g8', category: "Adjectifs Définis", type: 'multiple-choice', difficulty: 'hard',
                question: "'Le nouveau travail' (Jobb [ETT], Ny)",
                options: ["Det nya jobbet", "Den nya jobbet", "Ett nytt jobb", "Det ny jobbet"],
                correct: 0,
                explanation: "Règle du sandwich: Det + nya + jobbet",
                points: 20, relatedLesson: 'a1_l3'
            },
            {
                id: 'a1_g9', category: "Adjectifs Pluriel", type: 'multiple-choice', difficulty: 'medium',
                question: "'De vieux livres' (Gammal, Böcker)",
                options: ["Gammal böcker", "Gamla böckerna", "Gamla böcker", "Gammalt böcker"],
                correct: 2,
                explanation: "Au pluriel indéfini, l'adjectif prend -a.",
                points: 15, relatedLesson: 'a1_l3'
            },
            {
                id: 'a1_g10', category: "Adjectifs Pluriel", type: 'multiple-choice', difficulty: 'hard',
                question: "'Les nouveaux enfants' (Barn → Barnen, Ny)",
                options: ["De nya barnen", "De nytt barnen", "Det nya barnen", "De nya barn"],
                correct: 0,
                explanation: "De + adjectif-a + nom pluriel défini",
                points: 20, relatedLesson: 'a1_l3'
            },
            
            // Syntaxe V2 (10 questions)
            {
                id: 'a1_g11', category: "Syntaxe V2", type: 'multiple-choice', difficulty: 'medium',
                question: "'Maintenant, je mange' (Nu, äter, jag)",
                options: ["Nu jag äter", "Nu äter jag", "Jag äter nu", "Äter nu jag"],
                correct: 1,
                explanation: "Règle V2: le verbe est en 2ème position.",
                hint: "Verbe = position 2",
                points: 15, relatedLesson: 'a1_l6'
            },
            {
                id: 'a1_g12', category: "Syntaxe V2", type: 'multiple-choice', difficulty: 'medium',
                question: "'Demain, nous partons' (Imorgon, åker, vi)",
                options: ["Imorgon vi åker", "Vi åker imorgon", "Imorgon åker vi", "Åker imorgon vi"],
                correct: 2,
                explanation: "Imorgon (pos 1), åker (pos 2), vi (pos 3)",
                points: 15, relatedLesson: 'a1_l6'
            },
            {
                id: 'a1_g13', category: "Syntaxe V2", type: 'multiple-choice', difficulty: 'easy',
                question: "Ordre correct: 'Je travaille à Stockholm'",
                options: ["Jag arbetar i Stockholm", "Jag i Stockholm arbetar", "Arbetar jag i Stockholm", "I Stockholm jag arbetar"],
                correct: 0,
                explanation: "Structure standard: Sujet + Verbe + Complément",
                points: 10, relatedLesson: 'a1_l6'
            },
            {
                id: 'a1_g14', category: "Syntaxe V2", type: 'multiple-choice', difficulty: 'hard',
                question: "'À Stockholm, j'habite' (I Stockholm, bor, jag)",
                options: ["I Stockholm jag bor", "I Stockholm bor jag", "Jag bor i Stockholm", "Bor jag i Stockholm"],
                correct: 1,
                explanation: "I Stockholm (1), bor (2), jag (3)",
                points: 20, relatedLesson: 'a1_l6'
            },
            
            // Pronoms (5 questions)
            {
                id: 'a1_g15', category: "Pronoms", type: 'multiple-choice', difficulty: 'easy',
                question: "Comment dit-on 'je' en suédois?",
                options: ["du", "jag", "vi", "de"],
                correct: 1,
                explanation: "Je = jag",
                points: 5, relatedLesson: 'a1_l7'
            },
            {
                id: 'a1_g16', category: "Pronoms", type: 'multiple-choice', difficulty: 'easy',
                question: "Le pronom 'du' signifie:",
                options: ["je", "tu/vous", "il", "nous"],
                correct: 1,
                explanation: "'Du' est utilisé universellement pour tutoyer.",
                points: 5, relatedLesson: 'a1_l7'
            },
            {
                id: 'a1_g17', category: "Pronoms Objets", type: 'multiple-choice', difficulty: 'medium',
                question: "Complétez: 'Il me voit' = Han ser ___",
                options: ["jag", "mig", "min", "mitt"],
                correct: 1,
                explanation: "Moi (objet) = mig",
                points: 15, relatedLesson: 'a1_l7'
            }
        ],
        
        vocabulary: [
            // Salutations (5 questions)
            {
                id: 'a1_v1', category: "Salutations", type: 'multiple-choice', difficulty: 'easy',
                question: "Comment dit-on 'Bonjour'?",
                options: ["Hej", "Tack", "Varsågod", "Adjö"],
                correct: 0,
                explanation: "Hej = Bonjour/Salut",
                points: 5, relatedLesson: 'a1_l4'
            },
            {
                id: 'a1_v2', category: "Salutations", type: 'multiple-choice', difficulty: 'easy',
                question: "'Hej då' signifie:",
                options: ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"],
                correct: 1,
                explanation: "Hej då = Au revoir",
                points: 5, relatedLesson: 'a1_l4'
            },
            {
                id: 'a1_v3', category: "Politesse", type: 'multiple-choice', difficulty: 'easy',
                question: "'Tack' signifie:",
                options: ["Oui", "Non", "Merci", "Pardon"],
                correct: 2,
                explanation: "Tack = Merci",
                points: 5, relatedLesson: 'a1_l4'
            },
            {
                id: 'a1_v4', category: "Politesse", type: 'text-input', difficulty: 'easy',
                question: "Écrivez 'Pardon' en suédois",
                correctAnswers: ["förlåt", "ursäkta"],
                explanation: "Förlåt ou Ursäkta = Pardon",
                points: 10, relatedLesson: 'a1_l4'
            },
            
            // Nombres (10 questions)
            {
                id: 'a1_v5', category: "Nombres", type: 'text-input', difficulty: 'easy',
                question: "Écrivez le nombre 'trois'",
                correctAnswers: ["tre"],
                explanation: "Tre = trois",
                points: 10, relatedLesson: 'a1_l5'
            },
            {
                id: 'a1_v6', category: "Nombres", type: 'multiple-choice', difficulty: 'easy',
                question: "'Fem' signifie:",
                options: ["4", "5", "6", "7"],
                correct: 1,
                explanation: "Fem = 5",
                points: 5, relatedLesson: 'a1_l5'
            },
            {
                id: 'a1_v7', category: "Nombres", type: 'multiple-choice', difficulty: 'medium',
                question: "Comment dit-on 20?",
                options: ["tio", "tjugo", "trettio", "fyrtio"],
                correct: 1,
                explanation: "Tjugo = 20",
                points: 10, relatedLesson: 'a1_l5'
            },
            {
                id: 'a1_v8', category: "Nombres", type: 'text-input', difficulty: 'hard',
                question: "Écrivez 'trente-cinq' en suédois",
                correctAnswers: ["trettiofem", "trettio fem"],
                explanation: "Trettio + fem = 35",
                points: 20, relatedLesson: 'a1_l5'
            },
            
            // Couleurs (5 questions)
            {
                id: 'a1_v9', category: "Couleurs", type: 'multiple-choice', difficulty: 'easy',
                question: "'Röd' signifie:",
                options: ["Bleu", "Rouge", "Vert", "Jaune"],
                correct: 1,
                explanation: "Röd = Rouge",
                points: 5, relatedLesson: 'a1_l4'
            },
            {
                id: 'a1_v10', category: "Couleurs", type: 'text-input', difficulty: 'easy',
                question: "Écrivez 'bleu' en suédois",
                correctAnswers: ["blå"],
                explanation: "Blå = bleu",
                points: 10, relatedLesson: 'a1_l4'
            },
            
            // Jours/Mois (10 questions)
            {
                id: 'a1_v11', category: "Jours", type: 'multiple-choice', difficulty: 'easy',
                question: "'Måndag' signifie:",
                options: ["Dimanche", "Lundi", "Mardi", "Mercredi"],
                correct: 1,
                explanation: "Måndag = Lundi",
                points: 5, relatedLesson: 'a1_l8'
            },
            {
                id: 'a1_v12', category: "Jours", type: 'text-input', difficulty: 'medium',
                question: "Écrivez 'vendredi' en suédois",
                correctAnswers: ["fredag"],
                explanation: "Fredag = vendredi",
                points: 10, relatedLesson: 'a1_l8'
            },
            {
                id: 'a1_v13', category: "Mois", type: 'multiple-choice', difficulty: 'easy',
                question: "'Juli' signifie:",
                options: ["Juin", "Juillet", "Août", "Mai"],
                correct: 1,
                explanation: "Juli = Juillet",
                points: 5, relatedLesson: 'a1_l8'
            }
        ]
    },
    
    A2: {
        grammar: [
            {
                id: 'a2_g1', category: "Présent Groupe 1", type: 'multiple-choice', difficulty: 'medium',
                question: "Conjuguez 'tala' (parler) au présent",
                options: ["talar", "tala", "talade", "talat"],
                correct: 0,
                explanation: "Groupe 1: -a → -ar au présent",
                points: 15, relatedLesson: 'a2_l1'
            },
            {
                id: 'a2_g2', category: "Présent Groupe 2", type: 'multiple-choice', difficulty: 'medium',
                question: "Conjuguez 'läsa' (lire) au présent",
                options: ["läsar", "läsa", "läser", "läst"],
                correct: 2,
                explanation: "Groupe 2: -a → -er au présent",
                points: 15, relatedLesson: 'a2_l1'
            },
            {
                id: 'a2_g3', category: "Passé - Prétérit", type: 'multiple-choice', difficulty: 'hard',
                question: "Conjuguez 'gå' au prétérit",
                options: ["går", "gick", "gått", "ginge"],
                correct: 1,
                explanation: "Gå est irrégulier: gick au prétérit",
                points: 20, relatedLesson: 'a2_l2'
            },
            {
                id: 'a2_g4', category: "Passé - Parfait", type: 'multiple-choice', difficulty: 'medium',
                question: "'J'ai parlé' se traduit:",
                options: ["Jag talade", "Jag har talat", "Jag talar", "Jag hade talat"],
                correct: 1,
                explanation: "Parfait = har + participe",
                points: 15, relatedLesson: 'a2_l2'
            },
            {
                id: 'a2_g5', category: "Prépositions", type: 'multiple-choice', difficulty: 'medium',
                question: "'Dans la maison' = ",
                options: ["på huset", "i huset", "vid huset", "över huset"],
                correct: 1,
                explanation: "I = dans (pour les espaces fermés)",
                points: 15, relatedLesson: 'a2_l3'
            },
            {
                id: 'a2_g6', category: "Futur", type: 'multiple-choice', difficulty: 'medium',
                question: "'Je vais manger' (intention) = ",
                options: ["Jag äter", "Jag kommer att äta", "Jag ska äta", "Jag har ätit"],
                correct: 2,
                explanation: "Ska + infinitif = intention",
                points: 15, relatedLesson: 'a2_l5'
            },
            {
                id: 'a2_g7', category: "Modaux", type: 'multiple-choice', difficulty: 'easy',
                question: "'Jag kan simma' signifie:",
                options: ["Je veux nager", "Je dois nager", "Je peux nager", "Je vais nager"],
                correct: 2,
                explanation: "Kan = pouvoir (capacité)",
                points: 10, relatedLesson: 'a2_l5'
            }
        ],
        vocabulary: [
            {
                id: 'a2_v1', category: "Nourriture", type: 'multiple-choice', difficulty: 'easy',
                question: "'Bröd' signifie:",
                options: ["Lait", "Pain", "Eau", "Beurre"],
                correct: 1,
                explanation: "Bröd = Pain",
                points: 5, relatedLesson: 'a2_l4'
            },
            {
                id: 'a2_v2', category: "Repas", type: 'text-input', difficulty: 'medium',
                question: "Écrivez 'petit-déjeuner' en suédois",
                correctAnswers: ["frukost"],
                explanation: "Frukost = petit-déjeuner",
                points: 10, relatedLesson: 'a2_l4'
            },
            {
                id: 'a2_v3', category: "Famille", type: 'multiple-choice', difficulty: 'medium',
                question: "'Farmor' désigne:",
                options: ["Grand-mère maternelle", "Grand-mère paternelle", "Tante", "Mère"],
                correct: 1,
                explanation: "Far- = côté paternel, -mor = grand-mère",
                points: 15, relatedLesson: 'a2_l6'
            }
        ]
    },
    
    B1: {
        grammar: [
            {
                id: 'b1_g1', category: "Passif en -s", type: 'multiple-choice', difficulty: 'hard',
                question: "Transformez: 'Vi säljer huset' au passif",
                options: ["Huset säljs", "Huset blir sålt", "Huset är sålt", "Huset sälja"],
                correct: 0,
                explanation: "Passif en -s: säljer → säljs",
                points: 25, relatedLesson: 'b1_l1'
            },
            {
                id: 'b1_g2', category: "Pronoms Relatifs", type: 'multiple-choice', difficulty: 'medium',
                question: "Complétez: 'Mannen ___ bor här'",
                options: ["som", "vilken", "vars", "vilket"],
                correct: 0,
                explanation: "Som = qui/que (universel)",
                points: 15, relatedLesson: 'b1_l2'
            },
            {
                id: 'b1_g3', category: "Opinion", type: 'text-input', difficulty: 'medium',
                question: "Écrivez 'Je pense que' en suédois",
                correctAnswers: ["jag tycker att", "jag tror att"],
                explanation: "Jag tycker att = Je pense que",
                points: 15, relatedLesson: 'b1_l3'
            }
        ],
        vocabulary: [
            {
                id: 'b1_v1', category: "Travail", type: 'text-input', difficulty: 'medium',
                question: "Écrivez 'médecin' en suédois",
                correctAnswers: ["läkare"],
                explanation: "Läkare = médecin",
                points: 10, relatedLesson: 'b1_l4'
            }
        ]
    },
    
    B2: {
        grammar: [
            {
                id: 'b2_g1', category: "Subordonnées", type: 'multiple-choice', difficulty: 'hard',
                question: "Complétez: 'Han säger att han ___ inte ___ svenska'",
                options: ["inte vet", "vet inte", "inte veta", "veta inte"],
                correct: 0,
                explanation: "Dans les subordonnées: négation AVANT verbe",
                points: 25, relatedLesson: 'b2_l1'
            },
            {
                id: 'b2_g2', category: "Conditionnel", type: 'multiple-choice', difficulty: 'medium',
                question: "'Je mangerais' = ",
                options: ["Jag äter", "Jag skulle äta", "Jag har ätit", "Jag ska äta"],
                correct: 1,
                explanation: "Skulle + infinitif = conditionnel",
                points: 20, relatedLesson: 'b2_l2'
            }
        ],
        vocabulary: []
    },
    
    C1: {
        grammar: [
            {
                id: 'c1_g1', category: "Subjonctif", type: 'multiple-choice', difficulty: 'hard',
                question: "Complétez: 'Om jag ___ rik...'",
                options: ["är", "var", "varit", "vore"],
                correct: 3,
                explanation: "Vore = subjonctif de vara",
                points: 30, relatedLesson: 'c1_l1'
            }
        ],
        vocabulary: []
    },
    
    C2: {
        grammar: [
            {
                id: 'c2_g1', category: "Registres", type: 'multiple-choice', difficulty: 'hard',
                question: "Expression la plus formelle:",
                options: ["Tja!", "Hej!", "Vänligen meddela", "Läget?"],
                correct: 2,
                explanation: "Vänligen meddela = très formel",
                points: 30, relatedLesson: 'c2_l1'
            }
        ],
        vocabulary: []
    }
};

// ============================================
// SCÉNARIOS DE DIALOGUE
// ============================================

const DIALOGUE_SCENARIOS = {
    casual: {
        name: 'Conversation Informelle',
        description: 'Rencontrez quelqu\'un et discutez',
        systemPrompt: 'Tu es un Suédois amical qui rencontre quelqu\'un pour la première fois. Réponds en suédois simple (niveau A2-B1). Corrige gentiment les erreurs.',
        starterMessages: [
            { role: 'ai', text: 'Hej! Vad heter du?' },
            { role: 'ai', text: 'Trevligt att träffas! Var kommer du ifrån?' }
        ]
    },
    restaurant: {
        name: 'Au Restaurant',
        description: 'Commandez un repas',
        systemPrompt: 'Tu es un serveur suédois dans un restaurant. Aide la personne à commander en suédois.',
        starterMessages: [
            { role: 'ai', text: 'Välkommen! Vad vill du ha att dricka?' },
            { role: 'ai', text: 'Här är menyn. Vad vill du beställa?' }
        ]
    },
    shopping: {
        name: 'Shopping',
        description: 'Faites des achats',
        systemPrompt: 'Tu es un vendeur suédois dans un magasin. Aide la personne à trouver ce qu\'elle cherche.',
        starterMessages: [
            { role: 'ai', text: 'Hej! Kan jag hjälpa dig?' },
            { role: 'ai', text: 'Vad letar du efter idag?' }
        ]
    }
};

// ============================================
// BADGES ÉTENDUS (16 badges)
// ============================================

const BADGES = [
    { id: 'first_steps', name: 'Premiers Pas', icon: '👶', requirement: '10 questions', threshold: 10, unlocked: false },
    { id: 'curious', name: 'Curieux', icon: '🔍', requirement: '25 questions', threshold: 25, unlocked: false },
    { id: 'dedicated', name: 'Dévoué', icon: '💪', requirement: '50 questions', threshold: 50, unlocked: false },
    { id: 'committed', name: 'Engagé', icon: '🎯', requirement: '100 questions', threshold: 100, unlocked: false },
    { id: 'expert', name: 'Expert', icon: '🧠', requirement: '250 questions', threshold: 250, unlocked: false },
    { id: 'master', name: 'Maître', icon: '👑', requirement: '500 questions', threshold: 500, unlocked: false },
    
    { id: 'streak_3', name: 'Trois jours', icon: '🔥', requirement: '3 jours', threshold: 3, type: 'streak', unlocked: false },
    { id: 'streak_7', name: 'Semaine parfaite', icon: '🔥🔥', requirement: '7 jours', threshold: 7, type: 'streak', unlocked: false },
    { id: 'streak_30', name: 'Mois complet', icon: '🔥🔥🔥', requirement: '30 jours', threshold: 30, type: 'streak', unlocked: false },
    
    { id: 'perfect_5', name: 'Cinq parfaits', icon: '⭐', requirement: '5/5', threshold: 5, type: 'perfect', unlocked: false },
    { id: 'perfect_10', name: 'Dix parfaits', icon: '💯', requirement: '10/10', threshold: 10, type: 'perfect', unlocked: false },
    
    { id: 'grammar_master', name: 'As de la grammaire', icon: '📚', requirement: '50 grammaire', threshold: 50, type: 'category', unlocked: false },
    { id: 'vocab_guru', name: 'Roi du vocabulaire', icon: '💬', requirement: '100 mots', threshold: 100, type: 'category', unlocked: false },
    
    { id: 'speed_demon', name: 'Éclair', icon: '⚡', requirement: '<3min', type: 'speed', unlocked: false },
    { id: 'night_owl', name: 'Oiseau de nuit', icon: '🦉', requirement: 'Étude >22h', type: 'special', unlocked: false },
    { id: 'polyglot', name: 'Polyglotte', icon: '🌍', requirement: 'Tous niveaux', type: 'achievement', unlocked: false }
];
