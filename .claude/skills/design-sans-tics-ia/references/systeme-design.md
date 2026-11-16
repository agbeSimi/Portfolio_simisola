# Système de design du portfolio

À lire avant toute modification visuelle. Ce document décrit le site tel qu'il est ; s'il cesse d'être vrai, le corriger en même temps que le code.

## L'idée

Une affiche typographique suivie d'une fiche. En haut, sur fond jaune, le nom en très grand, calé sur toute la largeur, et la demande de stage dans un bandeau noir. Ensuite, sur blanc, trois rubriques composées en lignes, ouvertes chacune par un filet épais. En bas, sur noir, l'adresse e-mail en très grand, calée elle aussi sur la largeur. Le nom et l'adresse se répondent : c'est ce qu'un recruteur doit retenir et ce qu'il doit utiliser.

Rien ne bouge, rien ne brille. Le caractère vient de la taille des lettres et du contraste entre les trois encres.

## Couleurs

Définies dans `:root` de `style.css`. Il n'y en a pas d'autre.

| Variable | Valeur | Rôle |
|---|---|---|
| `--yellow` | `#ffd500` | Fond de l'affiche. Fond de survol des liens sur blanc. Titre et survols sur noir. |
| `--ink` | `#141310` | Texte, filets, boutons, fond de la rubrique Contact. |
| `--paper` | `#ffffff` | Fond des rubriques. Texte sur noir. |
| `--grey-on-ink` | `#c2beb2` | Libellés et filets fins sur noir, uniquement. |

Contrastes mesurés : noir sur jaune 13,1 ; noir sur blanc 18,6 ; gris sur noir 10,0. Le jaune sur blanc fait 1,4 : il ne sert jamais de couleur de texte ni de filet sur fond blanc, seulement de fond.

Chaque zone n'emploie que deux encres : jaune et noir en haut, blanc et noir au milieu, noir avec blanc et jaune en bas.

## Polices

Hébergées dans `fonts/` (licence OFL, textes joints). Aucune requête vers un service tiers.

| Police | Rôle | Réglages |
|---|---|---|
| League Gothic | Nom, bandeau, titres de rubrique, titres de ligne, compétences, adresse et téléphone | Graisse 400 seule. Jamais de gras ni d'italique simulés (`font-synthesis: none`). Casse normale, pas de tout-capitales. |
| Libre Franklin | Tout le reste | 400 pour le texte, 500 pour la présentation de l'affiche, 600 pour les libellés, la navigation et les liens. |

Tailles :

| Élément | Taille |
|---|---|
| Nom, adresse e-mail | Calés sur la largeur (voir plus bas) |
| Bandeau « Je recherche un stage… » | `clamp(2.25rem, 5.6vw, 5rem)` |
| Titre de rubrique (`h2`) | `--size-h2` : `clamp(3rem, 6.5vw, 4.5rem)` |
| Titre de ligne (`h3`), compétences, téléphone | `--size-h3` : `clamp(2rem, 4.2vw, 2.75rem)` |
| Texte courant | `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`, interligne 1,55 |
| Libellés de ligne, navigation | `0.95rem`, graisse 600 |

### Caler une ligne sur la largeur

Le nom et l'adresse remplissent exactement la largeur de la page grâce aux unités de conteneur : `font-size: calc(100cqi / var(--fit-…))`. La valeur `--fit-…` est la largeur du texte, en em, dans League Gothic. Elle dépend du texte lui-même.

Si le nom ou l'adresse change, recalculer la valeur. Dans la console du navigateur, sur la page du site :

```js
const c = document.createElement('canvas').getContext('2d');
c.font = '1000px "League Gothic"';
const m = c.measureText('nouveau texte');
console.log((m.actualBoundingBoxRight / 1000 - 0.015).toFixed(3)); // valeur de --fit-…
```

Reporter le résultat dans `:root` (`--fit-name`, `--fit-name-stacked` pour le mot le plus long quand le nom passe sur deux lignes, `--fit-mail`). Vérifier ensuite à 320, 390, 768 et 1440 px qu'il n'y a pas de défilement horizontal.

## Grille et filets

