---
name: verifier-tics-ia
description: Audit du portfolio avant validation. Lance le script qui repère les tics d'IA dans index.html, style.css et script.js (effets visuels, couleurs et polices par défaut, tournures toutes faites, émojis, tirets cadratins, fichiers trop lourds), puis fait la relecture que le script ne sait pas faire, captures d'écran comprises. À utiliser avant chaque commit qui touche au site, après toute modification de design ou de texte, et dès que l'utilisateur demande « est-ce que ça fait IA ? », « vérifie le site », « relis », « audit », « contrôle avant de pousser ».
---

# Vérifier les tics d'IA

Ce skill est le contrôle de sortie des deux autres (`design-sans-tics-ia` et `redaction-sans-tics-ia`). Il se déroule en trois temps : le script, les yeux, le rapport.

## 1. Le script

Depuis la racine du dépôt :

```bash
node .claude/skills/verifier-tics-ia/scripts/verifier-tics.mjs
```

Il lit tous les fichiers `.html`, `.css` et `.js` du dossier (sauf `.claude/`, `fonts/`, `node_modules/`) et affiche, pour chaque constat, le fichier, la ligne, le niveau, l'identifiant de la règle et le passage en cause. Un bloc « Que faire » donne ensuite un conseil par règle.

- `erreur` : un tic franc. Le code de sortie passe à 1. À corriger avant de valider.
- `avertissement` : à regarder. Souvent un tic, parfois un choix défendable. Avec `--strict`, les avertissements font aussi échouer.

On peut viser un fichier : `node …/verifier-tics.mjs index.html`.

Corriger chaque constat en suivant le skill concerné (design ou rédaction), puis relancer jusqu'à obtenir « Aucun tic repéré ».

### Garder un cas voulu

Si l'utilisateur tient à un élément que le script signale, ou si le signalement est une fausse alerte, ajouter sur la même ligne un commentaire qui contient `tics-ok` et la raison :

```css
border-radius: 50%; /* tics-ok : photo de profil ronde, demandée par Simisola */
```

```html
<p>Projet « Moderne » de l'IUT</p> <!-- tics-ok : c'est le nom du projet -->
```

Ne pas s'en servir pour faire taire le script sans raison : la raison doit pouvoir se dire à l'utilisateur.

## 2. Ce que le script ne voit pas

Le script cherche des motifs dans le code. Il ne voit ni la page ni le sens des phrases. Une page peut passer le script et avoir l'air générée quand même.

### Regarder la page

Servir le dossier et capturer la page entière à trois largeurs (téléphone 390 px, tablette 768 px, ordinateur 1440 px). Avec Playwright s'il est disponible :

```bash
python3 -m http.server 8000
```

```bash
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();for(const w of[390,768,1440]){const p=await b.newPage({viewport:{width:w,height:900}});await p.goto('http://localhost:8000/');await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:'capture-'+w+'.png',fullPage:true});const d=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(d>0)console.log(w+' px : défilement horizontal de '+d+' px');await p.close()}await b.close()})()"
```

Écrire les captures dans un dossier temporaire, pas dans le dépôt. Puis regarder chaque capture, vraiment, avec ces questions :

- Le nom et la demande de stage se lisent-ils en premier ?
- Y a-t-il un élément dont on ne saurait pas dire pourquoi il est là ?
- Tout est-il aligné sur les axes de la grille, à gauche ? Rien de centré par habitude ?
- Les blocs ajoutés ressemblent-ils à ceux qui existaient (mêmes filets, mêmes tailles), ou à un gabarit importé ?
- Sur téléphone : la navigation tient-elle sur une ligne, le nom et l'adresse e-mail remplissent-ils la largeur sans déborder ?
- Compte-t-on plus de trois couleurs, plus de deux polices ?

Le système de référence est décrit dans `.claude/skills/design-sans-tics-ia/references/systeme-design.md`.

### Relire le texte

Lire chaque phrase visible de `index.html`, y compris `<title>`, la balise `meta description`, les attributs `alt` et `aria-label`.

- Chaque phrase donne-t-elle un fait ? Lequel ?
- Chaque fait a-t-il une source (le CV, l'utilisateur) ? Un fait sans source est le problème le plus grave de tout l'audit : le signaler en premier.
- Trois éléments à chaque énumération ? Deux phrases de suite bâties sur le même moule ?
- Les règles de typographie française sont-elles tenues (majuscules, espaces insécables, apostrophes, ordinaux) ?
- Ce qui change dans la page est-il répercuté ailleurs (date du stage dans le bandeau, la balise `meta`, `og:description` et `apercu.png`) ?

## 3. Le rapport

Dire d'abord le résultat, puis les constats par ordre de gravité. Rester court : l'utilisateur veut savoir s'il peut valider.

```
Résultat : [prêt à valider | N points à corriger]

Script : X erreurs, Y avertissements (ou « aucun tic repéré »).

À corriger
- fichier:ligne, ce qui ne va pas, la correction proposée.

À décider par toi
- ce qui relève d'un choix (un avertissement défendable, une information à confirmer).

Vérifié à l'œil : captures à 390, 768 et 1440 px, relecture du texte.
```

Si une vérification n'a pas pu être faite (pas de navigateur pour les captures, par exemple), l'écrire dans le rapport au lieu de la passer sous silence.

## Faire évoluer le script

Quand l'utilisateur repère un tic que le script a laissé passer (« ça, ça fait IA »), l'ajouter : une entrée dans le tableau `REGLES` de `scripts/verifier-tics.mjs`, avec un identifiant, la cible (`css`, `html`, `texte`, `titre` ou `js`), le niveau, le motif, un message et un conseil. Reporter aussi le tic dans le skill de design ou de rédaction, avec la raison, pour qu'il ne soit plus produit. Vérifier ensuite que le script passe toujours sur le site actuel.

À l'inverse, si une règle produit surtout des fausses alertes, la passer en avertissement ou resserrer son motif plutôt que de multiplier les `tics-ok`.
