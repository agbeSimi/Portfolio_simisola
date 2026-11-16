#!/usr/bin/env node
/*
 * Repère les tics d'IA dans les fichiers d'un site statique (HTML, CSS, JS).
 *
 *   node verifier-tics.mjs                 tous les .html, .css, .js du dossier courant
 *   node verifier-tics.mjs index.html      un ou plusieurs fichiers ou dossiers
 *   node verifier-tics.mjs --strict        les avertissements font aussi échouer
 *
 * Code de sortie : 0 si rien de bloquant, 1 sinon.
 * Pour garder un cas voulu, écrire « tics-ok : raison » en commentaire sur la même ligne.
 * Aucune dépendance : Node 18 ou plus récent suffit.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname, extname } from 'node:path';

const ERREUR = 'erreur';
const AVERTISSEMENT = 'avertissement';

/* Limite de mot qui tient compte des lettres accentuées (\b ne les connaît pas). */
const mot = (source, drapeaux = 'giu') =>
    new RegExp(`(?<![\\p{L}\\p{N}])(?:${source})(?![\\p{L}\\p{N}])`, drapeaux);

/* ------------------------------------------------------------------ règles */

const REGLES = [
    /* ---- CSS : effets ---- */
    {
        id: 'degrade-texte', cible: 'css', niveau: ERREUR,
        motif: /(?:-webkit-)?background-clip\s*:\s*text/gi,
        message: 'Texte rempli d’un dégradé',
        conseil: 'Une couleur pleine. Si un mot doit ressortir, changer sa taille ou son fond, pas sa texture.',
    },
    {
        id: 'verre-depoli', cible: 'css', niveau: ERREUR,
        motif: /backdrop-filter\s*:/gi,
        message: 'Verre dépoli (glassmorphism)',
        conseil: 'Un fond opaque. Le flou d’arrière-plan ne sert à rien sur une page sans image derrière.',
    },
    {
        id: 'flou', cible: 'css', niveau: ERREUR,
        motif: /(?<!backdrop-)filter\s*:[^;{}]*\bblur\(/gi,
        message: 'Flou décoratif',
        conseil: 'Supprimer. Un texte qui arrive flou puis net n’apporte rien au lecteur.',
    },
    {
        id: 'lueur', cible: 'css', niveau: ERREUR,
        motif: /text-shadow\s*:(?!\s*(?:none|inherit|initial|unset))|drop-shadow\(|box-shadow\s*:[^;{}]*(?:^|[\s,(:])0\s+0\s+(?!0(?:px)?[\s,;)])\d/gi,
        message: 'Lueur ou halo (ombre sans décalage, ombre de texte)',
        conseil: 'Supprimer. Pour marquer le survol ou le focus : un changement de fond, un filet ou un contour net.',
    },
    {
        id: 'degrade', cible: 'css', niveau: AVERTISSEMENT,
        motif: /\b(?:repeating-)?(?:linear|radial|conic)-gradient\(/gi,
        message: 'Dégradé',
        conseil: 'À garder seulement s’il porte une information. Sinon un aplat.',
    },
    {
        id: 'couleur-neon', cible: 'css', niveau: ERREUR,
        motif: /#(?:00e5ff|00ffff|0ff|22d3ee|06b6d4|8b5cf6|a855f7|7c3aed|6366f1|4f46e5|818cf8|c084fc|d946ef|ff2bd6|ff00ff|f0f|ec4899|39ff14|00ff88|00ff9f)\b|rgba?\(\s*(?:0\s*,\s*229\s*,\s*255|139\s*,\s*92\s*,\s*246|99\s*,\s*102\s*,\s*241|168\s*,\s*85\s*,\s*247|255\s*,\s*43\s*,\s*214)/gi,
        message: 'Couleur de la palette par défaut des sites générés (cyan, violet, indigo, magenta néon)',
        conseil: 'Revenir aux variables de couleur du site, définies dans :root de style.css.',
    },
    {
        id: 'animation-infinie', cible: 'css', niveau: ERREUR,
        motif: /animation(?:-iteration-count)?\s*:[^;{}]*\binfinite\b/gi,
        message: 'Animation en boucle',
        conseil: 'Supprimer. Ce qui bouge en permanence détourne l’œil du texte.',
    },
    {
        id: 'keyframes-decor', cible: 'css', niveau: AVERTISSEMENT,
        motif: /@keyframes\s+[\w-]*(?:glitch|pulse|float|shimmer|glow|blink|caret|typing|gradient|shine|orbit|wave|bounce|dots)[\w-]*/gi,
        message: 'Animation décorative',
        conseil: 'Une animation doit répondre à une action du lecteur (survol, clic). Sinon la retirer.',
    },
    {
        id: 'inclinaison-3d', cible: 'css', niveau: ERREUR,
        motif: /\bperspective\(|\brotate[XY]\(|transform-style\s*:\s*preserve-3d/gi,
        message: 'Carte inclinée en 3D',
        conseil: 'Supprimer. Une carte qui penche sous la souris ne dit rien de plus qu’une carte à plat.',
    },
    {
        id: 'curseur', cible: 'css', niveau: ERREUR,
        motif: /cursor\s*:\s*none/gi,
        message: 'Curseur masqué ou remplacé',
        conseil: 'Laisser le curseur du système.',
    },
    {
        id: 'coins-tres-arrondis', cible: 'css', niveau: AVERTISSEMENT,
        motif: /border-radius\s*:[^;{}]*\b(?:1[2-9]|[2-9]\d|\d{3,})px/gi,
        message: 'Coins très arrondis ou forme de pilule',
        conseil: 'Le site utilise des angles droits. Vérifier que l’arrondi a une raison.',
    },
    {
        id: 'capitales-espacees', cible: 'css', niveau: AVERTISSEMENT,
        motif: /letter-spacing\s*:\s*0?\.(?:1[5-9]|[2-9])\d*em/gi,
        message: 'Lettres très espacées (sur-titre décoratif)',
        conseil: 'Éviter le petit libellé en capitales espacées au-dessus de chaque titre.',
    },
    {
        id: 'barre-defilement', cible: 'css', niveau: AVERTISSEMENT,
        motif: /::-webkit-scrollbar/gi,
        message: 'Barre de défilement redessinée',
        conseil: 'Laisser celle du navigateur.',
    },
    {
        id: 'plein-ecran', cible: 'css', niveau: AVERTISSEMENT,
        motif: /min-height\s*:\s*100[sdl]?vh/gi,
        message: 'Bloc forcé à la hauteur de l’écran',
        conseil: 'Laisser le contenu fixer la hauteur : la suite de la page doit se deviner sans défiler.',
    },

    /* ---- CSS et HTML : polices ---- */
    {
        id: 'police-cliche', cible: ['css', 'html'], niveau: ERREUR,
        motif: /\b(?:Orbitron|Space[ +]Grotesk|Poppins|Montserrat|Syne|Rajdhani|Audiowide|Exo(?:[ +]2)?|Sora|Outfit|Plus[ +]Jakarta[ +]Sans|Urbanist)\b|font-family[^;{}]*\bInter\b|family=Inter\b/g,
        message: 'Police devenue la signature des sites générés',
        conseil: 'Garder les deux polices du site (League Gothic et Libre Franklin).',
    },
    {
        id: 'police-code-decor', cible: ['css', 'html'], niveau: AVERTISSEMENT,
        motif: /\b(?:JetBrains[ +]Mono|Fira[ +]Code|Space[ +]Mono|Share[ +]Tech[ +]Mono|VT323)\b/g,
        message: 'Police à chasse fixe',
        conseil: 'Justifiée pour afficher du code. Pas pour donner un air « développeur » à des libellés.',
    },

    /* ---- HTML : structure ---- */
    {
        id: 'canvas-decor', cible: 'html', niveau: ERREUR,
        motif: /<canvas\b/gi,
        message: 'Canvas (particules, réseau de points, pluie de caractères)',
        conseil: 'Supprimer. Un fond animé concurrence le texte et vide la batterie.',
    },
    {
        id: 'classe-effet', cible: 'html', niveau: ERREUR,
        motif: /\b(?:class|id)\s*=\s*"[^"]*(?<![\w-])(?:loader|preloader|particles?|glitch|typed|typewriter|cursor-glow|tilt|magnetic|glass|card-shine|blob|orb|aurora|scroll-progress|reveal|fade-in|neon|glow)(?![\w-])[^"]*"/gi,
        message: 'Élément d’effet décoratif (chargement, particules, glitch, verre, apparition…)',
        conseil: 'Retirer l’élément et l’effet. Voir la liste des tics dans le skill design-sans-tics-ia.',
    },
    {
        id: 'apparition-defilement', cible: 'html', niveau: ERREUR,
        motif: /\bdata-aos\b/gi,
        message: 'Apparition au défilement',
        conseil: 'Afficher le contenu tout de suite. Le lecteur ne doit pas attendre un texte.',
    },
    {
        id: 'numero-decor', cible: 'html', niveau: ERREUR,
        motif: /<span[^>]*>\s*0\d\s*(?:\/\/|\.|\/)?\s*<\/span>|\b0\d\s*\/\/|\/\/\s*0\d\b/g,
        message: 'Numérotation décorative (01 //, 02 //)',
        conseil: 'Supprimer. Numéroter seulement ce qui a un ordre.',
    },
    {
        id: 'invite-terminal', cible: 'html', niveau: ERREUR,
        motif: /<span[^>]*>\s*(?:\$|&gt;|❯|▸|~\$)\s*<\/span>/g,
        message: 'Invite de commande décorative',
        conseil: 'Supprimer. Écrire le texte normalement.',
    },
    {
        id: 'titre-majuscules', cible: 'titre', niveau: ERREUR,
        motif: /^(?:Mes|Mon|Ma|Me|Nos|Notre|À|A|Le|La|Les|Un|Une|Qui)\s+\p{Lu}\p{Ll}/u,
        message: 'Majuscule à chaque mot dans un titre (usage anglais)',
        conseil: 'En français, seule l’initiale du titre et des noms propres prend la majuscule.',
    },
    {
        id: 'titre-possessif', cible: 'titre', niveau: AVERTISSEMENT,
        motif: /^(?:Mes|Mon|Ma|Nos|Notre)\s/u,
        message: 'Titre en « Mes… » ou « Mon… »',
        conseil: 'Le nom seul suffit : « Projets », « Parcours ».',
    },

    /* ---- Texte visible ---- */
    {
        id: 'emoji', cible: 'texte', niveau: ERREUR,
        motif: /(?![©®™\u2190-\u21FF])\p{Extended_Pictographic}/gu,
        message: 'Émoji ou pictogramme dans le texte',
        conseil: 'Supprimer. Si une icône est utile, la dessiner en SVG.',
    },
    {
        id: 'tiret-cadratin', cible: 'texte', niveau: ERREUR,
        motif: /—|&mdash;|&#8212;/g,
        message: 'Tiret cadratin',
        conseil: 'Virgule, deux-points, parenthèses ou point. Pour une période : « depuis 2023 » ou « 2023-2026 ».',
    },
    {
        id: 'exclamation', cible: 'texte', niveau: AVERTISSEMENT,
        motif: /!/g,
        message: 'Point d’exclamation',
        conseil: 'Un point suffit. L’enthousiasme se montre par les faits.',
    },
    {
        id: 'fleche-decor', cible: 'texte', niveau: AVERTISSEMENT,
        motif: /[→↗↘↓↑⟶➜➔»›]\s*$|[→↗⟶➜➔]/gmu,
        message: 'Flèche ajoutée à un libellé',
        conseil: 'Un libellé précis se passe de flèche : « Voir le code sur GitHub », « Télécharger le CV ».',
    },
    {
        id: 'decor-terminal', cible: 'texte', niveau: ERREUR,
        motif: /hello[_ ]world|initialisation du système|chargement du système|system\.init|&lt;\s*\/?\s*&gt;|console\.log\(|\bsudo\b|\bwhoami\b/gi,
        message: 'Décor de terminal ou de code dans le texte',
        conseil: 'Supprimer. Le métier se prouve par les projets, pas par un habillage.',
    },
    {
        id: 'formule-accueil', cible: 'texte', niveau: ERREUR,
        motif: mot('bienvenue (?:sur|dans) mon|(?:bonjour|salut|hello|hey|coucou),? (?:je suis|moi c[\'’]est|i[\'’]m)'),
        message: 'Formule d’accueil (« Bonjour, je suis… », « Bienvenue sur mon… »)',
        conseil: 'Commencer par le nom, puis ce que la personne fait et ce qu’elle cherche.',
    },
    {
        id: 'formule-passion', cible: 'texte', niveau: ERREUR,
        motif: mot('passionn[ée]e?s? (?:par|de|d[\'’]|depuis)|toujours en quête|soif d[\'’]apprendre|relever (?:de nouveaux |des )?défis|donner vie à|transformer (?:vos|des|les|mes) idées|repousser les limites|zone de confort|faire la différence|ne demande qu[\'’]à'),
        message: 'Formule de motivation toute faite',
        conseil: 'Remplacer par un fait : ce qui a été construit, avec quoi, pour qui.',
    },
    {
        id: 'formule-politesse', cible: 'texte', niveau: ERREUR,
        motif: mot('n[\'’]hésitez pas|au plaisir de|restons en contact|travaillons ensemble|discutons de votre projet|une question \\?'),
        message: 'Formule d’invitation toute faite',
        conseil: 'Donner le moyen de contact directement : l’adresse, le numéro.',
    },
    {
        id: 'formule-decor', cible: 'texte', niveau: ERREUR,
        motif: mot('en constante évolution|en perpétuelle évolution|dans un monde (?:où|en|de plus en plus)|à l[\'’]ère (?:du|de la|des)|à la croisée d(?:e|es|u)|au cœur de (?:la|l[\'’]|mes|ma|mon)|dans le paysage|solutions? (?:innovantes?|sur[- ]mesure|digitales?|numériques?|web modernes?)|expériences? (?:utilisateur )?(?:uniques?|immersives?|mémorables?|fluides?|exceptionnelles?)'),
        message: 'Tournure de brochure',
        conseil: 'Dire la chose précise, ou supprimer la phrase.',
    },
    {
        id: 'balancement', cible: 'texte', niveau: ERREUR,
        motif: mot('que ce soit[^.!?]{0,80}\\bou\\b|(?:pas|non) seulement[^.!?]{0,80}\\bmais\\b|ce n[\'’]est pas (?:qu[\'’]|juste |seulement |simplement )[^.!?]{0,80}c[\'’]est|plus qu[\'’]une?[^.!?]{0,40},'),
        message: 'Balancement rhétorique (« pas seulement… mais », « que ce soit… ou »)',
        conseil: 'Écrire directement la seconde moitié de la phrase.',
    },
    {
        id: 'imperatif-brochure', cible: 'texte', niveau: AVERTISSEMENT,
        motif: mot('plongeons|plongez|découvrez|explorez|embarquez|laissez-vous'),
        message: 'Impératif de brochure',
        conseil: 'Nommer ce que le lien ou la rubrique contient.',
    },
    {
        id: 'lien-generique', cible: 'texte', niveau: AVERTISSEMENT,
        motif: mot('en savoir plus|voir plus|lire la suite|cliquez ici|learn more|read more'),
        message: 'Libellé de lien générique',
        conseil: 'Dire où mène le lien : « Voir le code de LitterAI sur GitHub ».',
    },
    {
        id: 'adjectif-vide', cible: 'texte', niveau: AVERTISSEMENT,
        motif: mot('innovante?s?|robustes?|intuiti(?:f|ve)s?|performante?s?|élégante?s?|modernes?|immersi(?:f|ve)s?|futuristes?|dynamiques?|rigoureu(?:x|se)s?|polyvalente?s?|créati(?:f|ve)s?|motivée?s?|de pointe|de qualité|sur[- ]mesure|clé en main|de A à Z'),
        message: 'Adjectif qui ne prouve rien',
        conseil: 'Le supprimer et voir si la phrase perd quelque chose. Sinon le remplacer par un fait.',
    },
    {
        id: 'mentions-toutes-faites', cible: 'texte', niveau: AVERTISSEMENT,
        motif: mot('tous droits réservés|all rights reserved|fait avec (?:amour|passion|❤)|made with'),
        message: 'Mention de pied de page recopiée',
        conseil: 'Le nom et l’année suffisent.',
    },

    /* ---- JavaScript ---- */
    {
        id: 'effet-js', cible: 'js', niveau: ERREUR,
        motif: /\b(?:particles?|glitch\w*|typewriter|typeLoop|typed|magnetic|tilt|cursorGlow|parallax|confetti|matrixRain)\b/gi,
        message: 'Effet décoratif scripté (particules, glitch, machine à écrire, aimant, inclinaison…)',
        conseil: 'Supprimer le script et l’élément associé.',
    },
    {
        id: 'suivi-souris', cible: 'js', niveau: ERREUR,
        motif: /addEventListener\(\s*['"](?:mousemove|pointermove)['"]/g,
        message: 'Le script suit le déplacement de la souris',
        conseil: 'Supprimer : halo, carte qui penche et bouton aimanté viennent de là.',
    },
    {
        id: 'chargement-factice', cible: 'js', niveau: ERREUR,
        motif: /\b(?:pre)?loader\b|\bsplash\b/gi,
        message: 'Écran de chargement',
        conseil: 'Supprimer. Une page statique s’affiche tout de suite ; la retenir est une perte pour le lecteur.',
    },
    {
        id: 'apparition-defilement', cible: 'js', niveau: ERREUR,
        motif: /\breveal\w*\b|\bfade-?in\b/gi,
        message: 'Apparition du contenu au défilement',
        conseil: 'Afficher le contenu tout de suite.',
    },
    {
        id: 'boucle-animation', cible: 'js', niveau: AVERTISSEMENT,
        motif: /requestAnimationFrame\(|getContext\(\s*['"](?:2d|webgl2?)['"]/g,
        message: 'Boucle d’animation ou dessin sur canvas',
        conseil: 'À garder seulement si le dessin est le contenu (un graphique, une démo de projet).',
    },
];

/* --------------------------------------------------------------- projections
 * Une projection est une copie du fichier où tout ce qui ne concerne pas la règle
 * est remplacé par des espaces. Les positions et les numéros de ligne restent justes. */

const blanchir = texte => texte.replace(/[^\n]/g, ' ');

function sansCommentaires(source, type) {
    if (type === 'css') return source.replace(/\/\*[\s\S]*?\*\//g, blanchir);
    if (type === 'js') {
        return source
            .replace(/\/\*[\s\S]*?\*\//g, blanchir)
            .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (m, avant) => avant + blanchir(m.slice(avant.length)));
    }
    return source.replace(/<!--[\s\S]*?-->/g, blanchir);
}

function projectionsHtml(source) {
    const propre = sansCommentaires(source, 'html');
    const blocs = /<(script|style)\b[^>]*>([\s\S]*?)<\/\1>/gi;

    // CSS : contenu des <style> et des attributs style=""
    let css = blanchir(propre);
    let js = blanchir(propre);
    const coller = (cible, debut, texte) => cible.slice(0, debut) + texte + cible.slice(debut + texte.length);

    for (const m of propre.matchAll(blocs)) {
        const debut = m.index + m[0].indexOf(m[2]);
        if (m[1].toLowerCase() === 'style') css = coller(css, debut, sansCommentaires(m[2], 'css'));
        else js = coller(js, debut, sansCommentaires(m[2], 'js'));
    }
    for (const m of propre.matchAll(/\bstyle\s*=\s*"([^"]*)"/gi)) {
        css = coller(css, m.index + m[0].indexOf(m[1]), m[1]);
    }

    // Balisage : tout sauf le contenu des <script> et <style>
    const html = propre.replace(blocs, (m, nom, contenu) => m.replace(contenu, () => blanchir(contenu)));

    // Texte visible : les nœuds texte, plus les attributs lus par le visiteur
    const texte = html.replace(/<[^>]*>/g, balise => {
        let garde = blanchir(balise);
        for (const a of balise.matchAll(/\b(?:alt|title|aria-label|placeholder|content)\s*=\s*"([^"]*)"/gi)) {
            garde = coller(garde, a.index + a[0].indexOf(a[1]), a[1]);
        }
        return garde;
    });

    // Titres : texte de chaque <h1>…<h6>, avec sa position
    const titres = [...html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map(m => ({
        index: m.index,
        texte: m[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim(),
    }));

    return { css, js, html, texte, titres };
}

/* ------------------------------------------------------------------ analyse */

const numeroDeLigne = (source, index) => source.slice(0, index).split('\n').length;
const extrait = texte => texte.replace(/\s+/g, ' ').trim().slice(0, 60);

function analyser(fichier) {
    const source = readFileSync(fichier, 'utf8');
    const lignes = source.split('\n');
    const type = { '.html': 'html', '.htm': 'html', '.css': 'css', '.js': 'js', '.mjs': 'js' }[extname(fichier).toLowerCase()];
    const constats = [];
    const vus = new Set();

    const projections = type === 'html'
        ? projectionsHtml(source)
        : { [type]: sansCommentaires(source, type), titres: [] };

    const noter = (regle, index, trouve) => {
        const ligne = numeroDeLigne(source, index);
        if (/tics-ok/.test(lignes[ligne - 1])) return;
        const cle = `${regle.id}:${ligne}`;
        if (vus.has(cle)) return;
        vus.add(cle);
        constats.push({ fichier, ligne, regle, trouve: extrait(trouve) });
    };

    for (const regle of REGLES) {
        for (const cible of [].concat(regle.cible)) {
            if (cible === 'titre') {
                for (const titre of projections.titres) {
                    if (regle.motif.test(titre.texte)) noter(regle, titre.index, titre.texte);
                }
                continue;
            }
            const contenu = projections[cible];
            if (!contenu) continue;
            for (const m of contenu.matchAll(regle.motif)) noter(regle, m.index, m[0]);
        }
    }

    // Poids des fichiers que la page charge
    if (type === 'html' || type === 'css') {
        const liens = /url\(\s*['"]?([^'")]+)['"]?\s*\)|\b(?:src|href)\s*=\s*"([^"]+\.(?:png|jpe?g|gif|webp|avif|svg|mp4|webm|woff2?))"/gi;
        const regle = {
            id: 'fichier-lourd', niveau: AVERTISSEMENT,
            message: 'Fichier lourd chargé par la page',
            conseil: 'Au-delà de 400 Ko, réduire l’image ou s’en passer. Une image de fond décorative ne vaut pas ce poids.',
        };
        for (const m of sansCommentaires(source, type).matchAll(liens)) {
            const chemin = (m[1] || m[2]).split(/[?#]/)[0];
            if (/^(?:[a-z]+:)?\/\//i.test(chemin) || chemin.startsWith('data:')) continue;
            const cible = resolve(dirname(fichier), chemin);
            if (!existsSync(cible)) continue;
            const octets = statSync(cible).size;
            if (octets > 400_000) noter(regle, m.index, `${chemin} (${(octets / 1_000_000).toFixed(1)} Mo)`);
        }
    }

    return constats;
}

/* ------------------------------------------------------------ ligne de commande */

const IGNORES = new Set(['.git', '.claude', 'node_modules', 'fonts', 'dist', 'build', 'vendor']);

function lister(chemin, trouves = []) {
    const info = statSync(chemin);
    if (info.isFile()) {
        if (/\.(?:html?|css|m?js)$/i.test(chemin) && !/\.min\./i.test(chemin)) trouves.push(chemin);
    } else if (info.isDirectory()) {
        for (const nom of readdirSync(chemin).sort()) {
            if (IGNORES.has(nom)) continue;
            lister(join(chemin, nom), trouves);
        }
    }
    return trouves;
}

const args = process.argv.slice(2);
if (args.includes('--aide') || args.includes('--help') || args.includes('-h')) {
    console.log('Usage : node verifier-tics.mjs [--strict] [fichiers ou dossiers…]');
    process.exit(0);
}
const strict = args.includes('--strict');
const chemins = args.filter(a => !a.startsWith('--'));
const absents = chemins.filter(c => !existsSync(c));
if (absents.length) {
    console.error(`Introuvable : ${absents.join(', ')}`);
    process.exit(2);
}

const fichiers = (chemins.length ? chemins : ['.']).flatMap(c => lister(resolve(c)));
if (!fichiers.length) {
    console.error('Aucun fichier .html, .css ou .js à vérifier.');
    process.exit(2);
}

const constats = fichiers.flatMap(analyser);
const nom = f => relative(process.cwd(), f) || f;
const erreurs = constats.filter(c => c.regle.niveau === ERREUR).length;
const avertissements = constats.length - erreurs;

if (!constats.length) {
    console.log(`Aucun tic repéré dans ${fichiers.length} fichier(s) : ${fichiers.map(nom).join(', ')}.`);
    console.log('Le script ne voit ni la mise en page ni le sens des phrases : faire aussi la relecture du skill verifier-tics-ia.');
    process.exit(0);
}

for (const fichier of fichiers) {
    const duFichier = constats.filter(c => c.fichier === fichier).sort((a, b) => a.ligne - b.ligne);
    if (!duFichier.length) continue;
    console.log(`\n${nom(fichier)}`);
    for (const c of duFichier) {
        console.log(`  ${String(c.ligne).padStart(4)}  ${c.regle.niveau.padEnd(13)}  ${c.regle.id.padEnd(22)}  ${c.regle.message} : « ${c.trouve} »`);
    }
}

console.log('\nQue faire');
const parRegle = new Map();
for (const c of constats) parRegle.set(c.regle.id, { regle: c.regle, n: (parRegle.get(c.regle.id)?.n ?? 0) + 1 });
for (const { regle, n } of [...parRegle.values()].sort((a, b) => b.n - a.n)) {
    console.log(`  ${regle.id} (${n}) : ${regle.conseil}`);
}

console.log(`\nBilan : ${erreurs} erreur(s), ${avertissements} avertissement(s) dans ${fichiers.length} fichier(s).`);
process.exit(erreurs > 0 || (strict && avertissements > 0) ? 1 : 0);