- `.wrap` : largeur maximale `75rem`, marges latérales `--gutter` (`clamp(1.25rem, 5vw, 3.5rem)`).
- Rubrique (`.section`) : à partir de `60rem`, titre dans une colonne de gauche (3 parts), contenu à droite (9 parts). En dessous, le titre passe au-dessus.
- Ligne (`.row`) : à partir de `40rem`, libellé de `11rem` à gauche, corps à droite, alignés sur la ligne de base. En dessous, le libellé passe au-dessus.
- Nom : sur deux lignes en dessous de `30rem`, sur une ligne au-delà.
- Filet épais (`--rule`, 4 px) : ouvre une rubrique. Filet fin (`--hairline`, 1 px) : sépare deux lignes d'une même rubrique. Pas d'autre séparation, pas de cadre, pas de carte.
- Tout est aligné à gauche. Rien n'est centré.

## Composants

| Classe | Rôle |
|---|---|
| `.poster` | L'affiche jaune : `.topbar` (monogramme et navigation), `.name`, `.pitch` (bandeau `.ask` et présentation `.who`). |
| `.button` | Le seul bouton plein : télécharger le CV. Noir, texte blanc, s'inverse au survol. Un seul par écran. |
| `.text-link` | Lien d'action souligné, graisse 600. Fond jaune au survol sur blanc, fond noir sur jaune. |
| `.section` | Une rubrique : filet épais, `h2`, puis `.rows`. |
| `.row` | Une ligne : `.row-meta` (date, contexte ou catégorie) et `.row-body` (titre `h3`, texte, `.row-place`, `.row-stack`). |
| `.skills` | Liste de compétences composée en League Gothic, séparée par des virgules ajoutées en CSS. |
| `.contact` | Le bloc noir : `h2` jaune, `.mail` calé sur la largeur, `.copy`, `.contact-list`, `.colophon`. |
| `.copy` | Bouton « Copier » au filet. Son libellé devient « Copié » deux secondes. C'est le seul JavaScript du site. |

États : survol et focus changent le fond ou la couleur en 0,15 s. Le focus clavier est un contour de 3 px, noir sur clair, jaune sur noir.

## Ajouter un projet

Copier une ligne existante dans la rubrique Projets de `index.html` :

```html
<article class="row">
    <p class="row-meta">Projet IUT, 2026</p>
    <div class="row-body">
        <h3>Nom du projet</h3>
        <p>Ce que fait l'application, pour qui.</p>
        <p class="row-stack">Symfony, React</p>
        <p><a class="text-link" href="https://github.com/…" target="_blank" rel="noopener">Voir le code de Nom du projet sur GitHub</a></p>
    </div>
</article>
```

Le lien est facultatif. Une capture d'écran du projet peut s'ajouter dans `.row-body`, sous le texte : image nette, sans cadre de navigateur dessiné, sans ombre, moins de 200 Ko, avec un attribut `alt` qui dit ce qu'on voit.

## Ajouter une rubrique

Copier une `<section class="section">` entière, changer l'identifiant, le titre et les lignes, puis ajouter le lien dans `.nav`. Au-delà de cinq liens, la navigation ne tient plus sur un téléphone de 320 px : vérifier.

## Ce que le système n'a pas, exprès

Ombres, coins arrondis, dégradés, icônes, images de fond, logos de technologies, animations au chargement ou au défilement, mode sombre, menu repliable, police à chasse fixe. Chacun de ces manques est un choix. Le skill `design-sans-tics-ia` explique pourquoi.

## Fichiers

| Fichier | Contenu |
|---|---|
| `index.html` | La page. |
| `style.css` | Tout le style, y compris la feuille d'impression (la page s'imprime comme une fiche). |
| `script.js` | Les boutons « Copier ». |
| `logo.svg` | Icône d'onglet : carré jaune, initiales noires tracées d'après League Gothic. |
| `apercu.png` | Image affichée quand le lien est partagé (1200 × 630). |
| `fonts/` | Les deux polices et leurs licences. |

Après avoir modifié `style.css` ou `script.js`, augmenter le numéro dans `style.css?v=…` et `script.js?v=…` de `index.html` pour que les navigateurs rechargent le fichier.

### Refaire `apercu.png`

À refaire si le nom, la présentation ou la date du stage changent. Le gabarit est dans `assets/apercu.html`. Servir la racine du dépôt, puis capturer la page à 1200 × 630 :

```bash
python3 -m http.server 8000
```

```bash
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});await p.goto('http://localhost:8000/.claude/skills/design-sans-tics-ia/assets/apercu.html');await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:'apercu.png'});await b.close()})()"
```
